package com.holtel.hotel_management.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.LoaiPhong;

@Repository
public interface LoaiPhongRepository extends JpaRepository<LoaiPhong, Integer> {
    
    // Tìm loại phòng theo tên
    Optional<LoaiPhong> findByTenLoaiPhong(String tenLoaiPhong);
    
    // Tìm loại phòng theo giá
    List<LoaiPhong> findByGia(BigDecimal gia);
    
    // Tìm loại phòng có giá lớn hơn
    List<LoaiPhong> findByGiaGreaterThan(BigDecimal gia);
    
    // Tìm loại phòng có giá nhỏ hơn
    List<LoaiPhong> findByGiaLessThan(BigDecimal gia);
    
    // Tìm loại phòng theo khoảng giá
    List<LoaiPhong> findByGiaBetween(BigDecimal minGia, BigDecimal maxGia);
    
    // Kiểm tra tồn tại theo tên loại phòng
    boolean existsByTenLoaiPhong(String tenLoaiPhong);
    
    // Tìm loại phòng có chứa từ khóa trong tên
    @Query("SELECT l FROM LoaiPhong l WHERE l.tenLoaiPhong LIKE %:keyword%")
    List<LoaiPhong> findByTenLoaiPhongContaining(@Param("keyword") String keyword);
    
    // Sắp xếp theo giá tăng dần
    List<LoaiPhong> findAllByOrderByGiaAsc();
    
    // Sắp xếp theo giá giảm dần
    List<LoaiPhong> findAllByOrderByGiaDesc();
    
    // Tìm loại phòng có giá cao nhất
    @Query("SELECT l FROM LoaiPhong l WHERE l.gia = (SELECT MAX(l2.gia) FROM LoaiPhong l2)")
    List<LoaiPhong> findLoaiPhongWithMaxGia();
    
    // Tìm loại phòng có giá thấp nhất
    @Query("SELECT l FROM LoaiPhong l WHERE l.gia = (SELECT MIN(l2.gia) FROM LoaiPhong l2)")
    List<LoaiPhong> findLoaiPhongWithMinGia();
} 