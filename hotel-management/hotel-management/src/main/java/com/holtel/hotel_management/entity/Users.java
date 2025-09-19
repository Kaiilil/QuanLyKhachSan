package com.holtel.hotel_management.entity;

import com.holtel.hotel_management.enums.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDUSER")
    private Integer idUser;
    
    @Column(name = "USERNAME", length = 50)
    private String username;
    
    @Column(name = "PASSWORD", length = 255)
    private String password;
    
    @Column(name = "EMAIL", length = 100)
    private String email;
    
    @Column(name = "SODIENTHOAI", length = 20)
    private String soDienThoai;

    @Column(name = "DIACHI", length = 255)
    private String diaChi;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDROLE")
    private Roles role;
    
    // Helper method để lấy UserRole enum
    public UserRole getUserRole() {
        return UserRole.fromId(role.getIdRole());
    }
    
    // Helper method để kiểm tra quyền admin
    public boolean isAdmin() {
        return role != null && role.getIdRole() == UserRole.ADMIN.getId();
    }
    
    // Helper method để kiểm tra quyền user
    public boolean isUser() {
        return role != null && role.getIdRole() == UserRole.USER.getId();
    }
} 