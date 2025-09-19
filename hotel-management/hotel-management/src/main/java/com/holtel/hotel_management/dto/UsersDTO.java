package com.holtel.hotel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsersDTO {
    private Integer idUser;
    private String username;
    private String email;
    private String soDienThoai;
    private String diaChi;
    private Integer idRole;
} 