package com.holtel.hotel_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.KhachHang;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    
    // Tìm khách hàng theo họ tên
    List<KhachHang> findByHoTen(String hoTen);
    
    // Tìm khách hàng theo số điện thoại
    Optional<KhachHang> findBySoDienThoai(String soDienThoai);
    
    // Tìm khách hàng theo email
    Optional<KhachHang> findByEmail(String email);
    
    // Tìm khách hàng theo cccd
    Optional<KhachHang> findByCccd(String cccd);
    
    // Tìm khách hàng theo họ tên và số điện thoại
    Optional<KhachHang> findByHoTenAndSoDienThoai(String hoTen, String soDienThoai);
    
    // Tìm khách hàng theo họ tên và email
    Optional<KhachHang> findByHoTenAndEmail(String hoTen, String email);
    
    // Kiểm tra tồn tại theo số điện thoại
    boolean existsBySoDienThoai(String soDienThoai);
    
    // Kiểm tra tồn tại theo email
    boolean existsByEmail(String email);
    
    // Kiểm tra tồn tại theo cccd
    boolean existsByCccd(String cccd);
    
    // Tìm khách hàng có chứa từ khóa trong họ tên
    @Query("SELECT k FROM KhachHang k WHERE k.hoTen LIKE %:keyword%")
    List<KhachHang> findByHoTenContaining(@Param("keyword") String keyword);
    
    // Tìm khách hàng có chứa từ khóa trong địa chỉ
    @Query("SELECT k FROM KhachHang k WHERE k.diaChi LIKE %:keyword%")
    List<KhachHang> findByDiaChiContaining(@Param("keyword") String keyword);
    
    // Tìm khách hàng theo số điện thoại có chứa từ khóa
    @Query("SELECT k FROM KhachHang k WHERE k.soDienThoai LIKE %:keyword%")
    List<KhachHang> findBySoDienThoaiContaining(@Param("keyword") String keyword);
    
    // Sắp xếp theo họ tên tăng dần
    List<KhachHang> findAllByOrderByHoTenAsc();
    
    // Sắp xếp theo họ tên giảm dần
    List<KhachHang> findAllByOrderByHoTenDesc();
    
    // Tìm khách hàng theo từ khóa (tìm trong họ tên, cccd, số điện thoại)
    @Query("SELECT k FROM KhachHang k WHERE k.hoTen LIKE %:keyword% OR k.cccd LIKE %:keyword% OR k.soDienThoai LIKE %:keyword%")
    List<KhachHang> findByKeyword(@Param("keyword") String keyword);
    
    // Tìm khách hàng có đặt phòng
    @Query("SELECT DISTINCT k FROM KhachHang k JOIN k.danhSachDatPhong d WHERE d IS NOT NULL")
    List<KhachHang> findKhachHangCoDatPhong();
    
    // Tìm khách hàng chưa đặt phòng
    @Query("SELECT k FROM KhachHang k WHERE k.danhSachDatPhong IS EMPTY")
    List<KhachHang> findKhachHangChuaDatPhong();
} 