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

import com.holtel.hotel_management.dto.SanPhamDTO;
import com.holtel.hotel_management.entity.SanPham;
import com.holtel.hotel_management.service.SanPhamService;

@RestController
@RequestMapping("/api/sanpham")
@CrossOrigin(origins = "*")
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;

    // Lấy tất cả sản phẩm
    @GetMapping
    public ResponseEntity<List<SanPhamDTO>> getAllSanPham() {
        List<SanPham> sanPhamList = sanPhamService.getAllSanPham();
        List<SanPhamDTO> dtoList = sanPhamList.stream()
            .map(this::convertToDTO)
            .toList();
        return ResponseEntity.ok(dtoList);
    }

    // Lấy sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<SanPhamDTO> getSanPhamById(@PathVariable Integer id) {
        var sanPham = sanPhamService.getSanPhamById(id);
        if (sanPham.isPresent()) {
            return ResponseEntity.ok(convertToDTO(sanPham.get()));
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo sản phẩm mới
    @PostMapping
    public ResponseEntity<SanPhamDTO> createSanPham(@RequestBody SanPhamDTO sanPhamDTO) {
        try {
            // Kiểm tra các trường bắt buộc
            if (sanPhamDTO.getTenSp() == null || sanPhamDTO.getDonGia() == null) {
                return ResponseEntity.badRequest().build();
            }
            
            SanPham sanPham = convertToEntity(sanPhamDTO);
            SanPham savedSanPham = sanPhamService.saveSanPham(sanPham);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedSanPham));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<SanPhamDTO> updateSanPham(@PathVariable Integer id, @RequestBody SanPhamDTO sanPhamDTO) {
        try {
            SanPham updatedSanPham = sanPhamService.updateSanPham(id, convertToEntity(sanPhamDTO));
            if (updatedSanPham != null) {
                return ResponseEntity.ok(convertToDTO(updatedSanPham));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSanPham(@PathVariable Integer id) {
        boolean deleted = sanPhamService.deleteSanPham(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Tìm sản phẩm theo tên
    @GetMapping("/search/ten/{tenSp}")
    public ResponseEntity<List<SanPhamDTO>> findByTenSpContaining(@PathVariable String tenSp) {
        List<SanPham> sanPhamList = sanPhamService.findByTenSpContaining(tenSp);
        List<SanPhamDTO> dtoList = sanPhamList.stream()
            .map(this::convertToDTO)
            .toList();
        return ResponseEntity.ok(dtoList);
    }

    // Tìm sản phẩm theo khoảng giá
    @GetMapping("/search/gia")
    public ResponseEntity<List<SanPhamDTO>> findByDonGiaBetween(
            @RequestParam Double minGia, 
            @RequestParam Double maxGia) {
        List<SanPham> sanPhamList = sanPhamService.findByDonGiaBetween(minGia, maxGia);
        List<SanPhamDTO> dtoList = sanPhamList.stream()
            .map(this::convertToDTO)
            .toList();
        return ResponseEntity.ok(dtoList);
    }

    // Đếm tổng số sản phẩm
    @GetMapping("/count")
    public ResponseEntity<Long> countAllSanPham() {
        long count = sanPhamService.countAllSanPham();
        return ResponseEntity.ok(count);
    }

    // Helper methods
    private SanPhamDTO convertToDTO(SanPham entity) {
        SanPhamDTO dto = new SanPhamDTO();
        dto.setIdSp(entity.getIdSp());
        dto.setTenSp(entity.getTenSp());
        dto.setDonGia(entity.getDonGia().doubleValue());
        dto.setMoTa(entity.getMoTa());
        return dto;
    }

    private SanPham convertToEntity(SanPhamDTO dto) {
        SanPham entity = new SanPham();
        entity.setIdSp(dto.getIdSp());
        entity.setTenSp(dto.getTenSp());
        entity.setDonGia(java.math.BigDecimal.valueOf(dto.getDonGia()));
        entity.setMoTa(dto.getMoTa());
        return entity;
    }
}
