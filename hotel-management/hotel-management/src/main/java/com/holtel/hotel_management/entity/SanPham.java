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
@Table(name = "tb_sanpham")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SanPham {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDSP")
    private Integer idSp;
    
    @Column(name = "TENSP", length = 100)
    private String tenSp;
    
    @Column(name = "DONGIA", precision = 10, scale = 2)
    private BigDecimal donGia;
    
    @Column(name = "MOTA", length = 255)
    private String moTa;
    
    @OneToMany(mappedBy = "sanPham", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DatPhongSanPham> danhSachDatPhongSanPham;
} 