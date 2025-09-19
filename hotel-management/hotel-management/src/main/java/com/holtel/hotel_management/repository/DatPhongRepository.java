package com.holtel.hotel_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.DatPhong;

@Repository
public interface DatPhongRepository extends JpaRepository<DatPhong, Integer> {
    
    // Tìm đặt phòng theo phòng
    List<DatPhong> findByPhong_IdPhong(Integer idPhong);
    
    // Tìm đặt phòng theo khách hàng
    List<DatPhong> findByKhachHang_IdKh(Integer idKh);
    
    // Tìm đặt phòng theo trạng thái
    List<DatPhong> findByTrangThai(String trangThai);
    
    // Tìm đặt phòng theo ngày đặt
    List<DatPhong> findByNgayDat(LocalDate ngayDat);
    
    // Tìm đặt phòng theo ngày trả
    List<DatPhong> findByNgayTra(LocalDate ngayTra);
    
    // Tìm đặt phòng theo khoảng thời gian
    List<DatPhong> findByNgayDatBetween(LocalDate startDate, LocalDate endDate);
    
    // Tìm đặt phòng theo phòng và trạng thái
    List<DatPhong> findByPhong_IdPhongAndTrangThai(Integer idPhong, String trangThai);
    
    // Tìm đặt phòng theo khách hàng và trạng thái
    List<DatPhong> findByKhachHang_IdKhAndTrangThai(Integer idKh, String trangThai);
    
    // Tìm đặt phòng theo ngày đặt và trạng thái
    List<DatPhong> findByNgayDatAndTrangThai(LocalDate ngayDat, String trangThai);
    
    // Tìm đặt phòng theo ngày trả và trạng thái
    List<DatPhong> findByNgayTraAndTrangThai(LocalDate ngayTra, String trangThai);
    
    // Đếm số đặt phòng theo trạng thái
    long countByTrangThai(String trangThai);
    
    // Đếm số đặt phòng theo phòng
    long countByPhong_IdPhong(Integer idPhong);
    
    // Đếm số đặt phòng theo khách hàng
    long countByKhachHang_IdKh(Integer idKh);
    
    // Đếm số đặt phòng theo ngày đặt
    long countByNgayDat(LocalDate ngayDat);
    
    // Tìm đặt phòng theo phòng và sắp xếp theo ngày đặt
    List<DatPhong> findByPhong_IdPhongOrderByNgayDatDesc(Integer idPhong);
    
    // Tìm đặt phòng theo khách hàng và sắp xếp theo ngày đặt
    List<DatPhong> findByKhachHang_IdKhOrderByNgayDatDesc(Integer idKh);
    
    // Tìm đặt phòng theo trạng thái và sắp xếp theo ngày đặt
    List<DatPhong> findByTrangThaiOrderByNgayDatDesc(String trangThai);
    
    // Tìm đặt phòng trong tương lai
    @Query("SELECT d FROM DatPhong d WHERE d.ngayDat >= :today")
    List<DatPhong> findDatPhongTuongLai(@Param("today") LocalDate today);
    
    // Tìm đặt phòng trong quá khứ
    @Query("SELECT d FROM DatPhong d WHERE d.ngayTra < :today")
    List<DatPhong> findDatPhongQuaKhu(@Param("today") LocalDate today);
    
    // Tìm đặt phòng hiện tại (đang diễn ra)
    @Query("SELECT d FROM DatPhong d WHERE d.ngayDat <= :today AND d.ngayTra >= :today")
    List<DatPhong> findDatPhongHienTai(@Param("today") LocalDate today);
    
    // Tìm đặt phòng theo mã công ty
    @Query("SELECT d FROM DatPhong d WHERE d.phong.tang.donVi.congTy.maCty = :maCty")
    List<DatPhong> findByCongTy_MaCty(@Param("maCty") String maCty);
    
    // Tìm đặt phòng theo mã công ty và trạng thái
    @Query("SELECT d FROM DatPhong d WHERE d.phong.tang.donVi.congTy.maCty = :maCty AND d.trangThai = :trangThai")
    List<DatPhong> findByCongTy_MaCtyAndTrangThai(@Param("maCty") String maCty, @Param("trangThai") String trangThai);
    
    // Tìm đặt phòng theo đơn vị
    @Query("SELECT d FROM DatPhong d WHERE d.phong.tang.donVi.idDvi = :idDvi")
    List<DatPhong> findByDonVi_IdDvi(@Param("idDvi") Integer idDvi);
    
    // Tìm đặt phòng theo tầng
    @Query("SELECT d FROM DatPhong d WHERE d.phong.tang.idTang = :idTang")
    List<DatPhong> findByTang_IdTang(@Param("idTang") Integer idTang);
    
    // Tìm đặt phòng theo loại phòng
    @Query("SELECT d FROM DatPhong d WHERE d.phong.loaiPhong.idLoaiPhong = :idLoaiPhong")
    List<DatPhong> findByLoaiPhong_IdLoaiPhong(@Param("idLoaiPhong") Integer idLoaiPhong);
} 