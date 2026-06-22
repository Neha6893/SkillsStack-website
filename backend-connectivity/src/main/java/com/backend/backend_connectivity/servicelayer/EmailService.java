package com.backend.backend_connectivity.servicelayer;
import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.mail.SimpleMailMessage;
  import org.springframework.mail.javamail.JavaMailSender;
 import org.springframework.stereotype.Service;

 @Service public class EmailService {
     @Autowired
      private JavaMailSender mailSender;
     public void sendOtpMail(String to, String otp) { 
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setTo(to); message.setSubject("Your OTP Code"); 
        message.setText("Your OTP code is: " + otp + "\nIt will expire in 5 minutes.");
        mailSender.send(message);
     }
    }

































// package com.backend.backend_connectivity.servicelayer;
 

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.mail.javamail.MimeMessageHelper;
// import org.springframework.stereotype.Service;

// import jakarta.mail.MessagingException;
// import jakarta.mail.internet.MimeMessage;

// @Service
// public class EmailService {

//     @Autowired
//     private JavaMailSender mailSender;

//     public void sendOtpMail(String to, String otp) throws MessagingException {
//         MimeMessage message = mailSender.createMimeMessage();
//         MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

//         helper.setTo(to);
//         helper.setSubject("🔐 Your OTP Code");

//         // HTML content
//         String htmlContent = """
//                 <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
//                     <h2 style="color: #4CAF50;">Your OTP Verification</h2>
//                     <p style="font-size: 16px;">Hello,</p>
//                     <p style="font-size: 16px;">
//                         Your <b>One Time Password (OTP)</b> is:
//                     </p>
//                     <div style="margin: 20px 0; padding: 15px; background: #4CAF50; color: white; font-size: 22px; text-align: center; border-radius: 8px;">
//                         """ + otp + """
//                     </div>
//                     <p style="font-size: 14px; color: #555;">
//                         This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone.
//                     </p>
//                     <hr style="margin:20px 0;"/>
//                     <p style="font-size: 12px; color: #888;">
//                         If you didn’t request this, please ignore this email.
//                     </p>
//                 </div>
//                 """;

//         helper.setText(htmlContent, true); // true = send as HTML

//         mailSender.send(message);
//     }
// }
