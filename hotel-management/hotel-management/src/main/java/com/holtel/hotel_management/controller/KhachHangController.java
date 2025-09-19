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

import com.holtel.hotel_management.dto.KhachHangDTO;
import com.holtel.hotel_management.entity.KhachHang;
import com.holtel.hotel_management.service.KhachHangService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/khachhang")
@CrossOrigin(origins = "*")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    // Lấy tất cả khách hàng (chỉ thông tin cơ bản - DTO)
    @GetMapping
    public ResponseEntity<List<KhachHangDTO>> getAllKhachHang() {
        List<KhachHangDTO> khachHangList = khachHangService.getAllKhachHangDTO();
        return ResponseEntity.ok(khachHangList);
    }

    // Lấy tất cả khách hàng với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/detail")
    public ResponseEntity<List<KhachHangDTO>> getAllKhachHangDetail() {
        List<KhachHangDTO> khachHangList = khachHangService.getAllKhachHangDTO();
        return ResponseEntity.ok(khachHangList);
    }

    // Lấy khách hàng theo ID (chỉ thông tin cơ bản - DTO)
    @GetMapping("/{id}")
    public ResponseEntity<KhachHangDTO> getKhachHangById(@PathVariable Integer id) {
        KhachHangDTO khachHang = khachHangService.getKhachHangDTOById(id);
        if (khachHang != null) {
            return ResponseEntity.ok(khachHang);
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy khách hàng theo ID với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/{id}/detail")
    public ResponseEntity<KhachHangDTO> getKhachHangDetailById(@PathVariable Integer id) {
        KhachHangDTO khachHang = khachHangService.getKhachHangDTOById(id);
        if (khachHang != null) {
            return ResponseEntity.ok(khachHang);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo khách hàng mới (nhận DTO, trả về DTO)
    @PostMapping
    public ResponseEntity<KhachHangDTO> createKhachHang(@RequestBody KhachHangDTO khachHangDTO) {
        try {
            KhachHang savedKhachHang = khachHangService.saveKhachHang(DTOConverter.toKhachHang(khachHangDTO));
            KhachHangDTO savedDTO = DTOConverter.toKhachHangDTO(savedKhachHang);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật khách hàng (nhận DTO, trả về DTO)
    @PutMapping("/{id}")
    public ResponseEntity<KhachHangDTO> updateKhachHang(@PathVariable Integer id, @RequestBody KhachHangDTO khachHangDTO) {
        KhachHang updatedKhachHang = khachHangService.updateKhachHang(id, DTOConverter.toKhachHang(khachHangDTO));
        if (updatedKhachHang != null) {
            KhachHangDTO updatedDTO = DTOConverter.toKhachHangDTO(updatedKhachHang);
            return ResponseEntity.ok(updatedDTO);
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa khách hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKhachHang(@PathVariable Integer id) {
        boolean deleted = khachHangService.deleteKhachHang(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Các API tìm kiếm, lọc, trả về List<KhachHang> => chuyển sang List<KhachHangDTO>
    @GetMapping("/search/keyword")
    public ResponseEntity<List<KhachHangDTO>> findByKeyword(@RequestParam String keyword) {
        List<KhachHangDTO> khachHangList = DTOConverter.toKhachHangDTOList(khachHangService.findByKeyword(keyword));
        return ResponseEntity.ok(khachHangList);
    }

    // Đếm tổng số khách hàng
    @GetMapping("/count")
    public ResponseEntity<Long> countAllKhachHang() {
        long count = khachHangService.countAllKhachHang();
        return ResponseEntity.ok(count);
    }
} 