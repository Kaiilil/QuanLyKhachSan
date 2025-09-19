package com.holtel.hotel_management.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LichSuPhongDTO {
    private Integer idLsp;
    private Integer idPhong;
    private LocalDateTime thoiGian;
    private String trangThai;
} 