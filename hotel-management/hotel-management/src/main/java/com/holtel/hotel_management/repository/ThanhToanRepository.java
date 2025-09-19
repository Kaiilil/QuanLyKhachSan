package com.holtel.hotel_management.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.holtel.hotel_management.entity.ThanhToan;

@Repository
public interface ThanhToanRepository extends JpaRepository<ThanhToan, Integer> {
    
    // Tìm thanh toán theo đặt phòng
    List<ThanhToan> findByDatPhong_IdDatPhong(Integer idDatPhong);
    
    // Tìm thanh toán theo ngày thanh toán
    List<ThanhToan> findByNgayTt(LocalDate ngayTt);
    
    // Tìm thanh toán theo ngày đặt
    List<ThanhToan> findByNgayDat(LocalDate ngayDat);
    
    // Tìm thanh toán theo ngày trả
    List<ThanhToan> findByNgayTra(LocalDate ngayTra);
    
    // Tìm thanh toán theo hình thức thanh toán
    List<ThanhToan> findByHinhThucTt(String hinhThucTt);
    
    // Tìm thanh toán theo trạng thái
    List<ThanhToan> findByTrangThai(String trangThai);
    
    // Tìm thanh toán theo số tiền
    List<ThanhToan> findBySoTien(BigDecimal soTien);
    
    // Tìm thanh toán theo khoảng số tiền
    List<ThanhToan> findBySoTienBetween(BigDecimal minTien, BigDecimal maxTien);
    
    // Tìm thanh toán theo khoảng thời gian thanh toán
    List<ThanhToan> findByNgayTtBetween(LocalDate startDate, LocalDate endDate);
    
    // Tìm thanh toán theo đặt phòng và trạng thái
    List<ThanhToan> findByDatPhong_IdDatPhongAndTrangThai(Integer idDatPhong, String trangThai);
    
    // Tìm thanh toán theo hình thức thanh toán và trạng thái
    List<ThanhToan> findByHinhThucTtAndTrangThai(String hinhThucTt, String trangThai);
    
    // Tìm thanh toán theo ngày thanh toán và trạng thái
    List<ThanhToan> findByNgayTtAndTrangThai(LocalDate ngayTt, String trangThai);
    
    // Đếm số thanh toán theo trạng thái
    long countByTrangThai(String trangThai);
    
    // Đếm số thanh toán theo hình thức thanh toán
    long countByHinhThucTt(String hinhThucTt);
    
    // Đếm số thanh toán theo đặt phòng
    long countByDatPhong_IdDatPhong(Integer idDatPhong);
    
    // Đếm số thanh toán theo ngày thanh toán
    long countByNgayTt(LocalDate ngayTt);
    
    // Tìm thanh toán theo đặt phòng và sắp xếp theo ngày thanh toán
    List<ThanhToan> findByDatPhong_IdDatPhongOrderByNgayTtDesc(Integer idDatPhong);
    
    // Tìm thanh toán theo trạng thái và sắp xếp theo ngày thanh toán
    List<ThanhToan> findByTrangThaiOrderByNgayTtDesc(String trangThai);
    
    // Tìm thanh toán theo hình thức thanh toán và sắp xếp theo ngày thanh toán
    List<ThanhToan> findByHinhThucTtOrderByNgayTtDesc(String hinhThucTt);
    
    // Sắp xếp theo ngày thanh toán tăng dần
    List<ThanhToan> findAllByOrderByNgayTtAsc();
    
    // Sắp xếp theo ngày thanh toán giảm dần
    List<ThanhToan> findAllByOrderByNgayTtDesc();
    
    // Sắp xếp theo số tiền tăng dần
    List<ThanhToan> findAllByOrderBySoTienAsc();
    
    // Sắp xếp theo số tiền giảm dần
    List<ThanhToan> findAllByOrderBySoTienDesc();
    
    // Tìm thanh toán theo từ khóa
    @Query("SELECT t FROM ThanhToan t WHERE t.hinhThucTt LIKE %:keyword% OR t.trangThai LIKE %:keyword%")
    List<ThanhToan> findByKeyword(@Param("keyword") String keyword);
    
    // Tính tổng số tiền thanh toán
    @Query("SELECT SUM(t.soTien) FROM ThanhToan t")
    BigDecimal sumSoTien();
    
    // Tính tổng số tiền thanh toán theo trạng thái
    @Query("SELECT SUM(t.soTien) FROM ThanhToan t WHERE t.trangThai = :trangThai")
    BigDecimal sumSoTienByTrangThai(@Param("trangThai") String trangThai);
    
    // Tính tổng số tiền thanh toán theo hình thức thanh toán
    @Query("SELECT SUM(t.soTien) FROM ThanhToan t WHERE t.hinhThucTt = :hinhThucTt")
    BigDecimal sumSoTienByHinhThucTt(@Param("hinhThucTt") String hinhThucTt);
    
    // Tính tổng số tiền thanh toán theo ngày thanh toán
    @Query("SELECT SUM(t.soTien) FROM ThanhToan t WHERE t.ngayTt = :ngayTt")
    BigDecimal sumSoTienByNgayTt(@Param("ngayTt") LocalDate ngayTt);
    
    // Tính tổng số tiền thanh toán theo khoảng thời gian
    @Query("SELECT SUM(t.soTien) FROM ThanhToan t WHERE t.ngayTt BETWEEN :startDate AND :endDate")
    BigDecimal sumSoTienByNgayTtBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Tìm số tiền thanh toán cao nhất
    @Query("SELECT MAX(t.soTien) FROM ThanhToan t")
    BigDecimal findMaxSoTien();
    
    // Tìm số tiền thanh toán thấp nhất
    @Query("SELECT MIN(t.soTien) FROM ThanhToan t")
    BigDecimal findMinSoTien();
    
    // Tính số tiền thanh toán trung bình
    @Query("SELECT AVG(t.soTien) FROM ThanhToan t")
    BigDecimal findAverageSoTien();
    
    // Tìm thanh toán theo mã công ty
    @Query("SELECT t FROM ThanhToan t WHERE t.datPhong.phong.tang.donVi.congTy.maCty = :maCty")
    List<ThanhToan> findByCongTy_MaCty(@Param("maCty") String maCty);
    
    // Tìm thanh toán theo mã công ty và trạng thái
    @Query("SELECT t FROM ThanhToan t WHERE t.datPhong.phong.tang.donVi.congTy.maCty = :maCty AND t.trangThai = :trangThai")
    List<ThanhToan> findByCongTy_MaCtyAndTrangThai(@Param("maCty") String maCty, @Param("trangThai") String trangThai);
    
    // Tìm thanh toán theo đơn vị
    @Query("SELECT t FROM ThanhToan t WHERE t.datPhong.phong.tang.donVi.idDvi = :idDvi")
    List<ThanhToan> findByDonVi_IdDvi(@Param("idDvi") Integer idDvi);
    
    // Tìm thanh toán theo khách hàng
    @Query("SELECT t FROM ThanhToan t WHERE t.datPhong.khachHang.idKh = :idKh")
    List<ThanhToan> findByKhachHang_IdKh(@Param("idKh") Integer idKh);
} 