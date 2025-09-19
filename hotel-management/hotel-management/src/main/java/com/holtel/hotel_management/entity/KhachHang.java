package com.holtel.hotel_management.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

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
@Table(name = "tb_khachhang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHang {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDKH")
    private Integer idKh;
    
    @Column(name = "HOTEN", length = 100)
    private String hoTen;
    
    @Column(name = "CCCD", length = 20)
    private String cccd;
    
    @Column(name = "SDT", length = 15)
    private String soDienThoai;
    
    @Column(name = "EMAIL", length = 100)
    private String email;
    
    @Column(name = "DIACHI", length = 255)
    private String diaChi;
    
    @OneToMany(mappedBy = "khachHang", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("khachhang-datphong")
    private List<DatPhong> danhSachDatPhong;
} 