package com.holtel.hotel_management.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

import com.holtel.hotel_management.dto.PhongThietBiDTO;
import com.holtel.hotel_management.entity.PhongThietBi;
import com.holtel.hotel_management.service.PhongThietBiService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/phongthietbi")
@CrossOrigin(origins = "*")
public class PhongThietBiController {
    @Autowired
    private PhongThietBiService phongThietBiService;

    // Lấy tất cả phòng-thiết bị
    @GetMapping
    public ResponseEntity<List<PhongThietBiDTO>> getAllPhongThietBi() {
        List<PhongThietBiDTO> list = phongThietBiService.getAllPhongThietBi().stream().map(DTOConverter::toPhongThietBiDTO).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // Lấy phòng-thiết bị theo ID
    @GetMapping("/{id}")
    public ResponseEntity<PhongThietBiDTO> getPhongThietBiById(@PathVariable Integer id) {
        Optional<PhongThietBi> ptb = phongThietBiService.getPhongThietBiById(id);
        return ptb.map(DTOConverter::toPhongThietBiDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Thêm thiết bị vào phòng
    @PostMapping
    public ResponseEntity<PhongThietBiDTO> createPhongThietBi(@RequestBody PhongThietBiDTO dto) {
        PhongThietBi ptb = DTOConverter.toPhongThietBi(dto);
        PhongThietBi saved = phongThietBiService.savePhongThietBi(ptb);
        return ResponseEntity.status(HttpStatus.CREATED).body(DTOConverter.toPhongThietBiDTO(saved));
    }

    // Cập nhật số lượng thiết bị trong phòng
    @PutMapping("/{id}")
    public ResponseEntity<PhongThietBiDTO> updatePhongThietBi(@PathVariable Integer id, @RequestBody PhongThietBiDTO dto) {
        PhongThietBi ptb = DTOConverter.toPhongThietBi(dto);
        PhongThietBi updated = phongThietBiService.updatePhongThietBi(id, ptb);
        if (updated != null) {
            return ResponseEntity.ok(DTOConverter.toPhongThietBiDTO(updated));
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa thiết bị khỏi phòng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhongThietBi(@PathVariable Integer id) {
        boolean deleted = phongThietBiService.deletePhongThietBi(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy tất cả thiết bị trong 1 phòng
    @GetMapping("/phong/{idPhong}")
    public ResponseEntity<List<PhongThietBiDTO>> getByPhong(@PathVariable Integer idPhong) {
        List<PhongThietBiDTO> list = phongThietBiService.findByPhong_IdPhong(idPhong).stream().map(DTOConverter::toPhongThietBiDTO).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // Lấy tất cả phòng có 1 thiết bị
    @GetMapping("/thietbi/{idTb}")
    public ResponseEntity<List<PhongThietBiDTO>> getByThietBi(@PathVariable Integer idTb) {
        List<PhongThietBiDTO> list = phongThietBiService.findByThietBi_IdTb(idTb).stream().map(DTOConverter::toPhongThietBiDTO).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // Lấy theo phòng và thiết bị
    @GetMapping("/phong-thietbi")
    public ResponseEntity<PhongThietBiDTO> getByPhongAndThietBi(@RequestParam Integer idPhong, @RequestParam Integer idTb) {
        Optional<PhongThietBi> ptb = phongThietBiService.findByPhong_IdPhongAndThietBi_IdTb(idPhong, idTb);
        return ptb.map(DTOConverter::toPhongThietBiDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
