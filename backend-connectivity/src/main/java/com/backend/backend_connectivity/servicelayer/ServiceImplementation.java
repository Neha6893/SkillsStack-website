package com.backend.backend_connectivity.servicelayer;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.backend_connectivity.entities.Users;
import com.backend.backend_connectivity.repository.UserRepository;

@Service
public class ServiceImplementation implements SSService {
    @Autowired
    UserRepository repository;

    @Override
    public Optional<Users> getUser(String inputMail) {
        Optional<Users> users = repository.findByMail(inputMail);
        return users;
    }

    @Override
    public String saveUser(Users user) {
        repository.save(user);  
        return "Done";
    }
    @Override
    public String updateUser(String name,String phoneno,Users user) {
        user.setName(name);
        user.setPhoneno(phoneno);
        repository.save(user);  
        return "Done";
    }
    @Override
    public Boolean deleteUser(Users user) {
        repository.delete(user);  
        return true;
    }
}
