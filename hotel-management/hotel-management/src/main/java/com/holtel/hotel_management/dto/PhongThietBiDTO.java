package com.holtel.hotel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhongThietBiDTO {
    private Integer id;
    private Integer idPhong;
    private Integer idTb;
    private Integer soLuong;
} 