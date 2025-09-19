package com.holtel.hotel_management.repository;

import com.holtel.hotel_management.entity.LichSuPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LichSuPhongRepository extends JpaRepository<LichSuPhong, Integer> {
    
    // Tìm lịch sử theo phòng
    List<LichSuPhong> findByPhong_IdPhong(Integer idPhong);
    
    // Tìm lịch sử theo trạng thái
    List<LichSuPhong> findByTrangThai(String trangThai);
    
    // Tìm lịch sử theo thời gian
    List<LichSuPhong> findByThoiGian(LocalDateTime thoiGian);
    
    // Tìm lịch sử theo khoảng thời gian
    List<LichSuPhong> findByThoiGianBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    // Tìm lịch sử theo phòng và trạng thái
    List<LichSuPhong> findByPhong_IdPhongAndTrangThai(Integer idPhong, String trangThai);
    
    // Tìm lịch sử theo phòng và thời gian
    List<LichSuPhong> findByPhong_IdPhongAndThoiGianBetween(Integer idPhong, LocalDateTime startTime, LocalDateTime endTime);
    
    // Tìm lịch sử theo trạng thái và thời gian
    List<LichSuPhong> findByTrangThaiAndThoiGianBetween(String trangThai, LocalDateTime startTime, LocalDateTime endTime);
    
    // Đếm số lịch sử theo phòng
    long countByPhong_IdPhong(Integer idPhong);
    
    // Đếm số lịch sử theo trạng thái
    long countByTrangThai(String trangThai);
    
    // Đếm số lịch sử theo thời gian
    long countByThoiGian(LocalDateTime thoiGian);
    
    // Tìm lịch sử theo phòng và sắp xếp theo thời gian
    List<LichSuPhong> findByPhong_IdPhongOrderByThoiGianDesc(Integer idPhong);
    
    // Tìm lịch sử theo trạng thái và sắp xếp theo thời gian
    List<LichSuPhong> findByTrangThaiOrderByThoiGianDesc(String trangThai);
    
    // Tìm lịch sử mới nhất của phòng
    @Query("SELECT l FROM LichSuPhong l WHERE l.phong.idPhong = :idPhong AND l.thoiGian = (SELECT MAX(l2.thoiGian) FROM LichSuPhong l2 WHERE l2.phong.idPhong = :idPhong)")
    List<LichSuPhong> findLichSuMoiNhatByPhong(@Param("idPhong") Integer idPhong);
    
    // Tìm lịch sử cũ nhất của phòng
    @Query("SELECT l FROM LichSuPhong l WHERE l.phong.idPhong = :idPhong AND l.thoiGian = (SELECT MIN(l2.thoiGian) FROM LichSuPhong l2 WHERE l2.phong.idPhong = :idPhong)")
    List<LichSuPhong> findLichSuCuNhatByPhong(@Param("idPhong") Integer idPhong);
    
    // Tìm lịch sử theo mã công ty
    @Query("SELECT l FROM LichSuPhong l WHERE l.phong.tang.donVi.congTy.maCty = :maCty")
    List<LichSuPhong> findByCongTy_MaCty(@Param("maCty") String maCty);
    
    // Tìm lịch sử theo mã công ty và trạng thái
    @Query("SELECT l FROM LichSuPhong l WHERE l.phong.tang.donVi.congTy.maCty = :maCty AND l.trangThai = :trangThai")
    List<LichSuPhong> findByCongTy_MaCtyAndTrangThai(@Param("maCty") String maCty, @Param("trangThai") String trangThai);
    
    // Tìm lịch sử theo đơn vị
    @Query("SELECT l FROM LichSuPhong l WHERE l.phong.tang.donVi.idDvi = :idDvi")
    List<LichSuPhong> findByDonVi_IdDvi(@Param("idDvi") Integer idDvi);
    
    // Tìm lịch sử theo tầng
    @Query("SELECT l FROM LichSuPhong l WHERE l.phong.tang.idTang = :idTang")
    List<LichSuPhong> findByTang_IdTang(@Param("idTang") Integer idTang);
    
    // Tìm lịch sử theo loại phòng
    @Query("SELECT l FROM LichSuPhong l WHERE l.phong.loaiPhong.idLoaiPhong = :idLoaiPhong")
    List<LichSuPhong> findByLoaiPhong_IdLoaiPhong(@Param("idLoaiPhong") Integer idLoaiPhong);
    
    // Tìm lịch sử theo ngày (từ 00:00 đến 23:59)
    @Query("SELECT l FROM LichSuPhong l WHERE DATE(l.thoiGian) = :date")
    List<LichSuPhong> findByNgay(@Param("date") String date);
    
    // Tìm lịch sử theo tháng năm
    @Query("SELECT l FROM LichSuPhong l WHERE YEAR(l.thoiGian) = :year AND MONTH(l.thoiGian) = :month")
    List<LichSuPhong> findByThangNam(@Param("year") Integer year, @Param("month") Integer month);
} 