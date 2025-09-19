package com.holtel.hotel_management.service;

import com.holtel.hotel_management.entity.PhongThietBi;
import com.holtel.hotel_management.repository.PhongThietBiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PhongThietBiService {

    @Autowired
    private PhongThietBiRepository phongThietBiRepository;

    // Lấy tất cả phòng-thiết bị
    public List<PhongThietBi> getAllPhongThietBi() {
        return phongThietBiRepository.findAll();
    }

    // Lấy phòng-thiết bị theo ID
    public Optional<PhongThietBi> getPhongThietBiById(Integer id) {
        return phongThietBiRepository.findById(id);
    }

    // Lưu phòng-thiết bị mới
    public PhongThietBi savePhongThietBi(PhongThietBi phongThietBi) {
        return phongThietBiRepository.save(phongThietBi);
    }

    // Cập nhật phòng-thiết bị
    public PhongThietBi updatePhongThietBi(Integer id, PhongThietBi phongThietBiDetails) {
        Optional<PhongThietBi> existingPhongThietBi = phongThietBiRepository.findById(id);
        if (existingPhongThietBi.isPresent()) {
            PhongThietBi phongThietBi = existingPhongThietBi.get();
            phongThietBi.setPhong(phongThietBiDetails.getPhong());
            phongThietBi.setThietBi(phongThietBiDetails.getThietBi());
            phongThietBi.setSoLuong(phongThietBiDetails.getSoLuong());
            return phongThietBiRepository.save(phongThietBi);
        }
        return null;
    }

    // Xóa phòng-thiết bị
    public boolean deletePhongThietBi(Integer id) {
        if (phongThietBiRepository.existsById(id)) {
            phongThietBiRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm phòng-thiết bị theo phòng
    public List<PhongThietBi> findByPhong_IdPhong(Integer idPhong) {
        return phongThietBiRepository.findByPhong_IdPhong(idPhong);
    }

    // Tìm phòng-thiết bị theo thiết bị
    public List<PhongThietBi> findByThietBi_IdTb(Integer idTb) {
        return phongThietBiRepository.findByThietBi_IdTb(idTb);
    }

    // Tìm phòng-thiết bị theo số lượng
    public List<PhongThietBi> findBySoLuong(Integer soLuong) {
        return phongThietBiRepository.findBySoLuong(soLuong);
    }

    // Tìm phòng-thiết bị theo số lượng lớn hơn
    public List<PhongThietBi> findBySoLuongGreaterThan(Integer soLuong) {
        return phongThietBiRepository.findBySoLuongGreaterThan(soLuong);
    }

    // Tìm phòng-thiết bị theo số lượng nhỏ hơn
    public List<PhongThietBi> findBySoLuongLessThan(Integer soLuong) {
        return phongThietBiRepository.findBySoLuongLessThan(soLuong);
    }

    // Tìm phòng-thiết bị theo khoảng số lượng
    public List<PhongThietBi> findBySoLuongBetween(Integer minSoLuong, Integer maxSoLuong) {
        return phongThietBiRepository.findBySoLuongBetween(minSoLuong, maxSoLuong);
    }

    // Tìm phòng-thiết bị theo phòng và thiết bị
    public Optional<PhongThietBi> findByPhong_IdPhongAndThietBi_IdTb(Integer idPhong, Integer idTb) {
        return phongThietBiRepository.findByPhong_IdPhongAndThietBi_IdTb(idPhong, idTb);
    }

    // Kiểm tra tồn tại theo phòng và thiết bị
    public boolean existsByPhong_IdPhongAndThietBi_IdTb(Integer idPhong, Integer idTb) {
        return phongThietBiRepository.existsByPhong_IdPhongAndThietBi_IdTb(idPhong, idTb);
    }

    // Đếm tổng số phòng-thiết bị
    public long countAllPhongThietBi() {
        return phongThietBiRepository.count();
    }

    // Đếm phòng-thiết bị theo phòng
    public long countByPhong_IdPhong(Integer idPhong) {
        return phongThietBiRepository.countByPhong_IdPhong(idPhong);
    }

    // Đếm phòng-thiết bị theo thiết bị
    public long countByThietBi_IdTb(Integer idTb) {
        return phongThietBiRepository.countByThietBi_IdTb(idTb);
    }

    // Đếm phòng-thiết bị theo số lượng
    public long countBySoLuong(Integer soLuong) {
        return phongThietBiRepository.countBySoLuong(soLuong);
    }

    // Tính tổng số lượng thiết bị theo phòng
    public Integer sumSoLuongByPhong(Integer idPhong) {
        return phongThietBiRepository.sumSoLuongByPhong(idPhong);
    }

    // Tính tổng số lượng thiết bị theo loại thiết bị
    public Integer sumSoLuongByThietBi(Integer idTb) {
        return phongThietBiRepository.sumSoLuongByThietBi(idTb);
    }

    // Tìm phòng có thiết bị với số lượng lớn nhất
    public List<PhongThietBi> findPhongThietBiWithMaxSoLuong() {
        return phongThietBiRepository.findPhongThietBiWithMaxSoLuong();
    }

    // Tìm phòng có thiết bị với số lượng thấp nhất
    public List<PhongThietBi> findPhongThietBiWithMinSoLuong() {
        return phongThietBiRepository.findPhongThietBiWithMinSoLuong();
    }

    // Tìm theo phòng và sắp xếp theo số lượng
    public List<PhongThietBi> findByPhong_IdPhongOrderBySoLuongDesc(Integer idPhong) {
        return phongThietBiRepository.findByPhong_IdPhongOrderBySoLuongDesc(idPhong);
    }

    // Tìm theo thiết bị và sắp xếp theo số lượng
    public List<PhongThietBi> findByThietBi_IdTbOrderBySoLuongDesc(Integer idTb) {
        return phongThietBiRepository.findByThietBi_IdTbOrderBySoLuongDesc(idTb);
    }

    // Tìm theo mã công ty
    public List<PhongThietBi> findByCongTy_MaCty(String maCty) {
        return phongThietBiRepository.findByCongTy_MaCty(maCty);
    }

    // Tìm theo đơn vị
    public List<PhongThietBi> findByDonVi_IdDvi(Integer idDvi) {
        return phongThietBiRepository.findByDonVi_IdDvi(idDvi);
    }

    // Tìm theo tầng
    public List<PhongThietBi> findByTang_IdTang(Integer idTang) {
        return phongThietBiRepository.findByTang_IdTang(idTang);
    }

    // Tìm theo loại phòng
    public List<PhongThietBi> findByLoaiPhong_IdLoaiPhong(Integer idLoaiPhong) {
        return phongThietBiRepository.findByLoaiPhong_IdLoaiPhong(idLoaiPhong);
    }
} 