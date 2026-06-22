package com.backend.backend_connectivity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.backend_connectivity.entities.Purchase;
import com.backend.backend_connectivity.entities.Users;
import com.backend.backend_connectivity.entities.Notes;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByBuyer(Users buyer);
    boolean existsByBuyerAndNote(Users buyer, Notes note);
}
