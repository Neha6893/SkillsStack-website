package com.backend.backend_connectivity.servicelayer;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.backend_connectivity.entities.Users;
import com.backend.backend_connectivity.repository.UserRepository;

@Service
public class OtpService {

    @Autowired
    private UserRepository userRepository;

    // Generate 6-digit OTP
    public String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public String sendOtp(String mail) {
         //if user not exist create new user
        Users user = userRepository.findByMail(mail).orElse(null);
        if (user == null) {
            user=new Users(mail);
            userRepository.save(user);
        }      
        String otp = generateOtp();
        user.setOtp(otp);
        userRepository.save(user);

        System.out.println("OTP for " + mail + " is: " + otp);

        return otp;
    }

    public boolean verifyOtp(String mail, String otp) {
        Users user = userRepository.findByMail(mail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return otp.equals(user.getOtp());
    }
}
