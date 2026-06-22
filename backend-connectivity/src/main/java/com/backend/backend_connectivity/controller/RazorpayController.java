package com.backend.backend_connectivity.controller;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend_connectivity.entities.Notes;
import com.backend.backend_connectivity.entities.Purchase;
import com.backend.backend_connectivity.entities.Users;
import com.backend.backend_connectivity.repository.NotesRepository;
import com.backend.backend_connectivity.repository.PurchaseRepository;
import com.backend.backend_connectivity.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@RestController
@RequestMapping("/razorpay")
@CrossOrigin(origins = "*")
public class RazorpayController {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private NotesRepository notesRepository;

	@Autowired
	private PurchaseRepository purchaseRepository;
     
    private String razorpayKeyId="rzp_test_aNNdd7yTcNuzYQ";
 
    private String razorpayKeySecret="O9jzpGZzixxQp1iNXSheMDuN";
    
    

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam double amount) {
        try {
            // Initialize Razorpay client
        	System.out.println("hi create"+razorpayKeyId+razorpayKeySecret);
        	
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Create order request
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(amount * 100)); // amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1); // auto capture

            Order order = razorpay.orders.create(orderRequest);

            JSONObject response = new JSONObject();
            response.put("orderId", order.get("id").toString());
            response.put("amount", order.get("amount").toString());
            response.put("currency", "INR");
            response.put("key", razorpayKeyId);

            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating Razorpay order: " + e.getMessage());
        }
    }
    

@PostMapping("/verify")
public ResponseEntity<?> verifyPayment(
        @RequestBody Map<String, String> data,
        @RequestParam Long noteId,
        @RequestParam String userEmail
) {
    String orderId = data.get("razorpay_order_id");
    String paymentId = data.get("razorpay_payment_id");
    String signature = data.get("razorpay_signature");

    try {
        String payload = orderId + "|" + paymentId;
        String generatedSignature = hmacSHA256(payload, razorpayKeySecret);

        if (!generatedSignature.equals(signature)) {
            return ResponseEntity.status(400).body(Map.of(
                "success", false,
                "message", "Invalid payment signature"
            ));
        }

        // ✅ Valid payment → record purchase
        Users buyer = userRepository.findByMail(userEmail).get();
        Notes note = notesRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        // Prevent duplicate purchases
        if (purchaseRepository.existsByBuyerAndNote(buyer, note)) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "You already purchased this note."
            ));
        }

        Purchase purchase = new Purchase();
        purchase.setBuyer(buyer);
        purchase.setNote(note);
        purchase.setPaymentId(paymentId);
        purchase.setOrderId(orderId);
        purchase.setStatus("SUCCESS");
        purchaseRepository.save(purchase);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Payment verified and note added to your purchases."
        ));

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body(Map.of(
            "success", false,
            "message", "Verification failed: " + e.getMessage()
        ));
    }
}
    private String hmacSHA256(String data, String secret) throws Exception {
        javax.crypto.Mac sha256_HMAC = javax.crypto.Mac.getInstance("HmacSHA256");
        javax.crypto.spec.SecretKeySpec secretKey =
                new javax.crypto.spec.SecretKeySpec(secret.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secretKey);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes());
        return bytesToHex(hash);
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

}
