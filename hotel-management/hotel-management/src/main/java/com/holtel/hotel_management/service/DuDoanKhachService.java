package com.holtel.hotel_management.service;

import com.holtel.hotel_management.entity.DuDoanKhach;
import com.holtel.hotel_management.repository.DuDoanKhachRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DuDoanKhachService {

    @Autowired
    private DuDoanKhachRepository duDoanKhachRepository;

    // Lấy tất cả dự đoán khách
    public List<DuDoanKhach> getAllDuDoanKhach() {
        return duDoanKhachRepository.findAll();
    }

    // Lấy dự đoán khách theo ID
    public Optional<DuDoanKhach> getDuDoanKhachById(Integer id) {
        return duDoanKhachRepository.findById(id);
    }

    // Lưu dự đoán khách mới
    public DuDoanKhach saveDuDoanKhach(DuDoanKhach duDoanKhach) {
        return duDoanKhachRepository.save(duDoanKhach);
    }

    // Cập nhật dự đoán khách
    public DuDoanKhach updateDuDoanKhach(Integer id, DuDoanKhach duDoanKhachDetails) {
        Optional<DuDoanKhach> existingDuDoanKhach = duDoanKhachRepository.findById(id);
        if (existingDuDoanKhach.isPresent()) {
            DuDoanKhach duDoanKhach = existingDuDoanKhach.get();
            duDoanKhach.setThang(duDoanKhachDetails.getThang());
            duDoanKhach.setNam(duDoanKhachDetails.getNam());
            duDoanKhach.setDuDoanSoLuongKhach(duDoanKhachDetails.getDuDoanSoLuongKhach());
            duDoanKhach.setCongTy(duDoanKhachDetails.getCongTy());
            duDoanKhach.setDonVi(duDoanKhachDetails.getDonVi());
            return duDoanKhachRepository.save(duDoanKhach);
        }
        return null;
    }

    // Xóa dự đoán khách
    public boolean deleteDuDoanKhach(Integer id) {
        if (duDoanKhachRepository.existsById(id)) {
            duDoanKhachRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm dự đoán khách theo tháng
    public List<DuDoanKhach> findByThang(Integer thang) {
        return duDoanKhachRepository.findByThang(thang);
    }

    // Tìm dự đoán khách theo năm
    public List<DuDoanKhach> findByNam(Integer nam) {
        return duDoanKhachRepository.findByNam(nam);
    }

    // Tìm dự đoán khách theo tháng và năm
    public List<DuDoanKhach> findByThangAndNam(Integer thang, Integer nam) {
        return duDoanKhachRepository.findByThangAndNam(thang, nam);
    }

    // Tìm dự đoán khách theo công ty
    public List<DuDoanKhach> findByCongTy_MaCty(String maCty) {
        return duDoanKhachRepository.findByCongTy_MaCty(maCty);
    }

    // Tìm dự đoán khách theo đơn vị
    public List<DuDoanKhach> findByDonVi_IdDvi(Integer idDvi) {
        return duDoanKhachRepository.findByDonVi_IdDvi(idDvi);
    }

    // Tìm dự đoán khách theo số lượng khách dự đoán
    public List<DuDoanKhach> findByDuDoanSoLuongKhach(Integer duDoanSoLuongKhach) {
        return duDoanKhachRepository.findByDuDoanSoLuongKhach(duDoanSoLuongKhach);
    }

    // Tìm dự đoán khách theo khoảng số lượng khách
    public List<DuDoanKhach> findByDuDoanSoLuongKhachBetween(Integer minSoLuong, Integer maxSoLuong) {
        return duDoanKhachRepository.findByDuDoanSoLuongKhachBetween(minSoLuong, maxSoLuong);
    }

    // Tìm dự đoán khách theo công ty và tháng năm
    public List<DuDoanKhach> findByCongTy_MaCtyAndThangAndNam(String maCty, Integer thang, Integer nam) {
        return duDoanKhachRepository.findByCongTy_MaCtyAndThangAndNam(maCty, thang, nam);
    }

    // Tìm dự đoán khách theo đơn vị và tháng năm
    public List<DuDoanKhach> findByDonVi_IdDviAndThangAndNam(Integer idDvi, Integer thang, Integer nam) {
        return duDoanKhachRepository.findByDonVi_IdDviAndThangAndNam(idDvi, thang, nam);
    }

    // Tìm dự đoán khách theo công ty và sắp xếp theo tháng năm
    public List<DuDoanKhach> findByCongTy_MaCtyOrderByNamAscThangAsc(String maCty) {
        return duDoanKhachRepository.findByCongTy_MaCtyOrderByNamAscThangAsc(maCty);
    }

    // Tìm dự đoán khách theo đơn vị và sắp xếp theo tháng năm
    public List<DuDoanKhach> findByDonVi_IdDviOrderByNamAscThangAsc(Integer idDvi) {
        return duDoanKhachRepository.findByDonVi_IdDviOrderByNamAscThangAsc(idDvi);
    }

    // Tìm dự đoán khách theo năm và sắp xếp theo tháng
    public List<DuDoanKhach> findByNamOrderByThangAsc(Integer nam) {
        return duDoanKhachRepository.findByNamOrderByThangAsc(nam);
    }

    // Tìm dự đoán khách theo tháng và sắp xếp theo năm
    public List<DuDoanKhach> findByThangOrderByNamAsc(Integer thang) {
        return duDoanKhachRepository.findByThangOrderByNamAsc(thang);
    }

    // Đếm tổng số dự đoán khách
    public long countAllDuDoanKhach() {
        return duDoanKhachRepository.count();
    }

    // Đếm dự đoán khách theo tháng năm
    public long countByThangAndNam(Integer thang, Integer nam) {
        return duDoanKhachRepository.countByThangAndNam(thang, nam);
    }

    // Đếm dự đoán khách theo công ty
    public long countByCongTy_MaCty(String maCty) {
        return duDoanKhachRepository.countByCongTy_MaCty(maCty);
    }

    // Đếm dự đoán khách theo đơn vị
    public long countByDonVi_IdDvi(Integer idDvi) {
        return duDoanKhachRepository.countByDonVi_IdDvi(idDvi);
    }

    // Tính tổng số lượng khách dự đoán theo công ty
    public Integer sumDuDoanSoLuongKhachByCongTy(String maCty) {
        return duDoanKhachRepository.sumDuDoanSoLuongKhachByCongTy(maCty);
    }

    // Tính tổng số lượng khách dự đoán theo đơn vị
    public Integer sumDuDoanSoLuongKhachByDonVi(Integer idDvi) {
        return duDoanKhachRepository.sumDuDoanSoLuongKhachByDonVi(idDvi);
    }

    // Tính tổng số lượng khách dự đoán theo tháng năm
    public Integer sumDuDoanSoLuongKhachByThangNam(Integer thang, Integer nam) {
        return duDoanKhachRepository.sumDuDoanSoLuongKhachByThangNam(thang, nam);
    }

    // Tìm dự đoán khách tháng hiện tại
    public List<DuDoanKhach> findCurrentMonthPredictions() {
        int currentMonth = java.time.LocalDate.now().getMonthValue();
        int currentYear = java.time.LocalDate.now().getYear();
        return duDoanKhachRepository.findByThangAndNam(currentMonth, currentYear);
    }

    // Tìm dự đoán khách năm hiện tại
    public List<DuDoanKhach> findCurrentYearPredictions() {
        int currentYear = java.time.LocalDate.now().getYear();
        return duDoanKhachRepository.findByNam(currentYear);
    }

    // Tìm dự đoán có số lượng khách cao nhất theo công ty
    public List<DuDoanKhach> findDuDoanKhachMaxByCongTy(String maCty) {
        return duDoanKhachRepository.findDuDoanKhachMaxByCongTy(maCty);
    }

    // Tìm dự đoán có số lượng khách thấp nhất theo công ty
    public List<DuDoanKhach> findDuDoanKhachMinByCongTy(String maCty) {
        return duDoanKhachRepository.findDuDoanKhachMinByCongTy(maCty);
    }
} 