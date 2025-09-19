package com.holtel.hotel_management.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

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
@Table(name = "tb_thanhtoan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThanhToan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDTT")
    private Integer idTt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDDATPHONG")
    @JsonBackReference("datphong-thanhtoan")
    private DatPhong datPhong;
    
    @Column(name = "NGAYTT")
    private LocalDate ngayTt;
    
    @Column(name = "NGAYDAT")
    private LocalDate ngayDat;
    
    @Column(name = "NGAYTRA")
    private LocalDate ngayTra;
    
    @Column(name = "SOTIEN", precision = 10, scale = 2)
    private BigDecimal soTien;
    
    @Column(name = "HINHTHUCTT", length = 50)
    private String hinhThucTt;
    
    @Column(name = "TRANGTHAI", length = 50)
    private String trangThai;
} 