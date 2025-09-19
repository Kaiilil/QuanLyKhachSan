package com.holtel.hotel_management.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_datphong_sanpham")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatPhongSanPham {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDDP_SP")
    private Integer idDpSp;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDDATPHONG")
    @JsonBackReference("datphong-datphongsanpham")
    private DatPhong datPhong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDSP")
    private SanPham sanPham;
    
    @Column(name = "SOLUONG")
    private Integer soLuong;
} 