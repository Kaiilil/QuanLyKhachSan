package com.holtel.hotel_management.entity;

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
@Table(name = "tb_thietbi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThietBi {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDTB")
    private Integer idTb;
    
    @Column(name = "TENTB", length = 100)
    private String tenTb;
    
    @Column(name = "MOTA", length = 255)
    private String moTa;
    
    @OneToMany(mappedBy = "thietBi", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PhongThietBi> danhSachPhongThietBi;
} 