package com.holtel.hotel_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.dto.DonViDTO;
import com.holtel.hotel_management.entity.CongTy;
import com.holtel.hotel_management.entity.DonVi;
import com.holtel.hotel_management.repository.CongTyRepository;
import com.holtel.hotel_management.repository.DonViRepository;
import com.holtel.hotel_management.util.DTOConverter;

@Service
public class DonViService {

    @Autowired
    private DonViRepository donViRepository;
    
    @Autowired
    private CongTyRepository congTyRepository;

    // Lấy tất cả đơn vị
    public List<DonVi> getAllDonVi() {
        return donViRepository.findAll();
    }

    // Lấy tất cả đơn vị dưới dạng DTO
    public List<DonViDTO> getAllDonViDTO() {
        return DTOConverter.toDonViDTOList(donViRepository.findAll());
    }

    // Lấy đơn vị theo ID
    public Optional<DonVi> getDonViById(Integer id) {
        return donViRepository.findById(id);
    }

    // Lấy đơn vị theo ID dưới dạng DTO
    public DonViDTO getDonViDTOById(Integer id) {
        Optional<DonVi> donVi = donViRepository.findById(id);
        return donVi.map(DTOConverter::toDonViDTO).orElse(null);
    }

    // Lưu đơn vị mới
    public DonVi saveDonVi(DonVi donVi) {
        // Gắn CongTy nếu client gửi maCty
        if (donVi.getCongTy() != null && donVi.getCongTy().getMaCty() != null) {
            Optional<CongTy> congTy = congTyRepository.findById(donVi.getCongTy().getMaCty());
            congTy.ifPresent(donVi::setCongTy);
        } else {
            donVi.setCongTy(null);
        }
        return donViRepository.save(donVi);
    }

    // Cập nhật đơn vị
    public DonVi updateDonVi(Integer id, DonVi donViDetails) {
        Optional<DonVi> existingDonVi = donViRepository.findById(id);
        if (existingDonVi.isPresent()) {
            DonVi donVi = existingDonVi.get();
            if (donViDetails.getTenDvi() != null) {
                donVi.setTenDvi(donViDetails.getTenDvi());
            }
            if (donViDetails.getCongTy() != null && donViDetails.getCongTy().getMaCty() != null) {
                congTyRepository.findById(donViDetails.getCongTy().getMaCty())
                    .ifPresent(donVi::setCongTy);
            }
            return donViRepository.save(donVi);
        }
        return null;
    }

    // Xóa đơn vị
    public boolean deleteDonVi(Integer id) {
        if (donViRepository.existsById(id)) {
            donViRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm đơn vị theo tên
    public Optional<DonVi> findByTenDvi(String tenDvi) {
        return donViRepository.findByTenDvi(tenDvi);
    }

    // Tìm đơn vị theo từ khóa
    public List<DonVi> findByKeyword(String keyword) {
        return donViRepository.findByTenDviContaining(keyword);
    }

    // Kiểm tra tồn tại theo tên
    public boolean existsByTenDvi(String tenDvi) {
        return donViRepository.existsByTenDvi(tenDvi);
    }

    // Đếm tổng số đơn vị
    public long countAllDonVi() {
        return donViRepository.count();
    }
} 