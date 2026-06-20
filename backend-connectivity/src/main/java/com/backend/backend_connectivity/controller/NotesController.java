package com.backend.backend_connectivity.controller;

 

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
 import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.backend_connectivity.entities.Notes;
import com.backend.backend_connectivity.entities.Users;
import com.backend.backend_connectivity.repository.NotesRepository;
import com.backend.backend_connectivity.repository.UserRepository;
import com.backend.backend_connectivity.security.JwtUtil;
import com.backend.backend_connectivity.servicelayer.NotesService;
import com.backend.backend_connectivity.servicelayer.ServiceImplementation;

@RestController
@RequestMapping("/api/notes")
public class NotesController {

    @Autowired
    private NotesService notesService;
     @Autowired
    private NotesRepository notesRepository;

    @Autowired
    private UserRepository usersRepository;

    @Autowired
    ServiceImplementation service;
    @Autowired
    JwtUtil jwtUtil;

    @PostMapping(value = "/user", consumes = {"multipart/form-data"})
public Users createNote(
        
        @RequestPart("title") String title,
         @RequestPart("subject") String subject,  
          @RequestPart("pointsRequired") String pointsRequired,        // JSON part for note details
        @RequestPart("files") MultipartFile[] files,  // File array
@RequestHeader("Authorization") String token) {
       String email=jwtUtil.extractMail(token.substring(7));
        Users user= service.getUser(email).get();
        Notes note = new Notes();   
        note.setTitle(title);
        note.setSubject(subject);
        note.setPointsRequired(Integer.parseInt(pointsRequired));

    notesService.createNoteWithFiles(user.getUserId(),note , files);
    return user;
}

    // ✅ Get all notes of all users
    @GetMapping("/user/all")
    public List<Notes> getAllNotes(@RequestHeader("Authorization") String token) {
       String email=jwtUtil.extractMail(token.substring(7));
        Users user= service.getUser(email).get();
        return notesService.getAllNotes(user.getUserId());
    }
    // ✅ Get  all notes of all users
    @GetMapping("/home/all")
    public List<Notes> getAllNotesHome() {
        
        return notesRepository.findAll();
    }


    // ✅ Get all notes of a specific user
    @GetMapping("/user")
    public List<Notes> getUserNotes(@RequestHeader("Authorization") String token) {
        
       String email=jwtUtil.extractMail(token.substring(7));
        Users user= service.getUser(email).get();
        return notesService.getUserNotes(user.getUserId());
    }

/* 
@PostMapping("/user/download")
public Map<String, Object> downloadNote(
        
        @RequestParam Integer pointsRequired,
        @RequestHeader("Authorization") String token) {
       String email=jwtUtil.extractMail(token.substring(7));
        Users user= service.getUser(email).get();
    return notesService.downloadNote(user.getUserId(), pointsRequired);
}
*/
@GetMapping("/user/download/{noteId}")
public ResponseEntity<?> downloadNote(
        @PathVariable Long noteId,
        @RequestHeader("Authorization") String token) throws Exception {

    // authenticate user (your code)
    String email = jwtUtil.extractMail(token.substring(7));
    Users user = service.getUser(email).get();

    Notes note = notesRepository.findById(noteId)
               .orElseThrow(() -> new RuntimeException("Note not found"));

    if (user.getPoints() < note.getPointsRequired()) {
        return ResponseEntity.status(403).body("Not enough points to download this note");
    }

    // Deduct points and save
    user.setPoints(user.getPoints() - note.getPointsRequired());
    usersRepository.save(user);

    // Get filename safely (handle if DB contains full path or just name)
    String stored = note.getFiles().get(0); // whatever you stored
    String filename = Paths.get(stored).getFileName().toString(); // safe extraction

    Path filePath = Paths.get("uploads").resolve(filename).normalize();
    File file = filePath.toFile();
    if (!file.exists()) {
        return ResponseEntity.status(404).body("File not found");
    }

    String contentType = Files.probeContentType(filePath);
    if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

    InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

    // IMPORTANT: put filename in quotes (and optionally encode for unicode)
    return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .body(resource);
}

}

