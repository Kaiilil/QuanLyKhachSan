package com.holtel.hotel_management.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.SanPham;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
    
    // Tìm sản phẩm theo tên có chứa từ khóa
    List<SanPham> findByTenSpContaining(String tenSp);
    
    // Tìm sản phẩm theo đơn giá
    List<SanPham> findByDonGia(BigDecimal donGia);
    
    // Tìm sản phẩm có đơn giá lớn hơn
    List<SanPham> findByDonGiaGreaterThan(BigDecimal donGia);
    
    // Tìm sản phẩm có đơn giá nhỏ hơn
    List<SanPham> findByDonGiaLessThan(BigDecimal donGia);
    
    // Tìm sản phẩm theo khoảng đơn giá
    List<SanPham> findByDonGiaBetween(BigDecimal minGia, BigDecimal maxGia);
    
    // Kiểm tra tồn tại theo tên
    boolean existsByTenSp(String tenSp);
    
    // Lấy danh sách sản phẩm theo thứ tự tên tăng dần
    List<SanPham> findAllByOrderByTenSpAsc();
    
    // Lấy danh sách sản phẩm theo thứ tự tên giảm dần
    List<SanPham> findAllByOrderByTenSpDesc();
    
    // Lấy danh sách sản phẩm theo thứ tự đơn giá tăng dần
    List<SanPham> findAllByOrderByDonGiaAsc();
    
    // Lấy danh sách sản phẩm theo thứ tự đơn giá giảm dần
    List<SanPham> findAllByOrderByDonGiaDesc();
    
    // Tìm sản phẩm theo mô tả
    List<SanPham> findByMoTaContaining(String keyword);
} 