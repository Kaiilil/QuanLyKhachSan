package com.holtel.hotel_management.entity;

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
@Table(name = "tb_phong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Phong {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPHONG")
    private Integer idPhong;
    
    @Column(name = "TENPHONG", length = 50)
    private String tenPhong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDTANG")
    @JsonBackReference("tang-phong")
    private Tang tang;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDLOAIPHONG")
    @JsonBackReference
    private LoaiPhong loaiPhong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDDVI")
    private DonVi donVi;
    
    @Column(name = "ANHPHONG", length = 255)
    private String anhPhong;
    
    @Column(name = "TRANGTHAI", length = 50)
    private String trangThai;
    
    @OneToMany(mappedBy = "phong", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("phong-datphong")
    private List<DatPhong> danhSachDatPhong;
    
    @OneToMany(mappedBy = "phong", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("phong-phongthietbi")
    private List<PhongThietBi> danhSachPhongThietBi;
    
    @OneToMany(mappedBy = "phong", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("phong-lichsuphong")
    private List<LichSuPhong> danhSachLichSuPhong;
} 