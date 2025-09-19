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
@Table(name = "tb_phong_thietbi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhongThietBi {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDPHONG")
    @JsonBackReference("phong-phongthietbi")
    private Phong phong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDTB")
    private ThietBi thietBi;
    
    @Column(name = "SOLUONG")
    private Integer soLuong;
} 