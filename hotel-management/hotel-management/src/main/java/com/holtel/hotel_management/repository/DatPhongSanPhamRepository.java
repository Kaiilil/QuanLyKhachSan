package com.holtel.hotel_management.repository;

import com.holtel.hotel_management.entity.DatPhongSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DatPhongSanPhamRepository extends JpaRepository<DatPhongSanPham, Integer> {
    
    // Tìm theo đặt phòng
    List<DatPhongSanPham> findByDatPhong_IdDatPhong(Integer idDatPhong);
    
    // Tìm theo sản phẩm
    List<DatPhongSanPham> findBySanPham_IdSp(Integer idSp);
    
    // Tìm theo đặt phòng và sản phẩm
    Optional<DatPhongSanPham> findByDatPhong_IdDatPhongAndSanPham_IdSp(Integer idDatPhong, Integer idSp);
    
    // Tìm theo số lượng
    List<DatPhongSanPham> findBySoLuong(Integer soLuong);
    
    // Tìm theo số lượng lớn hơn
    List<DatPhongSanPham> findBySoLuongGreaterThan(Integer soLuong);
    
    // Tìm theo số lượng nhỏ hơn
    List<DatPhongSanPham> findBySoLuongLessThan(Integer soLuong);
    
    // Tìm theo khoảng số lượng
    List<DatPhongSanPham> findBySoLuongBetween(Integer minSoLuong, Integer maxSoLuong);
    
    // Kiểm tra tồn tại theo đặt phòng và sản phẩm
    boolean existsByDatPhong_IdDatPhongAndSanPham_IdSp(Integer idDatPhong, Integer idSp);
    
    // Đếm số sản phẩm theo đặt phòng
    long countByDatPhong_IdDatPhong(Integer idDatPhong);
    
    // Đếm số đặt phòng theo sản phẩm
    long countBySanPham_IdSp(Integer idSp);
    
    // Đếm số đặt phòng theo số lượng
    long countBySoLuong(Integer soLuong);
    
    // Tính tổng số lượng sản phẩm theo đặt phòng
    @Query("SELECT SUM(dps.soLuong) FROM DatPhongSanPham dps WHERE dps.datPhong.idDatPhong = :idDatPhong")
    Integer sumSoLuongByDatPhong(@Param("idDatPhong") Integer idDatPhong);
    
    // Tính tổng số lượng sản phẩm theo loại sản phẩm
    @Query("SELECT SUM(dps.soLuong) FROM DatPhongSanPham dps WHERE dps.sanPham.idSp = :idSp")
    Integer sumSoLuongBySanPham(@Param("idSp") Integer idSp);
    
    // Tìm đặt phòng sản phẩm có số lượng lớn nhất
    @Query("SELECT dps FROM DatPhongSanPham dps WHERE dps.soLuong = (SELECT MAX(dps2.soLuong) FROM DatPhongSanPham dps2)")
    List<DatPhongSanPham> findDatPhongSanPhamWithMaxSoLuong();
    
    // Tìm đặt phòng sản phẩm có số lượng thấp nhất
    @Query("SELECT dps FROM DatPhongSanPham dps WHERE dps.soLuong = (SELECT MIN(dps2.soLuong) FROM DatPhongSanPham dps2)")
    List<DatPhongSanPham> findDatPhongSanPhamWithMinSoLuong();
    
    // Tìm theo đặt phòng và sắp xếp theo số lượng
    List<DatPhongSanPham> findByDatPhong_IdDatPhongOrderBySoLuongDesc(Integer idDatPhong);
    
    // Tìm theo sản phẩm và sắp xếp theo số lượng
    List<DatPhongSanPham> findBySanPham_IdSpOrderBySoLuongDesc(Integer idSp);
    
    // Tìm theo mã công ty
    @Query("SELECT dps FROM DatPhongSanPham dps WHERE dps.datPhong.phong.tang.donVi.congTy.maCty = :maCty")
    List<DatPhongSanPham> findByCongTy_MaCty(@Param("maCty") String maCty);
    
    // Tìm theo đơn vị
    @Query("SELECT dps FROM DatPhongSanPham dps WHERE dps.datPhong.phong.tang.donVi.idDvi = :idDvi")
    List<DatPhongSanPham> findByDonVi_IdDvi(@Param("idDvi") Integer idDvi);
    
    // Tìm theo tầng
    @Query("SELECT dps FROM DatPhongSanPham dps WHERE dps.datPhong.phong.tang.idTang = :idTang")
    List<DatPhongSanPham> findByTang_IdTang(@Param("idTang") Integer idTang);
    
    // Tìm theo loại phòng
    @Query("SELECT dps FROM DatPhongSanPham dps WHERE dps.datPhong.phong.loaiPhong.idLoaiPhong = :idLoaiPhong")
    List<DatPhongSanPham> findByLoaiPhong_IdLoaiPhong(@Param("idLoaiPhong") Integer idLoaiPhong);
    
    // Tìm theo khách hàng
    @Query("SELECT dps FROM DatPhongSanPham dps WHERE dps.datPhong.khachHang.idKh = :idKh")
    List<DatPhongSanPham> findByKhachHang_IdKh(@Param("idKh") Integer idKh);
    
    // Tính tổng giá trị sản phẩm theo đặt phòng
    @Query("SELECT SUM(dps.soLuong * dps.sanPham.donGia) FROM DatPhongSanPham dps WHERE dps.datPhong.idDatPhong = :idDatPhong")
    Double sumGiaTriByDatPhong(@Param("idDatPhong") Integer idDatPhong);
    
    // Tính tổng giá trị sản phẩm theo loại sản phẩm
    @Query("SELECT SUM(dps.soLuong * dps.sanPham.donGia) FROM DatPhongSanPham dps WHERE dps.sanPham.idSp = :idSp")
    Double sumGiaTriBySanPham(@Param("idSp") Integer idSp);
} 