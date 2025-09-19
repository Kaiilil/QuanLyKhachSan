package com.holtel.hotel_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.holtel.hotel_management.dto.CongTyDTO;
import com.holtel.hotel_management.entity.CongTy;
import com.holtel.hotel_management.service.CongTyService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/congty")
@CrossOrigin(origins = "*")
public class CongTyController {

    @Autowired
    private CongTyService congTyService;

    // Lấy tất cả công ty (chỉ thông tin cơ bản - DTO)
    @GetMapping
    public ResponseEntity<List<CongTyDTO>> getAllCongTy() {
        List<CongTyDTO> congTyList = congTyService.getAllCongTyDTO();
        return ResponseEntity.ok(congTyList);
    }

    // Lấy công ty theo ID (chỉ thông tin cơ bản - DTO)
    @GetMapping("/{id}")
    public ResponseEntity<CongTyDTO> getCongTyById(@PathVariable String id) {
        CongTyDTO congTy = congTyService.getCongTyDTOById(id);
        if (congTy != null) {
            return ResponseEntity.ok(congTy);
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy tất cả công ty với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/detail")
    public ResponseEntity<List<CongTyDTO>> getAllCongTyDetail() {
        List<CongTyDTO> congTyList = congTyService.getAllCongTyDTO();
        return ResponseEntity.ok(congTyList);
    }

    // Lấy công ty theo ID với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/{id}/detail")
    public ResponseEntity<CongTyDTO> getCongTyDetailById(@PathVariable String id) {
        CongTyDTO congTy = congTyService.getCongTyDTOById(id);
        if (congTy != null) {
            return ResponseEntity.ok(congTy);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo công ty mới (nhận DTO, trả về DTO)
    @PostMapping
    public ResponseEntity<CongTyDTO> createCongTy(@RequestBody CongTyDTO congTyDTO) {
        try {
            CongTy savedCongTy = congTyService.saveCongTy(DTOConverter.toCongTy(congTyDTO));
            CongTyDTO savedDTO = DTOConverter.toCongTyDTO(savedCongTy);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật công ty (nhận DTO, trả về DTO)
    @PutMapping("/{id}")
    public ResponseEntity<CongTyDTO> updateCongTy(@PathVariable String id, @RequestBody CongTyDTO congTyDTO) {
        CongTy updatedCongTy = congTyService.updateCongTy(id, DTOConverter.toCongTy(congTyDTO));
        if (updatedCongTy != null) {
            CongTyDTO updatedDTO = DTOConverter.toCongTyDTO(updatedCongTy);
            return ResponseEntity.ok(updatedDTO);
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa công ty
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCongTy(@PathVariable String id) {
        boolean deleted = congTyService.deleteCongTy(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Các API tìm kiếm, lọc, trả về List<CongTy> => chuyển sang List<CongTyDTO>
    @GetMapping("/search/ten")
    public ResponseEntity<List<CongTyDTO>> findByTenCty(@RequestParam String tenCty) {
        List<CongTyDTO> dtoList = DTOConverter.toCongTyDTOList(congTyService.findByTenCty(tenCty).stream().toList());
        return ResponseEntity.ok(dtoList);
    }

    // Kiểm tra tồn tại theo tên
    @GetMapping("/exists/ten")
    public ResponseEntity<Boolean> existsByTenCty(@RequestParam String tenCty) {
        boolean exists = congTyService.existsByTenCty(tenCty);
        return ResponseEntity.ok(exists);
    }

    // Đếm tổng số công ty
    @GetMapping("/count")
    public ResponseEntity<Long> countAllCongTy() {
        long count = congTyService.countAllCongTy();
        return ResponseEntity.ok(count);
    }
} 