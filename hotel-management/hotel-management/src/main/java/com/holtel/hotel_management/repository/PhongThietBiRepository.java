package com.holtel.hotel_management.repository;

import com.holtel.hotel_management.entity.PhongThietBi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhongThietBiRepository extends JpaRepository<PhongThietBi, Integer> {
    
    // Tìm theo phòng
    List<PhongThietBi> findByPhong_IdPhong(Integer idPhong);
    
    // Tìm theo thiết bị
    List<PhongThietBi> findByThietBi_IdTb(Integer idTb);
    
    // Tìm theo phòng và thiết bị
    Optional<PhongThietBi> findByPhong_IdPhongAndThietBi_IdTb(Integer idPhong, Integer idTb);
    
    // Tìm theo số lượng
    List<PhongThietBi> findBySoLuong(Integer soLuong);
    
    // Tìm theo số lượng lớn hơn
    List<PhongThietBi> findBySoLuongGreaterThan(Integer soLuong);
    
    // Tìm theo số lượng nhỏ hơn
    List<PhongThietBi> findBySoLuongLessThan(Integer soLuong);
    
    // Tìm theo khoảng số lượng
    List<PhongThietBi> findBySoLuongBetween(Integer minSoLuong, Integer maxSoLuong);
    
    // Kiểm tra tồn tại theo phòng và thiết bị
    boolean existsByPhong_IdPhongAndThietBi_IdTb(Integer idPhong, Integer idTb);
    
    // Đếm số thiết bị theo phòng
    long countByPhong_IdPhong(Integer idPhong);
    
    // Đếm số phòng theo thiết bị
    long countByThietBi_IdTb(Integer idTb);
    
    // Đếm số phòng theo số lượng thiết bị
    long countBySoLuong(Integer soLuong);
    
    // Tính tổng số lượng thiết bị theo phòng
    @Query("SELECT SUM(pt.soLuong) FROM PhongThietBi pt WHERE pt.phong.idPhong = :idPhong")
    Integer sumSoLuongByPhong(@Param("idPhong") Integer idPhong);
    
    // Tính tổng số lượng thiết bị theo loại thiết bị
    @Query("SELECT SUM(pt.soLuong) FROM PhongThietBi pt WHERE pt.thietBi.idTb = :idTb")
    Integer sumSoLuongByThietBi(@Param("idTb") Integer idTb);
    
    // Tìm phòng có thiết bị với số lượng lớn nhất
    @Query("SELECT pt FROM PhongThietBi pt WHERE pt.soLuong = (SELECT MAX(pt2.soLuong) FROM PhongThietBi pt2)")
    List<PhongThietBi> findPhongThietBiWithMaxSoLuong();
    
    // Tìm phòng có thiết bị với số lượng thấp nhất
    @Query("SELECT pt FROM PhongThietBi pt WHERE pt.soLuong = (SELECT MIN(pt2.soLuong) FROM PhongThietBi pt2)")
    List<PhongThietBi> findPhongThietBiWithMinSoLuong();
    
    // Tìm theo phòng và sắp xếp theo số lượng
    List<PhongThietBi> findByPhong_IdPhongOrderBySoLuongDesc(Integer idPhong);
    
    // Tìm theo thiết bị và sắp xếp theo số lượng
    List<PhongThietBi> findByThietBi_IdTbOrderBySoLuongDesc(Integer idTb);
    
    // Tìm theo mã công ty
    @Query("SELECT pt FROM PhongThietBi pt WHERE pt.phong.tang.donVi.congTy.maCty = :maCty")
    List<PhongThietBi> findByCongTy_MaCty(@Param("maCty") String maCty);
    
    // Tìm theo đơn vị
    @Query("SELECT pt FROM PhongThietBi pt WHERE pt.phong.tang.donVi.idDvi = :idDvi")
    List<PhongThietBi> findByDonVi_IdDvi(@Param("idDvi") Integer idDvi);
    
    // Tìm theo tầng
    @Query("SELECT pt FROM PhongThietBi pt WHERE pt.phong.tang.idTang = :idTang")
    List<PhongThietBi> findByTang_IdTang(@Param("idTang") Integer idTang);
    
    // Tìm theo loại phòng
    @Query("SELECT pt FROM PhongThietBi pt WHERE pt.phong.loaiPhong.idLoaiPhong = :idLoaiPhong")
    List<PhongThietBi> findByLoaiPhong_IdLoaiPhong(@Param("idLoaiPhong") Integer idLoaiPhong);
} 