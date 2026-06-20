
package com.backend.backend_connectivity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.backend_connectivity.entities.Users;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByMail(String mail);
}
