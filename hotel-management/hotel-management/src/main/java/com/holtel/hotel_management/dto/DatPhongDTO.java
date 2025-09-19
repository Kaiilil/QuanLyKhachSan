package com.holtel.hotel_management.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatPhongDTO {
    private Integer idDatPhong;
    private Integer idPhong;
    private Integer idKh;
    private LocalDate ngayDat;
    private LocalDate ngayTra;
    private String trangThai;
} 