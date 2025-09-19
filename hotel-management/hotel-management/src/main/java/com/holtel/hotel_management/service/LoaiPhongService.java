package com.holtel.hotel_management.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.dto.LoaiPhongDTO;
import com.holtel.hotel_management.entity.LoaiPhong;
import com.holtel.hotel_management.repository.LoaiPhongRepository;
import com.holtel.hotel_management.util.DTOConverter;

@Service
public class LoaiPhongService {

    @Autowired
    private LoaiPhongRepository loaiPhongRepository;

    // Lấy tất cả loại phòng
    public List<LoaiPhong> getAllLoaiPhong() {
        return loaiPhongRepository.findAll();
    }

    // Lấy loại phòng theo ID
    public Optional<LoaiPhong> getLoaiPhongById(Integer id) {
        return loaiPhongRepository.findById(id);
    }

    // Lưu loại phòng mới
    public LoaiPhong saveLoaiPhong(LoaiPhong loaiPhong) {
        // Nếu có ID, kiểm tra xem có phải là tạo mới hay update
        if (loaiPhong.getIdLoaiPhong() != null) {
            // Kiểm tra xem ID này đã tồn tại chưa
            if (loaiPhongRepository.existsById(loaiPhong.getIdLoaiPhong())) {
                // Nếu đã tồn tại, thực hiện update
                return updateLoaiPhong(loaiPhong.getIdLoaiPhong(), loaiPhong);
            }
        }
        
        // Nếu không có ID hoặc ID chưa tồn tại, tạo mới
        // Đảm bảo ID được set null để JPA tự sinh
        loaiPhong.setIdLoaiPhong(null);
        return loaiPhongRepository.save(loaiPhong);
    }
    
    // Tạo loại phòng mới (luôn tạo mới, không update)
    public LoaiPhong createLoaiPhong(LoaiPhong loaiPhong) {
        // Đảm bảo ID được set null để JPA tự sinh
        loaiPhong.setIdLoaiPhong(null);
        return loaiPhongRepository.save(loaiPhong);
    }

    // Cập nhật loại phòng
    public LoaiPhong updateLoaiPhong(Integer id, LoaiPhong loaiPhongDetails) {
        Optional<LoaiPhong> existingLoaiPhong = loaiPhongRepository.findById(id);
        if (existingLoaiPhong.isPresent()) {
            LoaiPhong loaiPhong = existingLoaiPhong.get();
            loaiPhong.setTenLoaiPhong(loaiPhongDetails.getTenLoaiPhong());
            loaiPhong.setMoTa(loaiPhongDetails.getMoTa());
            loaiPhong.setGia(loaiPhongDetails.getGia());
            loaiPhong.setHinhAnh(loaiPhongDetails.getHinhAnh());
            return loaiPhongRepository.save(loaiPhong);
        }
        return null;
    }

    // Xóa loại phòng
    public boolean deleteLoaiPhong(Integer id) {
        if (loaiPhongRepository.existsById(id)) {
            loaiPhongRepository.deleteById(id);
            return true;
        }
        return false;
    }

    

   

    // Kiểm tra tồn tại theo tên
    public boolean existsByTenLoaiPhong(String tenLoaiPhong) {
        return loaiPhongRepository.existsByTenLoaiPhong(tenLoaiPhong);
    }

    // Đếm tổng số loại phòng
    public long countAllLoaiPhong() {
        return loaiPhongRepository.count();
    }

    // Tìm loại phòng theo giá
    public List<LoaiPhong> findByGia(BigDecimal gia) {
        return loaiPhongRepository.findByGia(gia);
    }

    // Tìm loại phòng theo khoảng giá
    public List<LoaiPhong> findByGiaBetween(BigDecimal minGia, BigDecimal maxGia) {
        return loaiPhongRepository.findByGiaBetween(minGia, maxGia);
    }

    // Tìm loại phòng có giá lớn hơn
    public List<LoaiPhong> findByGiaGreaterThan(BigDecimal gia) {
        return loaiPhongRepository.findByGiaGreaterThan(gia);
    }

    // Tìm loại phòng có giá nhỏ hơn
    public List<LoaiPhong> findByGiaLessThan(BigDecimal gia) {
        return loaiPhongRepository.findByGiaLessThan(gia);
    }

    // Tìm loại phòng theo mô tả
    public List<LoaiPhong> findByMoTaContaining(String moTa) {
        return loaiPhongRepository.findByTenLoaiPhongContaining(moTa);
    }

    // Lấy loại phòng theo giá tăng dần
    public List<LoaiPhong> getAllLoaiPhongOrderByGiaAsc() {
        return loaiPhongRepository.findAllByOrderByGiaAsc();
    }

    // Lấy loại phòng theo giá giảm dần
    public List<LoaiPhong> getAllLoaiPhongOrderByGiaDesc() {
        return loaiPhongRepository.findAllByOrderByGiaDesc();
    }

    public List<LoaiPhongDTO> getAllLoaiPhongDTO() {
        return DTOConverter.toLoaiPhongDTOList(loaiPhongRepository.findAll());
    }
    public LoaiPhongDTO getLoaiPhongDTOById(Integer id) {
        try {
            System.out.println("[DEBUG] Looking for LoaiPhong with ID: " + id);
            Optional<LoaiPhong> loaiPhong = loaiPhongRepository.findById(id);
            if (loaiPhong.isPresent()) {
                System.out.println("[DEBUG] Found LoaiPhong: " + loaiPhong.get().getTenLoaiPhong());
                LoaiPhongDTO dto = DTOConverter.toLoaiPhongDTO(loaiPhong.get());
                System.out.println("[DEBUG] Converted to DTO: " + dto.getTenLoaiPhong());
                return dto;
            } else {
                System.out.println("[DEBUG] LoaiPhong not found with ID: " + id);
                return null;
            }
        } catch (Exception e) {
            System.err.println("[ERROR] Exception in getLoaiPhongDTOById: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    public List<LoaiPhong> findByTenLoaiPhong(String tenLoaiPhong) {
        Optional<LoaiPhong> loaiPhong = loaiPhongRepository.findByTenLoaiPhong(tenLoaiPhong);
        return loaiPhong.map(List::of).orElse(List.of());
    }
    public List<LoaiPhong> findByKeyword(String keyword) {
        return loaiPhongRepository.findByTenLoaiPhongContaining(keyword);
    }
} 