package com.holtel.hotel_management.entity;

import java.time.LocalDateTime;

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
@Table(name = "tb_lichsuphong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LichSuPhong {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDLSP")
    private Integer idLsp;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDPHONG")
    @JsonBackReference("phong-lichsuphong")
    private Phong phong;
    
    @Column(name = "THOIGIAN")
    private LocalDateTime thoiGian;
    
    @Column(name = "TRANGTHAI", length = 50)
    private String trangThai;
} 