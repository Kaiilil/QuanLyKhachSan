package com.holtel.hotel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangDTO {
    private Integer idKh;
    private String hoTen;
    private String cccd;
    private String soDienThoai;
    private String email;
    private String diaChi;
} 