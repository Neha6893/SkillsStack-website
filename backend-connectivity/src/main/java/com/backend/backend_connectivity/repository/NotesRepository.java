package com.backend.backend_connectivity.repository;

 
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.backend_connectivity.entities.Notes;

public interface NotesRepository extends JpaRepository<Notes, Long> {
    List<Notes> findByUser_UserId(Long userId); // fetch notes by user
    List<Notes> findByUser_UserIdNot(Long userId);

}

