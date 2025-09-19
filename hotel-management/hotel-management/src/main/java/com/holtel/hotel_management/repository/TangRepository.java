package com.holtel.hotel_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.Tang;

@Repository
public interface TangRepository extends JpaRepository<Tang, Integer> {
    
    // Tìm tầng theo tên
    List<Tang> findByTenTang(String tenTang);
    
    // Tìm tất cả tầng theo đơn vị
    List<Tang> findByDonVi_IdDvi(Integer idDvi);
    
    // Tìm tầng theo đơn vị và tên tầng
    Optional<Tang> findByDonVi_IdDviAndTenTang(Integer idDvi, String tenTang);
    
    // Tìm tầng theo mã công ty
    List<Tang> findByDonVi_CongTy_MaCty(String maCty);
    
    // Kiểm tra tồn tại theo tên tầng
    boolean existsByTenTang(String tenTang);
    
    // Đếm số tầng theo đơn vị
    long countByDonVi_IdDvi(Integer idDvi);
    
    // Tìm tầng có chứa từ khóa trong tên
    @Query("SELECT t FROM Tang t WHERE t.tenTang LIKE %:keyword%")
    List<Tang> findByTenTangContaining(@Param("keyword") String keyword);
    
    // Tìm tầng theo đơn vị và sắp xếp theo tên
    List<Tang> findByDonVi_IdDviOrderByTenTang(Integer idDvi);
} 