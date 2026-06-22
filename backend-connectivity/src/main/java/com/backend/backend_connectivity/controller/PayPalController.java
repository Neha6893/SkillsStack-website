package com.backend.backend_connectivity.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend_connectivity.servicelayer.PayPalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

@RestController
@RequestMapping("/paypal")
@CrossOrigin("http://localhost:3000/")
public class PayPalController {

    @Autowired
    private PayPalService paypalService;

private static final String SUCCESS_URL  = "http://localhost:9090/paypal/success";
private static final String CANCEL_URL   = "http://localhost:9090/paypal/cancel";


@PostMapping("/pay")
public ResponseEntity<?> makePayment(@RequestParam double amount) {
    try {
        Payment payment = paypalService.createPayment(
                amount,
                "USD",
                "paypal",
                "sale",
                "Payment description",
                "https://yourdomain.com/paypal/cancel",
                "https://yourdomain.com/paypal/success"
        );

        for (Links link : payment.getLinks()) {
            if (link.getRel().equalsIgnoreCase("approval_url")) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "redirectUrl", link.getHref()
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Approval URL not found"));

    } catch (PayPalRESTException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
    }
}


     @GetMapping("/success")
    public String paymentSuccess(@RequestParam("paymentId") String paymentId , @RequestParam("PayerID") String payerId){

         Payment payment;
         try {
            payment = paypalService.execute(paymentId, payerId);
            if(payment.getState().equals("approved")){
             return "payment is successfully done";
         }
         } catch (PayPalRESTException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
         }

         return  "payment failed";
     }

}