package com.holtel.hotel_management.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

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
@Table(name = "tb_donvi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonVi {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDDVI")
    private Integer idDvi;
    
    @Column(name = "TENDVI", length = 100)
    private String tenDvi;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MACTY")
    @JsonBackReference("congty-donvi")
    private CongTy congTy;
    
    @OneToMany(mappedBy = "donVi", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("donvi-tang")
    private List<Tang> danhSachTang;
    
    @OneToMany(mappedBy = "donVi", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("donvi-dudoankhach")
    private List<DuDoanKhach> danhSachDuDoanKhach;
} 