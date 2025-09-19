package com.holtel.hotel_management.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThanhToanDTO {
    private Integer idTt;
    private Integer idDatPhong;
    private LocalDate ngayTt;
    private LocalDate ngayDat;
    private LocalDate ngayTra;
    private BigDecimal soTien;
    private String hinhThucTt;
    private String trangThai;
} 