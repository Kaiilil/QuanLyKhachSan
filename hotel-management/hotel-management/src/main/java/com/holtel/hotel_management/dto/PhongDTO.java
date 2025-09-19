package com.holtel.hotel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhongDTO {
    private Integer idPhong;
    private String tenPhong;
    private Integer idTang;
    private Integer idLoaiPhong;
    private Integer idDvi;
    private String anhPhong;
    private String trangThai;
} 