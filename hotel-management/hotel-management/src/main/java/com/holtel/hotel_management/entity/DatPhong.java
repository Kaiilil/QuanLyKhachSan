package com.holtel.hotel_management.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_datphong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatPhong {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDDATPHONG")
    private Integer idDatPhong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDPHONG")
    @JsonBackReference("phong-datphong")
    private Phong phong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDKH")
    @JsonBackReference("khachhang-datphong")
    private KhachHang khachHang;
    
    @Column(name = "NGAYDAT")
    private LocalDate ngayDat;
    
    @Column(name = "NGAYTRA")
    private LocalDate ngayTra;
    
    @Column(name = "TRANGTHAI", length = 50)
    private String trangThai;
    
    @OneToMany(mappedBy = "datPhong", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("datphong-thanhtoan")
    private List<ThanhToan> danhSachThanhToan;
    
    @OneToMany(mappedBy = "datPhong", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("datphong-datphongsanpham")
    private List<DatPhongSanPham> danhSachDatPhongSanPham;
} 