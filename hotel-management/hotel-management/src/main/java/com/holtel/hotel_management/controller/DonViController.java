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

import com.holtel.hotel_management.dto.DonViDTO;
import com.holtel.hotel_management.entity.DonVi;
import com.holtel.hotel_management.service.DonViService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/donvi")
@CrossOrigin(origins = "*")
public class DonViController {

    @Autowired
    private DonViService donViService;

    // Lấy tất cả đơn vị (chỉ thông tin cơ bản - DTO)
    @GetMapping
    public ResponseEntity<List<DonViDTO>> getAllDonVi() {
        List<DonViDTO> donViList = donViService.getAllDonViDTO();
        return ResponseEntity.ok(donViList);
    }

    // Lấy tất cả đơn vị với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/detail")
    public ResponseEntity<List<DonViDTO>> getAllDonViDetail() {
        List<DonViDTO> donViList = donViService.getAllDonViDTO();
        return ResponseEntity.ok(donViList);
    }

    // Lấy đơn vị theo ID (chỉ thông tin cơ bản - DTO)
    @GetMapping("/{id}")
    public ResponseEntity<DonViDTO> getDonViById(@PathVariable Integer id) {
        DonViDTO donVi = donViService.getDonViDTOById(id);
        if (donVi != null) {
            return ResponseEntity.ok(donVi);
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy đơn vị theo ID với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/{id}/detail")
    public ResponseEntity<DonViDTO> getDonViDetailById(@PathVariable Integer id) {
        DonViDTO donVi = donViService.getDonViDTOById(id);
        if (donVi != null) {
            return ResponseEntity.ok(donVi);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo đơn vị mới (nhận DTO, trả về DTO)
    @PostMapping
    public ResponseEntity<DonViDTO> createDonVi(@RequestBody DonViDTO donViDTO) {
        try {
            DonVi savedDonVi = donViService.saveDonVi(DTOConverter.toDonVi(donViDTO));
            DonViDTO savedDTO = DTOConverter.toDonViDTO(savedDonVi);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật đơn vị (nhận DTO, trả về DTO)
    @PutMapping("/{id}")
    public ResponseEntity<DonViDTO> updateDonVi(@PathVariable Integer id, @RequestBody DonViDTO donViDTO) {
        DonVi updatedDonVi = donViService.updateDonVi(id, DTOConverter.toDonVi(donViDTO));
        if (updatedDonVi != null) {
            DonViDTO updatedDTO = DTOConverter.toDonViDTO(updatedDonVi);
            return ResponseEntity.ok(updatedDTO);
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa đơn vị
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonVi(@PathVariable Integer id) {
        boolean deleted = donViService.deleteDonVi(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Các API tìm kiếm, lọc, trả về List<DonVi> => chuyển sang List<DonViDTO>
    @GetMapping("/search/ten")
    public ResponseEntity<List<DonViDTO>> findByTenDvi(@RequestParam String tenDvi) {
        List<DonViDTO> dtoList = DTOConverter.toDonViDTOList(donViService.findByTenDvi(tenDvi).stream().toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/search/keyword")
    public ResponseEntity<List<DonViDTO>> findByKeyword(@RequestParam String keyword) {
        List<DonViDTO> donViList = DTOConverter.toDonViDTOList(donViService.findByKeyword(keyword));
        return ResponseEntity.ok(donViList);
    }

    // Kiểm tra tồn tại theo tên
    @GetMapping("/exists/ten")
    public ResponseEntity<Boolean> existsByTenDvi(@RequestParam String tenDvi) {
        boolean exists = donViService.existsByTenDvi(tenDvi);
        return ResponseEntity.ok(exists);
    }

    // Đếm tổng số đơn vị
    @GetMapping("/count")
    public ResponseEntity<Long> countAllDonVi() {
        long count = donViService.countAllDonVi();
        return ResponseEntity.ok(count);
    }
} 