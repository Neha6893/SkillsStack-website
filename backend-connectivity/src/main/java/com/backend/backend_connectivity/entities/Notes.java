package com.backend.backend_connectivity.entities;

 
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
// @NoArgsConstructor
// @AllArgsConstructor
@Entity
@Table(name="Notes")
public class Notes {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noteId;

    private String title;
    private String subject;

    @Column(name = "points_required", nullable = false)
    private Integer pointsRequired;

    // One note can have multiple files
    @ElementCollection
    @CollectionTable(name = "note_files", joinColumns = @JoinColumn(name = "note_id"))
    @Column(name = "file_url")  // store file URLs / paths
    private List<String> files;

    // Many Notes belong to one User
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

	public Long getNoteId() {
		return noteId;
	}

	public void setNoteId(Long noteId) {
		this.noteId = noteId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public Integer getPointsRequired() {
		return pointsRequired;
	}

	public void setPointsRequired(Integer pointsRequired) {
		this.pointsRequired = pointsRequired;
	}

	public List<String> getFiles() {
		return files;
	}

	public void setFiles(List<String> files) {
		this.files = files;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public Notes(Long noteId, String title, String subject, Integer pointsRequired, List<String> files, Users user) {
		super();
		this.noteId = noteId;
		this.title = title;
		this.subject = subject;
		this.pointsRequired = pointsRequired;
		this.files = files;
		this.user = user;
	}

	public Notes() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
    
    
    
}
