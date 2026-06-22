package com.backend.backend_connectivity.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend_connectivity.entities.Users;
import com.backend.backend_connectivity.security.JwtUtil;
import com.backend.backend_connectivity.servicelayer.EmailService;
import com.backend.backend_connectivity.servicelayer.OtpService;
import com.backend.backend_connectivity.servicelayer.ServiceImplementation;

@RestController
@RequestMapping("/auth")
@CrossOrigin("http://localhost:3000/")
public class AuthController {
    @Autowired
    private OtpService otpService;
    @Autowired
    ServiceImplementation service;
    @Autowired
    private EmailService emailService;

    @Deprecated
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/request-otp1")
    public String requestOtp1() {
        return "hi Neha";
    }

    // Step 1: Request OTP

    @PostMapping("/request-otp")
    public Map<String, String> requestOtp(@RequestParam String mail) throws Exception {
        String otp = otpService.sendOtp(mail); 

        // Send mail change comment
        emailService.sendOtpMail(mail, otp);

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully to " + mail + " " + otp);
        return response;
    }

    // Step 2: Verify OTP & generate JWT
    @Deprecated
    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestParam String mail, @RequestParam String otp) {
        System.out.println(otp);
        Map<String, Object> response = new HashMap<>();
        if (otpService.verifyOtp(mail, otp)) {
            String token = jwtUtil.generateToken(mail);
            Users user = service.getUser(mail).get();
            response.put("message", "OTP verified successfully");
            response.put("status", true);
            response.put("token", token);
            response.put("user", user);
        } else {
            response.put("message", "Invalid OTP");
            response.put("status", false);

        }
        return response;
    }
}
