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
@Table(name = "tb_tang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tang {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDTANG")
    private Integer idTang;
    
    @Column(name = "TENTANG", length = 50)
    private String tenTang;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDDVI")
    @JsonBackReference("donvi-tang")
    private DonVi donVi;
    
    @OneToMany(mappedBy = "tang", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("tang-phong")
    private List<Phong> danhSachPhong;
} 