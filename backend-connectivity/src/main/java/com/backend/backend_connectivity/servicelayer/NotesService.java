package com.backend.backend_connectivity.servicelayer;

 
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.backend_connectivity.entities.Notes;
import com.backend.backend_connectivity.entities.Users;
import com.backend.backend_connectivity.repository.NotesRepository;
import com.backend.backend_connectivity.repository.UserRepository;

@Service
public class NotesService {

    @Autowired
    private NotesRepository notesRepository;

    @Autowired
    private UserRepository usersRepository;

    public Notes createNoteWithFiles(Long userId, Notes note, MultipartFile[] files) {
    Users user = usersRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Handle file saving (local folder or cloud)
    List<String> filePaths = new ArrayList<>();
    for (MultipartFile file : files) {
        try {
           String path = "C:\\Users\\n" + 
                               "eha6\\Documents\\MyCollegeProject\\backend-connectivity\\uploads\\" + file.getOriginalFilename(); 
        	//  String path = "C:\\Users" + 
            //          "\\laxmi_x6qcnsh\\Downloads\\backend-connectivity copy\\backend-connectivity\\uploads\\" + file.getOriginalFilename(); // local path

        	File dest = new File(path);
         
            file.transferTo(dest);
            filePaths.add(file.getOriginalFilename());
        } catch (Exception e) {
            throw new RuntimeException("File saving failed: " + file.getOriginalFilename(), e);
        }
    }

    note.setUser(user);
    note.setFiles(filePaths);
    user.setPoints(user.getPoints() + 20); // Award points for uploading
    usersRepository.save(user);
    return notesRepository.save(note);
}

    public List<Notes> getAllNotes(Long userId) {
        return notesRepository.findByUser_UserIdNot(userId);
    }

    public List<Notes> getUserNotes(Long userId) {
        return notesRepository.findByUser_UserId(userId);
    }


    public Map<String, Object> downloadNote(Long userId, Integer pointsRequired) {
    Users user = usersRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Map<String, Object> response = new HashMap<>();

    if (user.getPoints() < pointsRequired) {
        response.put("status", false);
        response.put("message", "Not enough points. Available: " + user.getPoints());
        return response;
    }

    // Deduct points
    user.setPoints(user.getPoints() - pointsRequired);
    usersRepository.save(user);

    response.put("status", true);
    response.put("remainingPoints", user.getPoints());
    return response;
}

}
