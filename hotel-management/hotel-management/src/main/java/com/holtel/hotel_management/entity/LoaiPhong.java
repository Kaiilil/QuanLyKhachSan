package com.holtel.hotel_management.entity;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_loaiphong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoaiPhong {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDLOAIPHONG")
    private Integer idLoaiPhong;
    
    @Column(name = "TENLOAIPHONG", length = 100)
    private String tenLoaiPhong;
    
    @Column(name = "GIA", precision = 10, scale = 2)
    private BigDecimal gia;
    
    @Column(name = "MOTA", length = 255)
    private String moTa;
    
    @Column(name = "HINHANH", length = 255)
    private String hinhAnh;
    
    @OneToMany(mappedBy = "loaiPhong", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Phong> danhSachPhong;
} 