package com.holtel.hotel_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.dto.KhachHangDTO;
import com.holtel.hotel_management.entity.KhachHang;
import com.holtel.hotel_management.repository.KhachHangRepository;
import com.holtel.hotel_management.util.DTOConverter;

@Service
public class KhachHangService {

    @Autowired
    private KhachHangRepository khachHangRepository;

    // Lấy tất cả khách hàng
    public List<KhachHang> getAllKhachHang() {
        return khachHangRepository.findAll();
    }

    // Lấy tất cả khách hàng dưới dạng DTO
    public List<KhachHangDTO> getAllKhachHangDTO() {
        return DTOConverter.toKhachHangDTOList(khachHangRepository.findAll());
    }

    // Lấy khách hàng theo ID
    public Optional<KhachHang> getKhachHangById(Integer id) {
        return khachHangRepository.findById(id);
    }

    // Lấy khách hàng theo ID dưới dạng DTO
    public KhachHangDTO getKhachHangDTOById(Integer id) {
        Optional<KhachHang> khachHang = khachHangRepository.findById(id);
        return khachHang.map(DTOConverter::toKhachHangDTO).orElse(null);
    }

    // Lưu khách hàng mới
    public KhachHang saveKhachHang(KhachHang khachHang) {
        return khachHangRepository.save(khachHang);
    }

    // Cập nhật khách hàng
    public KhachHang updateKhachHang(Integer id, KhachHang khachHangDetails) {
        Optional<KhachHang> existingKhachHang = khachHangRepository.findById(id);
        if (existingKhachHang.isPresent()) {
            KhachHang khachHang = existingKhachHang.get();
            khachHang.setHoTen(khachHangDetails.getHoTen());
            khachHang.setSoDienThoai(khachHangDetails.getSoDienThoai());
            khachHang.setEmail(khachHangDetails.getEmail());
            khachHang.setDiaChi(khachHangDetails.getDiaChi());
            khachHang.setCccd(khachHangDetails.getCccd());
            return khachHangRepository.save(khachHang);
        }
        return null;
    }

    // Xóa khách hàng
    public boolean deleteKhachHang(Integer id) {
        if (khachHangRepository.existsById(id)) {
            khachHangRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm khách hàng theo họ tên
    public List<KhachHang> findByHoTen(String hoTen) {
        return khachHangRepository.findByHoTen(hoTen);
    }

    // Tìm khách hàng theo số điện thoại
    public Optional<KhachHang> findBySoDienThoai(String soDienThoai) {
        return khachHangRepository.findBySoDienThoai(soDienThoai);
    }

    // Tìm khách hàng theo email
    public Optional<KhachHang> findByEmail(String email) {
        return khachHangRepository.findByEmail(email);
    }

    // Tìm khách hàng theo cccd
    public Optional<KhachHang> findByCccd(String cccd) {
        return khachHangRepository.findByCccd(cccd);
    }

    // Tìm khách hàng theo từ khóa
    public List<KhachHang> findByKeyword(String keyword) {
        return khachHangRepository.findByKeyword(keyword);
    }

    // Kiểm tra tồn tại theo số điện thoại
    public boolean existsBySoDienThoai(String soDienThoai) {
        return khachHangRepository.existsBySoDienThoai(soDienThoai);
    }

    // Kiểm tra tồn tại theo email
    public boolean existsByEmail(String email) {
        return khachHangRepository.existsByEmail(email);
    }

    // Kiểm tra tồn tại theo cccd
    public boolean existsByCccd(String cccd) {
        return khachHangRepository.existsByCccd(cccd);
    }

    // Đếm tổng số khách hàng
    public long countAllKhachHang() {
        return khachHangRepository.count();
    }

    // Lấy danh sách khách hàng theo thứ tự họ tên tăng dần
    public List<KhachHang> getAllKhachHangOrderByHoTenAsc() {
        return khachHangRepository.findAllByOrderByHoTenAsc();
    }

    // Lấy danh sách khách hàng theo thứ tự họ tên giảm dần
    public List<KhachHang> getAllKhachHangOrderByHoTenDesc() {
        return khachHangRepository.findAllByOrderByHoTenDesc();
    }

    // Tìm khách hàng theo địa chỉ
    public List<KhachHang> findByDiaChiContaining(String diaChi) {
        return khachHangRepository.findByDiaChiContaining(diaChi);
    }

    // Tìm khách hàng theo họ tên và số điện thoại
    public Optional<KhachHang> findByHoTenAndSoDienThoai(String hoTen, String soDienThoai) {
        return khachHangRepository.findByHoTenAndSoDienThoai(hoTen, soDienThoai);
    }

    // Tìm khách hàng theo họ tên và email
    public Optional<KhachHang> findByHoTenAndEmail(String hoTen, String email) {
        return khachHangRepository.findByHoTenAndEmail(hoTen, email);
    }
} 