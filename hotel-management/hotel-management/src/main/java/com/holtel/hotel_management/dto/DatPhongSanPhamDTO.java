package com.holtel.hotel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatPhongSanPhamDTO {
    private Integer idDpSp;
    private Integer idDatPhong;
    private Integer idSp;
    private Integer soLuong;
} 