package com.holtel.hotel_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.Phong;

@Repository
public interface PhongRepository extends JpaRepository<Phong, Integer> {
    
    // Tìm phòng theo tên phòng
    Optional<Phong> findByTenPhong(String tenPhong);
    
    // Tìm phòng theo trạng thái
    List<Phong> findByTrangThai(String trangThai);
    
    // Tìm phòng theo tầng
    List<Phong> findByTang_IdTang(Integer idTang);
    
    // Tìm phòng theo loại phòng
    List<Phong> findByLoaiPhong_IdLoaiPhong(Integer idLoaiPhong);
    
    // Tìm phòng theo đơn vị
    @Query("SELECT p FROM Phong p WHERE p.tang.donVi.idDvi = :idDvi")
    List<Phong> findByDonVi_IdDvi(@Param("idDvi") Integer idDvi);
    
    // Tìm phòng theo tầng và trạng thái
    List<Phong> findByTang_IdTangAndTrangThai(Integer idTang, String trangThai);
    
    // Tìm phòng theo loại phòng và trạng thái
    List<Phong> findByLoaiPhong_IdLoaiPhongAndTrangThai(Integer idLoaiPhong, String trangThai);
    
    // Tìm phòng theo đơn vị và trạng thái
    @Query("SELECT p FROM Phong p WHERE p.tang.donVi.idDvi = :idDvi AND p.trangThai = :trangThai")
    List<Phong> findByDonVi_IdDviAndTrangThai(@Param("idDvi") Integer idDvi, @Param("trangThai") String trangThai);
    
    // Kiểm tra tồn tại theo tên phòng
    boolean existsByTenPhong(String tenPhong);
    
    // Đếm số phòng theo trạng thái
    long countByTrangThai(String trangThai);
    
    // Đếm số phòng theo tầng
    long countByTang_IdTang(Integer idTang);
    
    // Đếm số phòng theo loại phòng
    long countByLoaiPhong_IdLoaiPhong(Integer idLoaiPhong);
    
    // Đếm số phòng theo đơn vị
    @Query("SELECT COUNT(p) FROM Phong p WHERE p.tang.donVi.idDvi = :idDvi")
    long countByDonVi_IdDvi(@Param("idDvi") Integer idDvi);
    
    // Tìm phòng có chứa từ khóa trong tên
    @Query("SELECT p FROM Phong p WHERE p.tenPhong LIKE %:keyword%")
    List<Phong> findByTenPhongContaining(@Param("keyword") String keyword);
    
    // Tìm phòng trống
    List<Phong> findByTrangThaiOrderByTenPhong(String trangThai);
    
    // Tìm phòng theo tầng và sắp xếp theo tên
    List<Phong> findByTang_IdTangOrderByTenPhong(Integer idTang);
    
    // Tìm phòng theo loại phòng và sắp xếp theo tên
    List<Phong> findByLoaiPhong_IdLoaiPhongOrderByTenPhong(Integer idLoaiPhong);
    
    // Tìm phòng theo đơn vị và sắp xếp theo tên
    @Query("SELECT p FROM Phong p WHERE p.tang.donVi.idDvi = :idDvi ORDER BY p.tenPhong")
    List<Phong> findByDonVi_IdDviOrderByTenPhong(@Param("idDvi") Integer idDvi);
    
    // Tìm phòng theo mã công ty
    @Query("SELECT p FROM Phong p WHERE p.tang.donVi.congTy.maCty = :maCty")
    List<Phong> findByCongTy_MaCty(@Param("maCty") String maCty);
    
    // Tìm phòng theo mã công ty và trạng thái
    @Query("SELECT p FROM Phong p WHERE p.tang.donVi.congTy.maCty = :maCty AND p.trangThai = :trangThai")
    List<Phong> findByCongTy_MaCtyAndTrangThai(@Param("maCty") String maCty, @Param("trangThai") String trangThai);
} 