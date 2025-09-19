package com.holtel.hotel_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.CongTy;

@Repository
public interface CongTyRepository extends JpaRepository<CongTy, String> {
    
    // Tìm công ty theo mã công ty
    Optional<CongTy> findByMaCty(String maCty);
    
    // Tìm công ty theo tên công ty
    Optional<CongTy> findByTenCty(String tenCty);
    
    // Kiểm tra tồn tại theo mã công ty
    boolean existsByMaCty(String maCty);
    
    // Kiểm tra tồn tại theo tên công ty
    boolean existsByTenCty(String tenCty);
} 