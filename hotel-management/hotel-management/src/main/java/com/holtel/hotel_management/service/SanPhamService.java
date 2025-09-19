package com.holtel.hotel_management.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.entity.SanPham;
import com.holtel.hotel_management.repository.SanPhamRepository;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    // Lấy tất cả sản phẩm
    public List<SanPham> getAllSanPham() {
        return sanPhamRepository.findAll();
    }

    // Lấy sản phẩm theo ID
    public Optional<SanPham> getSanPhamById(Integer id) {
        return sanPhamRepository.findById(id);
    }

    // Lưu sản phẩm mới
    public SanPham saveSanPham(SanPham sanPham) {
        return sanPhamRepository.save(sanPham);
    }

    // Cập nhật sản phẩm
    public SanPham updateSanPham(Integer id, SanPham sanPhamDetails) {
        Optional<SanPham> existingSanPham = sanPhamRepository.findById(id);
        if (existingSanPham.isPresent()) {
            SanPham sanPham = existingSanPham.get();
            sanPham.setTenSp(sanPhamDetails.getTenSp());
            sanPham.setDonGia(sanPhamDetails.getDonGia());
            sanPham.setMoTa(sanPhamDetails.getMoTa());
            return sanPhamRepository.save(sanPham);
        }
        return null;
    }

    // Xóa sản phẩm
    public boolean deleteSanPham(Integer id) {
        if (sanPhamRepository.existsById(id)) {
            sanPhamRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm sản phẩm theo tên
    public List<SanPham> findByTenSpContaining(String tenSp) {
        return sanPhamRepository.findByTenSpContaining(tenSp);
    }

    // Tìm sản phẩm theo khoảng giá
    public List<SanPham> findByDonGiaBetween(Double minGia, Double maxGia) {
        return sanPhamRepository.findByDonGiaBetween(
            BigDecimal.valueOf(minGia), 
            BigDecimal.valueOf(maxGia)
        );
    }

    // Đếm tổng số sản phẩm
    public long countAllSanPham() {
        return sanPhamRepository.count();
    }
} 