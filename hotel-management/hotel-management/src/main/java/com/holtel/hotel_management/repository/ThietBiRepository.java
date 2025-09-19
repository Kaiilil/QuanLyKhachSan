package com.holtel.hotel_management.repository;

import com.holtel.hotel_management.entity.ThietBi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThietBiRepository extends JpaRepository<ThietBi, Integer> {
    
    // Tìm thiết bị theo tên
    Optional<ThietBi> findByTenTb(String tenTb);
    
    // Kiểm tra tồn tại theo tên thiết bị
    boolean existsByTenTb(String tenTb);
    
    // Tìm thiết bị có chứa từ khóa trong tên
    @Query("SELECT t FROM ThietBi t WHERE t.tenTb LIKE %:keyword%")
    List<ThietBi> findByTenTbContaining(@Param("keyword") String keyword);
    
    // Tìm thiết bị có chứa từ khóa trong mô tả
    @Query("SELECT t FROM ThietBi t WHERE t.moTa LIKE %:keyword%")
    List<ThietBi> findByMoTaContaining(@Param("keyword") String keyword);
    
    // Tìm thiết bị theo từ khóa (tìm trong tên và mô tả)
    @Query("SELECT t FROM ThietBi t WHERE t.tenTb LIKE %:keyword% OR t.moTa LIKE %:keyword%")
    List<ThietBi> findByKeyword(@Param("keyword") String keyword);
    
    // Sắp xếp theo tên thiết bị tăng dần
    List<ThietBi> findAllByOrderByTenTbAsc();
    
    // Sắp xếp theo tên thiết bị giảm dần
    List<ThietBi> findAllByOrderByTenTbDesc();
    
    // Đếm số thiết bị
    long count();
    
    // Tìm thiết bị được sử dụng trong phòng
    @Query("SELECT DISTINCT t FROM ThietBi t JOIN t.danhSachPhongThietBi pt WHERE pt IS NOT NULL")
    List<ThietBi> findThietBiDuocSuDung();
    
    // Tìm thiết bị chưa được sử dụng trong phòng nào
    @Query("SELECT t FROM ThietBi t WHERE t.danhSachPhongThietBi IS EMPTY")
    List<ThietBi> findThietBiChuaSuDung();
    
    // Đếm số phòng sử dụng thiết bị
    @Query("SELECT COUNT(DISTINCT pt.phong.idPhong) FROM ThietBi t JOIN t.danhSachPhongThietBi pt WHERE t.idTb = :idTb")
    long countPhongSuDungThietBi(@Param("idTb") Integer idTb);
    
    // Tính tổng số lượng thiết bị trong tất cả phòng
    @Query("SELECT SUM(pt.soLuong) FROM ThietBi t JOIN t.danhSachPhongThietBi pt WHERE t.idTb = :idTb")
    Integer sumSoLuongThietBi(@Param("idTb") Integer idTb);
} 