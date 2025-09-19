package com.holtel.hotel_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.DonVi;

@Repository
public interface DonViRepository extends JpaRepository<DonVi, Integer> {
    
    // Tìm đơn vị theo tên
    Optional<DonVi> findByTenDvi(String tenDvi);
    
    // Tìm tất cả đơn vị theo mã công ty
    List<DonVi> findByCongTy_MaCty(String maCty);
    
    // Tìm đơn vị theo mã công ty và tên đơn vị
    Optional<DonVi> findByCongTy_MaCtyAndTenDvi(String maCty, String tenDvi);
    
    // Kiểm tra tồn tại theo tên đơn vị
    boolean existsByTenDvi(String tenDvi);
    
    // Đếm số đơn vị theo mã công ty
    long countByCongTy_MaCty(String maCty);
    
    // Tìm đơn vị có chứa từ khóa trong tên
    @Query("SELECT d FROM DonVi d WHERE d.tenDvi LIKE %:keyword%")
    List<DonVi> findByTenDviContaining(@Param("keyword") String keyword);
} 