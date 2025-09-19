package com.holtel.hotel_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.holtel.hotel_management.dto.TangDTO;
import com.holtel.hotel_management.entity.Tang;
import com.holtel.hotel_management.repository.PhongRepository;
import com.holtel.hotel_management.repository.TangRepository;
import com.holtel.hotel_management.util.DTOConverter;

@Service
public class TangService {

    @Autowired
    private TangRepository tangRepository;

    @Autowired
    private com.holtel.hotel_management.repository.DonViRepository donViRepository;

    @Autowired
    private PhongRepository phongRepository;

    // Lấy tất cả tầng
    public List<Tang> getAllTang() {
        return tangRepository.findAll();
    }

    // Lấy tất cả tầng dưới dạng DTO
    public List<TangDTO> getAllTangDTO() {
        return DTOConverter.toTangDTOList(tangRepository.findAll());
    }

    // Lấy tầng theo ID
    public Optional<Tang> getTangById(Integer id) {
        return tangRepository.findById(id);
    }

    // Lấy tầng theo ID dưới dạng DTO
    public TangDTO getTangDTOById(Integer id) {
        Optional<Tang> tang = tangRepository.findById(id);
        return tang.map(DTOConverter::toTangDTO).orElse(null);
    }

    // Lưu tầng mới
    public Tang saveTang(Tang tang) {
        if (tang.getDonVi() != null && tang.getDonVi().getIdDvi() != null) {
            boolean exists = tangRepository.findByDonVi_IdDviAndTenTang(
                tang.getDonVi().getIdDvi(), tang.getTenTang()
            ).isPresent();
            if (exists) {
                throw new IllegalArgumentException("Tên tầng đã tồn tại trong đơn vị này!");
            }
        }
        return tangRepository.save(tang);
    }

    // Cập nhật tầng
    @Transactional
    public Tang updateTang(Integer id, Tang tangDetails) {
        Optional<Tang> existingTang = tangRepository.findById(id);
        if (existingTang.isPresent()) {
            Tang tang = existingTang.get();
            if (tangDetails.getTenTang() != null) {
                tang.setTenTang(tangDetails.getTenTang());
            }
            if (tangDetails.getDonVi() != null && tangDetails.getDonVi().getIdDvi() != null) {
                donViRepository.findById(tangDetails.getDonVi().getIdDvi()).ifPresent(tang::setDonVi);
            }
            return tangRepository.save(tang);
        }
        return null;
    }

    // Xóa tầng
    @Transactional
    public boolean deleteTang(Integer id) {
        if (!tangRepository.existsById(id)) {
            return false;
        }
        // Không cho xóa nếu còn phòng thuộc tầng này
        long soPhongThuocTang = phongRepository.countByTang_IdTang(id);
        if (soPhongThuocTang > 0) {
            throw new IllegalStateException("Không thể xóa tầng vì còn phòng thuộc tầng này!");
        }

        Tang tang = tangRepository.findById(id).orElse(null);
        if (tang == null) return false;
        tangRepository.delete(tang);
        return true;
    }

    // Tìm tầng theo tên
    public List<Tang> findByTenTang(String tenTang) {
        return tangRepository.findByTenTang(tenTang);
    }

    // Tìm tầng theo từ khóa
    public List<Tang> findByKeyword(String keyword) {
        return tangRepository.findByTenTangContaining(keyword);
    }

    // Kiểm tra tồn tại theo tên
    public boolean existsByTenTang(String tenTang) {
        return tangRepository.existsByTenTang(tenTang);
    }

    // Đếm tổng số tầng
    public long countAllTang() {
        return tangRepository.count();
    }
} 