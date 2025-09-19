package com.holtel.hotel_management.service;

import com.holtel.hotel_management.entity.DatPhongSanPham;
import com.holtel.hotel_management.repository.DatPhongSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class DatPhongSanPhamService {

    @Autowired
    private DatPhongSanPhamRepository datPhongSanPhamRepository;

    // Lấy tất cả đặt phòng-sản phẩm
    public List<DatPhongSanPham> getAllDatPhongSanPham() {
        return datPhongSanPhamRepository.findAll();
    }

    // Lấy đặt phòng-sản phẩm theo ID
    public Optional<DatPhongSanPham> getDatPhongSanPhamById(Integer id) {
        return datPhongSanPhamRepository.findById(id);
    }

    // Lưu đặt phòng-sản phẩm mới
    public DatPhongSanPham saveDatPhongSanPham(DatPhongSanPham datPhongSanPham) {
        return datPhongSanPhamRepository.save(datPhongSanPham);
    }

    // Cập nhật đặt phòng-sản phẩm
    public DatPhongSanPham updateDatPhongSanPham(Integer id, DatPhongSanPham datPhongSanPhamDetails) {
        Optional<DatPhongSanPham> existingDatPhongSanPham = datPhongSanPhamRepository.findById(id);
        if (existingDatPhongSanPham.isPresent()) {
            DatPhongSanPham datPhongSanPham = existingDatPhongSanPham.get();
            datPhongSanPham.setSoLuong(datPhongSanPhamDetails.getSoLuong());
            datPhongSanPham.setDatPhong(datPhongSanPhamDetails.getDatPhong());
            datPhongSanPham.setSanPham(datPhongSanPhamDetails.getSanPham());
            return datPhongSanPhamRepository.save(datPhongSanPham);
        }
        return null;
    }

    // Xóa đặt phòng-sản phẩm
    public boolean deleteDatPhongSanPham(Integer id) {
        if (datPhongSanPhamRepository.existsById(id)) {
            datPhongSanPhamRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm đặt phòng-sản phẩm theo đặt phòng
    public List<DatPhongSanPham> findByDatPhong_IdDatPhong(Integer idDatPhong) {
        return datPhongSanPhamRepository.findByDatPhong_IdDatPhong(idDatPhong);
    }

    // Tìm đặt phòng-sản phẩm theo sản phẩm
    public List<DatPhongSanPham> findBySanPham_IdSp(Integer idSp) {
        return datPhongSanPhamRepository.findBySanPham_IdSp(idSp);
    }

    // Tìm đặt phòng-sản phẩm theo số lượng
    public List<DatPhongSanPham> findBySoLuong(Integer soLuong) {
        return datPhongSanPhamRepository.findBySoLuong(soLuong);
    }

    // Tìm đặt phòng-sản phẩm theo số lượng lớn hơn
    public List<DatPhongSanPham> findBySoLuongGreaterThan(Integer soLuong) {
        return datPhongSanPhamRepository.findBySoLuongGreaterThan(soLuong);
    }

    // Tìm đặt phòng-sản phẩm theo số lượng nhỏ hơn
    public List<DatPhongSanPham> findBySoLuongLessThan(Integer soLuong) {
        return datPhongSanPhamRepository.findBySoLuongLessThan(soLuong);
    }

    // Tìm đặt phòng-sản phẩm theo khoảng số lượng
    public List<DatPhongSanPham> findBySoLuongBetween(Integer minSoLuong, Integer maxSoLuong) {
        return datPhongSanPhamRepository.findBySoLuongBetween(minSoLuong, maxSoLuong);
    }

    // Tìm đặt phòng-sản phẩm theo đặt phòng và sản phẩm
    public Optional<DatPhongSanPham> findByDatPhong_IdDatPhongAndSanPham_IdSp(Integer idDatPhong, Integer idSp) {
        return datPhongSanPhamRepository.findByDatPhong_IdDatPhongAndSanPham_IdSp(idDatPhong, idSp);
    }

    // Kiểm tra tồn tại theo đặt phòng và sản phẩm
    public boolean existsByDatPhong_IdDatPhongAndSanPham_IdSp(Integer idDatPhong, Integer idSp) {
        return datPhongSanPhamRepository.existsByDatPhong_IdDatPhongAndSanPham_IdSp(idDatPhong, idSp);
    }

    // Đếm tổng số đặt phòng-sản phẩm
    public long countAllDatPhongSanPham() {
        return datPhongSanPhamRepository.count();
    }

    // Đếm đặt phòng-sản phẩm theo đặt phòng
    public long countByDatPhong_IdDatPhong(Integer idDatPhong) {
        return datPhongSanPhamRepository.countByDatPhong_IdDatPhong(idDatPhong);
    }

    // Đếm đặt phòng-sản phẩm theo sản phẩm
    public long countBySanPham_IdSp(Integer idSp) {
        return datPhongSanPhamRepository.countBySanPham_IdSp(idSp);
    }

    // Đếm đặt phòng-sản phẩm theo số lượng
    public long countBySoLuong(Integer soLuong) {
        return datPhongSanPhamRepository.countBySoLuong(soLuong);
    }

    // Tính tổng số lượng sản phẩm theo đặt phòng
    public Integer sumSoLuongByDatPhong(Integer idDatPhong) {
        return datPhongSanPhamRepository.sumSoLuongByDatPhong(idDatPhong);
    }

    // Tính tổng số lượng sản phẩm theo loại sản phẩm
    public Integer sumSoLuongBySanPham(Integer idSp) {
        return datPhongSanPhamRepository.sumSoLuongBySanPham(idSp);
    }

    // Tìm đặt phòng sản phẩm có số lượng lớn nhất
    public List<DatPhongSanPham> findDatPhongSanPhamWithMaxSoLuong() {
        return datPhongSanPhamRepository.findDatPhongSanPhamWithMaxSoLuong();
    }

    // Tìm đặt phòng sản phẩm có số lượng thấp nhất
    public List<DatPhongSanPham> findDatPhongSanPhamWithMinSoLuong() {
        return datPhongSanPhamRepository.findDatPhongSanPhamWithMinSoLuong();
    }

    // Tìm theo đặt phòng và sắp xếp theo số lượng
    public List<DatPhongSanPham> findByDatPhong_IdDatPhongOrderBySoLuongDesc(Integer idDatPhong) {
        return datPhongSanPhamRepository.findByDatPhong_IdDatPhongOrderBySoLuongDesc(idDatPhong);
    }

    // Tìm theo sản phẩm và sắp xếp theo số lượng
    public List<DatPhongSanPham> findBySanPham_IdSpOrderBySoLuongDesc(Integer idSp) {
        return datPhongSanPhamRepository.findBySanPham_IdSpOrderBySoLuongDesc(idSp);
    }

    // Tìm theo mã công ty
    public List<DatPhongSanPham> findByCongTy_MaCty(String maCty) {
        return datPhongSanPhamRepository.findByCongTy_MaCty(maCty);
    }

    // Tìm theo đơn vị
    public List<DatPhongSanPham> findByDonVi_IdDvi(Integer idDvi) {
        return datPhongSanPhamRepository.findByDonVi_IdDvi(idDvi);
    }

    // Tìm theo tầng
    public List<DatPhongSanPham> findByTang_IdTang(Integer idTang) {
        return datPhongSanPhamRepository.findByTang_IdTang(idTang);
    }

    // Tìm theo loại phòng
    public List<DatPhongSanPham> findByLoaiPhong_IdLoaiPhong(Integer idLoaiPhong) {
        return datPhongSanPhamRepository.findByLoaiPhong_IdLoaiPhong(idLoaiPhong);
    }

    // Tìm theo khách hàng
    public List<DatPhongSanPham> findByKhachHang_IdKh(Integer idKh) {
        return datPhongSanPhamRepository.findByKhachHang_IdKh(idKh);
    }

    // Tính tổng giá trị sản phẩm theo đặt phòng
    public Double sumGiaTriByDatPhong(Integer idDatPhong) {
        return datPhongSanPhamRepository.sumGiaTriByDatPhong(idDatPhong);
    }

    // Tính tổng giá trị sản phẩm theo loại sản phẩm
    public Double sumGiaTriBySanPham(Integer idSp) {
        return datPhongSanPhamRepository.sumGiaTriBySanPham(idSp);
    }
} 