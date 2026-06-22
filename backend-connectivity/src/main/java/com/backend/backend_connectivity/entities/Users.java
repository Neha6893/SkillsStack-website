package com.backend.backend_connectivity.entities;


import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Data
@Entity
@Table(name="Users",uniqueConstraints = {@UniqueConstraint(columnNames = "mail")})
public class Users{
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    private Long userId;
    @Column(nullable = true)
    private String mail;
    @Column(nullable = true)
    private String otp;
    @Column(nullable = true)
    private String name;
    @Column(name = "phone_no",length = 20)
    private String phoneno;
    // private boolean status=false;
    @Column(columnDefinition = "int default 25")
    private Integer points=25;
    // private NotesDetails notes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Notes> notes;

   public Users(String mail){
        this.mail=mail;
    }

public Long getUserId() {
	return userId;
}

public void setUserId(Long userId) {
	this.userId = userId;
}

public String getMail() {
	return mail;
}

public void setMail(String mail) {
	this.mail = mail;
}

public String getOtp() {
	return otp;
}

public void setOtp(String otp) {
	this.otp = otp;
}

public String getName() {
	return name;
}

public void setName(String name) {
	this.name = name;
}

public String getPhoneno() {
	return phoneno;
}

public void setPhoneno(String phoneno) {
	this.phoneno = phoneno;
}

public Integer getPoints() {
	return points;
}

public void setPoints(Integer points) {
	this.points = points;
}

public List<Notes> getNotes() {
	return notes;
}

public void setNotes(List<Notes> notes) {
	this.notes = notes;
}

public Users(Long userId, String mail, String otp, String name, String phoneno, Integer points, List<Notes> notes) {
	super();
	this.userId = userId;
	this.mail = mail;
	this.otp = otp;
	this.name = name;
	this.phoneno = phoneno;
	this.points = points;
	this.notes = notes;
}

public Users() {
	super();
}
   
   
   
   

}
