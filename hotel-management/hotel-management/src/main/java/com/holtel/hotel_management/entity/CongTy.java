package com.holtel.hotel_management.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_congty")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CongTy {
    
    @Id
    @Column(name = "MACTY", length = 50)
    private String maCty;
    
    @Column(name = "TENCTY", length = 100)
    private String tenCty;
    
    @OneToMany(mappedBy = "congTy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("congty-donvi")
    private List<DonVi> danhSachDonVi;
    
    @OneToMany(mappedBy = "congTy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("congty-dudoankhach")
    private List<DuDoanKhach> danhSachDuDoanKhach;
} 