package com.holtel.hotel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String username;
    private String email;
    private Integer userId;
    private Integer idRole;
    private String roleName;
    private String message;
    private boolean success;
} 