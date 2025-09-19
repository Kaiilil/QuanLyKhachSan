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

import com.holtel.hotel_management.dto.TangDTO;
import com.holtel.hotel_management.entity.Tang;
import com.holtel.hotel_management.service.TangService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/tang")
@CrossOrigin(origins = "*")
public class TangController {

    @Autowired
    private TangService tangService;

    // Lấy tất cả tầng (chỉ thông tin cơ bản - DTO)
    @GetMapping
    public ResponseEntity<List<TangDTO>> getAllTang() {
        List<TangDTO> tangList = tangService.getAllTangDTO();
        return ResponseEntity.ok(tangList);
    }

    // Lấy tất cả tầng với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/detail")
    public ResponseEntity<List<TangDTO>> getAllTangDetail() {
        List<TangDTO> tangList = tangService.getAllTangDTO();
        return ResponseEntity.ok(tangList);
    }

    // Lấy tầng theo ID (chỉ thông tin cơ bản - DTO)
    @GetMapping("/{id}")
    public ResponseEntity<TangDTO> getTangById(@PathVariable Integer id) {
        TangDTO tang = tangService.getTangDTOById(id);
        if (tang != null) {
            return ResponseEntity.ok(tang);
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy tầng theo ID với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/{id}/detail")
    public ResponseEntity<TangDTO> getTangDetailById(@PathVariable Integer id) {
        TangDTO tang = tangService.getTangDTOById(id);
        if (tang != null) {
            return ResponseEntity.ok(tang);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo tầng mới (nhận DTO, trả về DTO)
    @PostMapping
    public ResponseEntity<TangDTO> createTang(@RequestBody TangDTO tangDTO) {
        try {
            Tang savedTang = tangService.saveTang(DTOConverter.toTang(tangDTO));
            TangDTO savedDTO = DTOConverter.toTangDTO(savedTang);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật tầng (nhận DTO, trả về DTO)
    @PutMapping("/{id}")
    public ResponseEntity<TangDTO> updateTang(@PathVariable Integer id, @RequestBody TangDTO tangDTO) {
        Tang updatedTang = tangService.updateTang(id, DTOConverter.toTang(tangDTO));
        if (updatedTang != null) {
            TangDTO updatedDTO = DTOConverter.toTangDTO(updatedTang);
            return ResponseEntity.ok(updatedDTO);
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa tầng
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTang(@PathVariable Integer id) {
        try {
            boolean deleted = tangService.deleteTang(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Không thể xóa tầng vì đang được tham chiếu (ví dụ: phòng thuộc tầng này)");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa tầng thất bại");
        }
    }

    // Các API tìm kiếm, lọc, trả về List<Tang> => chuyển sang List<TangDTO>
    @GetMapping("/search/ten")
    public ResponseEntity<List<TangDTO>> findByTenTang(@RequestParam String tenTang) {
        List<TangDTO> dtoList = DTOConverter.toTangDTOList(tangService.findByTenTang(tenTang));
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/search/keyword")
    public ResponseEntity<List<TangDTO>> findByKeyword(@RequestParam String keyword) {
        List<TangDTO> tangList = DTOConverter.toTangDTOList(tangService.findByKeyword(keyword));
        return ResponseEntity.ok(tangList);
    }

    // Kiểm tra tồn tại theo tên
    @GetMapping("/exists/ten")
    public ResponseEntity<Boolean> existsByTenTang(@RequestParam String tenTang) {
        boolean exists = tangService.existsByTenTang(tenTang);
        return ResponseEntity.ok(exists);
    }

    // Đếm tổng số tầng
    @GetMapping("/count")
    public ResponseEntity<Long> countAllTang() {
        long count = tangService.countAllTang();
        return ResponseEntity.ok(count);
    }
} 