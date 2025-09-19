package com.holtel.hotel_management.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoaiPhongDTO {
    private Integer idLoaiPhong;
    private String tenLoaiPhong;
    private BigDecimal gia;
    private String moTa;
    private String hinhAnh;
} 