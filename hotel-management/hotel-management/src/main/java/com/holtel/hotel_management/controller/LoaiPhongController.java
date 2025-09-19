package com.holtel.hotel_management.controller;

import java.math.BigDecimal;
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

import com.holtel.hotel_management.dto.LoaiPhongDTO;
import com.holtel.hotel_management.entity.LoaiPhong;
import com.holtel.hotel_management.service.LoaiPhongService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/loaiphong")
@CrossOrigin(origins = "*")
public class LoaiPhongController {

    @Autowired
    private LoaiPhongService loaiPhongService;

    // Lấy tất cả loại phòng (chuẩn hóa sang DTO)
    @GetMapping
    public ResponseEntity<List<LoaiPhongDTO>> getAllLoaiPhong() {
        List<LoaiPhongDTO> loaiPhongList = loaiPhongService.getAllLoaiPhongDTO();
        return ResponseEntity.ok(loaiPhongList);
    }

    // Lấy loại phòng theo ID (chuẩn hóa sang DTO)
    @GetMapping("/{id}")
    public ResponseEntity<LoaiPhongDTO> getLoaiPhongById(@PathVariable Integer id) {
        try {
            System.out.println("[DEBUG] Controller: Getting LoaiPhong with ID: " + id);
            LoaiPhongDTO loaiPhong = loaiPhongService.getLoaiPhongDTOById(id);
            if (loaiPhong != null) {
                System.out.println("[DEBUG] Controller: Returning LoaiPhong: " + loaiPhong.getTenLoaiPhong());
                return ResponseEntity.ok(loaiPhong);
            }
            System.out.println("[DEBUG] Controller: LoaiPhong not found");
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("[ERROR] Controller: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Tạo loại phòng mới (nhận DTO, trả về DTO)
    @PostMapping
    public ResponseEntity<LoaiPhongDTO> createLoaiPhong(@RequestBody LoaiPhongDTO loaiPhongDTO) {
        try {
            LoaiPhong savedLoaiPhong = loaiPhongService.createLoaiPhong(DTOConverter.toLoaiPhong(loaiPhongDTO));
            LoaiPhongDTO savedDTO = DTOConverter.toLoaiPhongDTO(savedLoaiPhong);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật loại phòng (nhận DTO, trả về DTO)
    @PutMapping("/{id}")
    public ResponseEntity<LoaiPhongDTO> updateLoaiPhong(@PathVariable Integer id, @RequestBody LoaiPhongDTO loaiPhongDTO) {
        LoaiPhong updatedLoaiPhong = loaiPhongService.updateLoaiPhong(id, DTOConverter.toLoaiPhong(loaiPhongDTO));
        if (updatedLoaiPhong != null) {
            LoaiPhongDTO updatedDTO = DTOConverter.toLoaiPhongDTO(updatedLoaiPhong);
            return ResponseEntity.ok(updatedDTO);
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa loại phòng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoaiPhong(@PathVariable Integer id) {
        boolean deleted = loaiPhongService.deleteLoaiPhong(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Các API tìm kiếm, lọc, trả về List<LoaiPhong> => chuyển sang List<LoaiPhongDTO>
    @GetMapping("/search/ten")
    public ResponseEntity<List<LoaiPhongDTO>> findByTenLoaiPhong(@RequestParam String tenLoaiPhong) {
        List<LoaiPhongDTO> dtoList = DTOConverter.toLoaiPhongDTOList(loaiPhongService.findByTenLoaiPhong(tenLoaiPhong).stream().toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/search/keyword")
    public ResponseEntity<List<LoaiPhongDTO>> findByKeyword(@RequestParam String keyword) {
        List<LoaiPhongDTO> loaiPhongList = DTOConverter.toLoaiPhongDTOList(loaiPhongService.findByKeyword(keyword));
        return ResponseEntity.ok(loaiPhongList);
    }

    // Tìm loại phòng theo giá
    @GetMapping("/search/gia")
    public ResponseEntity<List<LoaiPhongDTO>> findByGia(@RequestParam BigDecimal gia) {
        List<LoaiPhongDTO> loaiPhongList = DTOConverter.toLoaiPhongDTOList(loaiPhongService.findByGia(gia));
        return ResponseEntity.ok(loaiPhongList);
    }

    // Tìm loại phòng theo khoảng giá
    @GetMapping("/search/gia-between")
    public ResponseEntity<List<LoaiPhongDTO>> findByGiaBetween(@RequestParam BigDecimal minGia, @RequestParam BigDecimal maxGia) {
        List<LoaiPhongDTO> loaiPhongList = DTOConverter.toLoaiPhongDTOList(loaiPhongService.findByGiaBetween(minGia, maxGia));
        return ResponseEntity.ok(loaiPhongList);
    }

    // Tìm loại phòng có giá lớn hơn
    @GetMapping("/search/gia-greater")
    public ResponseEntity<List<LoaiPhongDTO>> findByGiaGreaterThan(@RequestParam BigDecimal gia) {
        List<LoaiPhongDTO> loaiPhongList = DTOConverter.toLoaiPhongDTOList(loaiPhongService.findByGiaGreaterThan(gia));
        return ResponseEntity.ok(loaiPhongList);
    }

    // Tìm loại phòng có giá nhỏ hơn
    @GetMapping("/search/gia-less")
    public ResponseEntity<List<LoaiPhongDTO>> findByGiaLessThan(@RequestParam BigDecimal gia) {
        List<LoaiPhongDTO> loaiPhongList = DTOConverter.toLoaiPhongDTOList(loaiPhongService.findByGiaLessThan(gia));
        return ResponseEntity.ok(loaiPhongList);
    }

    // Lấy loại phòng theo giá tăng dần
    @GetMapping("/sort/gia-asc")
    public ResponseEntity<List<LoaiPhongDTO>> getAllLoaiPhongOrderByGiaAsc() {
        List<LoaiPhongDTO> loaiPhongList = DTOConverter.toLoaiPhongDTOList(loaiPhongService.getAllLoaiPhongOrderByGiaAsc());
        return ResponseEntity.ok(loaiPhongList);
    }

    // Lấy loại phòng theo giá giảm dần
    @GetMapping("/sort/gia-desc")
    public ResponseEntity<List<LoaiPhongDTO>> getAllLoaiPhongOrderByGiaDesc() {
        List<LoaiPhongDTO> loaiPhongList = DTOConverter.toLoaiPhongDTOList(loaiPhongService.getAllLoaiPhongOrderByGiaDesc());
        return ResponseEntity.ok(loaiPhongList);
    }

    // Kiểm tra tồn tại theo tên
    @GetMapping("/exists/ten")
    public ResponseEntity<Boolean> existsByTenLoaiPhong(@RequestParam String tenLoaiPhong) {
        boolean exists = loaiPhongService.existsByTenLoaiPhong(tenLoaiPhong);
        return ResponseEntity.ok(exists);
    }

    // Đếm tổng số loại phòng
    @GetMapping("/count")
    public ResponseEntity<Long> countAllLoaiPhong() {
        long count = loaiPhongService.countAllLoaiPhong();
        return ResponseEntity.ok(count);
    }
} 