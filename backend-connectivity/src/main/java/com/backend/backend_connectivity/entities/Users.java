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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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

}
