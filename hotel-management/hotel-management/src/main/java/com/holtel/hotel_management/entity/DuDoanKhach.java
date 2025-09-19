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
@Table(name = "tb_dudoankhach")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DuDoanKhach {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;
    
    @Column(name = "THANG")
    private Integer thang;
    
    @Column(name = "NAM")
    private Integer nam;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MACTY")
    @JsonBackReference("congty-dudoankhach")
    private CongTy congTy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDDVI")
    @JsonBackReference("donvi-dudoankhach")
    private DonVi donVi;
    
    @Column(name = "DUDOAN_SOLUONGKHACH")
    private Integer duDoanSoLuongKhach;
} 