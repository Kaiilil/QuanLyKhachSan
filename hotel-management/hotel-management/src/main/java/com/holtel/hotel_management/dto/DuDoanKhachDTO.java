package com.holtel.hotel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DuDoanKhachDTO {
    private Integer id;
    private Integer thang;
    private Integer nam;
    private String maCty;
    private Integer idDvi;
    private Integer duDoanSoLuongKhach;
} 