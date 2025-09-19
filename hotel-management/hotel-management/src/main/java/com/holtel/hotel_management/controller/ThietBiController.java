package com.holtel.hotel_management.controller;

import com.holtel.hotel_management.dto.ThietBiDTO;
import com.holtel.hotel_management.entity.ThietBi;
import com.holtel.hotel_management.service.ThietBiService;
import com.holtel.hotel_management.util.DTOConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/thietbi")
@CrossOrigin(origins = "*")
public class ThietBiController {
    @Autowired
    private ThietBiService thietBiService;

    // Lấy tất cả thiết bị
    @GetMapping
    public ResponseEntity<List<ThietBiDTO>> getAllThietBi() {
        List<ThietBiDTO> list = thietBiService.getAllThietBi().stream().map(DTOConverter::toThietBiDTO).toList();
        return ResponseEntity.ok(list);
    }

    // Lấy thiết bị theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ThietBiDTO> getThietBiById(@PathVariable Integer id) {
        Optional<ThietBi> thietBi = thietBiService.getThietBiById(id);
        return thietBi.map(DTOConverter::toThietBiDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Thêm thiết bị mới
    @PostMapping
    public ResponseEntity<ThietBiDTO> createThietBi(@RequestBody ThietBiDTO dto) {
        ThietBi thietBi = DTOConverter.toThietBi(dto);
        ThietBi saved = thietBiService.saveThietBi(thietBi);
        return ResponseEntity.status(HttpStatus.CREATED).body(DTOConverter.toThietBiDTO(saved));
    }

    // Cập nhật thiết bị
    @PutMapping("/{id}")
    public ResponseEntity<ThietBiDTO> updateThietBi(@PathVariable Integer id, @RequestBody ThietBiDTO dto) {
        ThietBi thietBi = DTOConverter.toThietBi(dto);
        ThietBi updated = thietBiService.updateThietBi(id, thietBi);
        if (updated != null) {
            return ResponseEntity.ok(DTOConverter.toThietBiDTO(updated));
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa thiết bị
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThietBi(@PathVariable Integer id) {
        boolean deleted = thietBiService.deleteThietBi(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Tìm kiếm thiết bị theo tên hoặc mô tả (keyword)
    @GetMapping("/search")
    public ResponseEntity<List<ThietBiDTO>> searchThietBi(@RequestParam String keyword) {
        List<ThietBiDTO> list = thietBiService.findByKeyword(keyword).stream().map(DTOConverter::toThietBiDTO).toList();
        return ResponseEntity.ok(list);
    }
}
