package com.backend.backend_connectivity.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend_connectivity.entities.Users;
import com.backend.backend_connectivity.security.JwtUtil;
import com.backend.backend_connectivity.servicelayer.ServiceImplementation;



@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    ServiceImplementation service;
    @Autowired
    JwtUtil jwtUtil;


    @PutMapping("/update-user")
    public String updateUser(@RequestBody Map<String,String> user, @RequestHeader("Authorization") String token) {
        
        String email=jwtUtil.extractMail(token.substring(7));
        Users user1= service.getUser(email).get();
        // System.out.println(user);
        return service.updateUser(user.get("name"),user.get("phoneno"),user1);
    }
     @GetMapping("/getuser")
    public Users getUser( @RequestHeader("Authorization") String token) {
        
        String email=jwtUtil.extractMail(token.substring(7));
        Users user1= service.getUser(email).get();
      //  System.out.println(user);
        return user1;
    }
    

   
    
     
}
 