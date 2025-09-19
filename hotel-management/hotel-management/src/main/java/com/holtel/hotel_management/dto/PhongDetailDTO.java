package com.holtel.hotel_management.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhongDetailDTO {
    // Thông tin cơ bản
    private Integer idPhong;
    private String tenPhong;
    private String trangThai;
    private String anhPhong;
    
    // Thông tin tầng
    private Integer idTang;
    private String tenTang;
    
    // Thông tin loại phòng
    private Integer idLoaiPhong;
    private String tenLoaiPhong;
    private java.math.BigDecimal gia;
    private String moTa;
    
    // Thông tin đơn vị
    private Integer idDvi;
    private String tenDvi;
    
    // Thông tin công ty
    private String maCty;
    private String tenCty;
    
    // Danh sách thiết bị trong phòng
    private List<PhongThietBiDTO> danhSachThietBi;
    
    // Danh sách lịch sử phòng
    private List<LichSuPhongDTO> danhSachLichSu;
    
    // Danh sách đặt phòng hiện tại
    private List<DatPhongDTO> danhSachDatPhong;
    
    // Thống kê
    private Long soLuongDatPhong;
    private Long soLuongThietBi;
    private Long soLuongLichSu;
}
