package com.backend.backend_connectivity.servicelayer;

import java.util.Optional;

import com.backend.backend_connectivity.entities.Users;

public interface SSService {
    public Optional<Users> getUser(String inputMail);
    public String saveUser(Users user);
    public String updateUser(String name,String phoneno,Users user);} 
