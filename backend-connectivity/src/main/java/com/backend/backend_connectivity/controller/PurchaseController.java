package com.backend.backend_connectivity.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend_connectivity.entities.Purchase;
import com.backend.backend_connectivity.entities.Users;
import com.backend.backend_connectivity.repository.NotesRepository;
import com.backend.backend_connectivity.repository.PurchaseRepository;
import com.backend.backend_connectivity.repository.UserRepository;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*")
public class PurchaseController {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotesRepository notesRepository;

    /**
     * ✅ API: Get all notes purchased by a user
     * URL example: GET /api/purchases/user?email=user@gmail.com
     */
        // Takes a user’s email as input.
        // Finds the Users entity with that email.
        // Fetches all purchases made by that user (findByBuyer(user)).
        // Extracts just the Note objects (not full purchase details).
        // Returns them as JSON.
    @GetMapping("/user")
    public ResponseEntity<?> getPurchasedNotes(@RequestParam String email) {
        Users user = userRepository.findByMail(email).get();
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<Purchase> purchases = purchaseRepository.findByBuyer(user);

        // Extract only the Notes details
        var purchasedNotes = purchases.stream()
                .map(Purchase::getNote)
                .collect(Collectors.toList());

        return ResponseEntity.ok(purchasedNotes);
    }
    @GetMapping("/check")
    public ResponseEntity<?> checkIfPurchased(
            @RequestParam String email,
            @RequestParam Long noteId) {
        Users user = userRepository.findByMail(email).get();
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("purchased", false, "message", "User not found"));
        }

        boolean purchased = purchaseRepository.existsByBuyerAndNote(
                user,
                notesRepository.findById(noteId).orElse(null)
        );

        return ResponseEntity.ok(Map.of("purchased", purchased));
    }
    
    @GetMapping("/earnings")
    public ResponseEntity<?> getEarnings(@RequestParam String email) {
        Users uploader = userRepository.findByMail(email).get();
        if (uploader == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        List<Purchase> allPurchases = purchaseRepository.findAll();

        List<Purchase> uploaderPurchases = allPurchases.stream()
                .filter(p -> p.getNote() != null &&
                             p.getNote().getUser() != null &&
                             p.getNote().getUser().getUserId().equals(uploader.getUserId()))
                .toList();

        // 🧾 Group by note
        var result = uploaderPurchases.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getNote().getTitle(),
                        Collectors.collectingAndThen(Collectors.toList(), list -> {
                            int pointDownloads = (int) list.stream()
                                    .filter(x -> "POINTS_DEDUCTION".equalsIgnoreCase(x.getPaymentId()))
                                    .count();

                            int razorpayDownloads = (int) list.stream()
                                    .filter(x -> !"POINTS_DEDUCTION".equalsIgnoreCase(x.getPaymentId()))
                                    .count();

                            int totalPurchases = list.size();
                            int notePrice = list.get(0).getNote().getPointsRequired();

                            // 💰 Money only from Razorpay, points only from points
                            int moneyEarnings = razorpayDownloads * notePrice;
                            int pointEarnings = pointDownloads * notePrice;

                            return Map.of(
                                    "noteId", list.get(0).getNote().getNoteId(),
                                    "title", list.get(0).getNote().getTitle(),
                                    "subject", list.get(0).getNote().getSubject(),
                                    "pointsRequired", notePrice,
                                    "pointsDownloads", pointDownloads,
                                    "razorpayDownloads", razorpayDownloads,
                                    "purchaseCount", totalPurchases,
                                    "moneyEarnings", moneyEarnings,
                                    "pointEarnings", pointEarnings
                            );
                        })
                ));

        int totalMoneyEarnings = uploaderPurchases.stream()
                .filter(p -> !"POINTS_DEDUCTION".equalsIgnoreCase(p.getPaymentId()))
                .mapToInt(p -> p.getNote().getPointsRequired())
                .sum();

        int totalPointEarnings = uploaderPurchases.stream()
                .filter(p -> "POINTS_DEDUCTION".equalsIgnoreCase(p.getPaymentId()))
                .mapToInt(p -> p.getNote().getPointsRequired())
                .sum();

        return ResponseEntity.ok(Map.of(
                "success", true,
                "totalMoneyEarnings", totalMoneyEarnings,
                "totalPointEarnings", totalPointEarnings,
                "notes", result.values()
        ));
    }


}
