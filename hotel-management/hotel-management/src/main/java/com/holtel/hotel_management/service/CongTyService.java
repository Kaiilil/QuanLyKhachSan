package com.holtel.hotel_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.dto.CongTyDTO;
import com.holtel.hotel_management.entity.CongTy;
import com.holtel.hotel_management.repository.CongTyRepository;
import com.holtel.hotel_management.util.DTOConverter;

@Service
public class CongTyService {

    @Autowired
    private CongTyRepository congTyRepository;

    // Lấy tất cả công ty
    public List<CongTy> getAllCongTy() {
        return congTyRepository.findAll();
    }

    // Lấy tất cả công ty dưới dạng DTO (chỉ thông tin cơ bản)
    public List<CongTyDTO> getAllCongTyDTO() {
        return DTOConverter.toCongTyDTOList(congTyRepository.findAll());
    }
    public CongTyDTO getCongTyDTOById(String id) {
        Optional<CongTy> congTy = congTyRepository.findById(id);
        return congTy.map(DTOConverter::toCongTyDTO).orElse(null);
    }

    // Lấy công ty theo ID
    public Optional<CongTy> getCongTyById(String id) {
        return congTyRepository.findByMaCty(id);
    }

    // Lưu công ty mới
    public CongTy saveCongTy(CongTy congTy) {
        return congTyRepository.save(congTy);
    }

    // Cập nhật công ty
    public CongTy updateCongTy(String id, CongTy congTyDetails) {
        Optional<CongTy> existingCongTy = congTyRepository.findByMaCty(id);
        if (existingCongTy.isPresent()) {
            CongTy congTy = existingCongTy.get();
            congTy.setTenCty(congTyDetails.getTenCty());
            return congTyRepository.save(congTy);
        }
        return null;
    }

    // Xóa công ty
    public boolean deleteCongTy(String id) {
        if (congTyRepository.existsByMaCty(id)) {
            congTyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    

    // Kiểm tra tồn tại theo tên
    public boolean existsByTenCty(String tenCty) {
        return congTyRepository.existsByTenCty(tenCty);
    }

    // Đếm tổng số công ty
    public long countAllCongTy() {
        return congTyRepository.count();
    }

    public List<CongTy> findByTenCty(String tenCty) {
        return congTyRepository.findByTenCty(tenCty).map(List::of).orElse(List.of());
    }
} 