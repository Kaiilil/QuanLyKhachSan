package com.holtel.hotel_management.service;

import com.holtel.hotel_management.entity.ThietBi;
import com.holtel.hotel_management.repository.ThietBiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ThietBiService {

    @Autowired
    private ThietBiRepository thietBiRepository;

    // Lấy tất cả thiết bị
    public List<ThietBi> getAllThietBi() {
        return thietBiRepository.findAll();
    }

    // Lấy thiết bị theo ID
    public Optional<ThietBi> getThietBiById(Integer id) {
        return thietBiRepository.findById(id);
    }

    // Lưu thiết bị mới
    public ThietBi saveThietBi(ThietBi thietBi) {
        return thietBiRepository.save(thietBi);
    }

    // Cập nhật thiết bị
    public ThietBi updateThietBi(Integer id, ThietBi thietBiDetails) {
        Optional<ThietBi> existingThietBi = thietBiRepository.findById(id);
        if (existingThietBi.isPresent()) {
            ThietBi thietBi = existingThietBi.get();
            thietBi.setTenTb(thietBiDetails.getTenTb());
            thietBi.setMoTa(thietBiDetails.getMoTa());
            return thietBiRepository.save(thietBi);
        }
        return null;
    }

    // Xóa thiết bị
    public boolean deleteThietBi(Integer id) {
        if (thietBiRepository.existsById(id)) {
            thietBiRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm thiết bị theo tên
    public Optional<ThietBi> findByTenTb(String tenTb) {
        return thietBiRepository.findByTenTb(tenTb);
    }

    // Tìm thiết bị theo tên có chứa từ khóa
    public List<ThietBi> findByTenTbContaining(String keyword) {
        return thietBiRepository.findByTenTbContaining(keyword);
    }

    // Tìm thiết bị theo mô tả có chứa từ khóa
    public List<ThietBi> findByMoTaContaining(String keyword) {
        return thietBiRepository.findByMoTaContaining(keyword);
    }

    // Tìm thiết bị theo từ khóa
    public List<ThietBi> findByKeyword(String keyword) {
        return thietBiRepository.findByKeyword(keyword);
    }

    // Kiểm tra tồn tại theo tên
    public boolean existsByTenTb(String tenTb) {
        return thietBiRepository.existsByTenTb(tenTb);
    }

    // Đếm tổng số thiết bị
    public long countAllThietBi() {
        return thietBiRepository.count();
    }

    // Lấy danh sách thiết bị theo thứ tự tên tăng dần
    public List<ThietBi> getAllThietBiOrderByTenAsc() {
        return thietBiRepository.findAllByOrderByTenTbAsc();
    }

    // Lấy danh sách thiết bị theo thứ tự tên giảm dần
    public List<ThietBi> getAllThietBiOrderByTenDesc() {
        return thietBiRepository.findAllByOrderByTenTbDesc();
    }

    // Tìm thiết bị được sử dụng trong phòng
    public List<ThietBi> findThietBiDuocSuDung() {
        return thietBiRepository.findThietBiDuocSuDung();
    }

    // Tìm thiết bị chưa được sử dụng trong phòng nào
    public List<ThietBi> findThietBiChuaSuDung() {
        return thietBiRepository.findThietBiChuaSuDung();
    }

    // Đếm số phòng sử dụng thiết bị
    public long countPhongSuDungThietBi(Integer idTb) {
        return thietBiRepository.countPhongSuDungThietBi(idTb);
    }

    // Tính tổng số lượng thiết bị trong tất cả phòng
    public Integer sumSoLuongThietBi(Integer idTb) {
        return thietBiRepository.sumSoLuongThietBi(idTb);
    }
} 