package com.holtel.hotel_management.repository;

import com.holtel.hotel_management.entity.DuDoanKhach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DuDoanKhachRepository extends JpaRepository<DuDoanKhach, Integer> {
    
    // Tìm dự đoán theo tháng và năm
    List<DuDoanKhach> findByThangAndNam(Integer thang, Integer nam);
    
    // Tìm dự đoán theo tháng
    List<DuDoanKhach> findByThang(Integer thang);
    
    // Tìm dự đoán theo năm
    List<DuDoanKhach> findByNam(Integer nam);
    
    // Tìm dự đoán theo công ty
    List<DuDoanKhach> findByCongTy_MaCty(String maCty);
    
    // Tìm dự đoán theo đơn vị
    List<DuDoanKhach> findByDonVi_IdDvi(Integer idDvi);
    
    // Tìm dự đoán theo công ty và tháng năm
    List<DuDoanKhach> findByCongTy_MaCtyAndThangAndNam(String maCty, Integer thang, Integer nam);
    
    // Tìm dự đoán theo đơn vị và tháng năm
    List<DuDoanKhach> findByDonVi_IdDviAndThangAndNam(Integer idDvi, Integer thang, Integer nam);
    
    // Tìm dự đoán theo số lượng khách dự đoán
    List<DuDoanKhach> findByDuDoanSoLuongKhach(Integer duDoanSoLuongKhach);
    
    // Tìm dự đoán theo khoảng số lượng khách
    List<DuDoanKhach> findByDuDoanSoLuongKhachBetween(Integer minSoLuong, Integer maxSoLuong);
    
    // Tìm dự đoán theo công ty và sắp xếp theo tháng năm
    List<DuDoanKhach> findByCongTy_MaCtyOrderByNamAscThangAsc(String maCty);
    
    // Tìm dự đoán theo đơn vị và sắp xếp theo tháng năm
    List<DuDoanKhach> findByDonVi_IdDviOrderByNamAscThangAsc(Integer idDvi);
    
    // Tìm dự đoán theo năm và sắp xếp theo tháng
    List<DuDoanKhach> findByNamOrderByThangAsc(Integer nam);
    
    // Tìm dự đoán theo tháng và sắp xếp theo năm
    List<DuDoanKhach> findByThangOrderByNamAsc(Integer thang);
    
    // Đếm số dự đoán theo tháng năm
    long countByThangAndNam(Integer thang, Integer nam);
    
    // Đếm số dự đoán theo công ty
    long countByCongTy_MaCty(String maCty);
    
    // Đếm số dự đoán theo đơn vị
    long countByDonVi_IdDvi(Integer idDvi);
    
    // Tính tổng số lượng khách dự đoán theo công ty
    @Query("SELECT SUM(d.duDoanSoLuongKhach) FROM DuDoanKhach d WHERE d.congTy.maCty = :maCty")
    Integer sumDuDoanSoLuongKhachByCongTy(@Param("maCty") String maCty);
    
    // Tính tổng số lượng khách dự đoán theo đơn vị
    @Query("SELECT SUM(d.duDoanSoLuongKhach) FROM DuDoanKhach d WHERE d.donVi.idDvi = :idDvi")
    Integer sumDuDoanSoLuongKhachByDonVi(@Param("idDvi") Integer idDvi);
    
    // Tính tổng số lượng khách dự đoán theo tháng năm
    @Query("SELECT SUM(d.duDoanSoLuongKhach) FROM DuDoanKhach d WHERE d.thang = :thang AND d.nam = :nam")
    Integer sumDuDoanSoLuongKhachByThangNam(@Param("thang") Integer thang, @Param("nam") Integer nam);
    
    // Tìm dự đoán có số lượng khách cao nhất theo công ty
    @Query("SELECT d FROM DuDoanKhach d WHERE d.congTy.maCty = :maCty AND d.duDoanSoLuongKhach = (SELECT MAX(d2.duDoanSoLuongKhach) FROM DuDoanKhach d2 WHERE d2.congTy.maCty = :maCty)")
    List<DuDoanKhach> findDuDoanKhachMaxByCongTy(@Param("maCty") String maCty);
    
    // Tìm dự đoán có số lượng khách thấp nhất theo công ty
    @Query("SELECT d FROM DuDoanKhach d WHERE d.congTy.maCty = :maCty AND d.duDoanSoLuongKhach = (SELECT MIN(d2.duDoanSoLuongKhach) FROM DuDoanKhach d2 WHERE d2.congTy.maCty = :maCty)")
    List<DuDoanKhach> findDuDoanKhachMinByCongTy(@Param("maCty") String maCty);
} 