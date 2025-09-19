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
import org.springframework.web.bind.annotation.RestController;

import com.holtel.hotel_management.dto.DatPhongSanPhamDTO;
import com.holtel.hotel_management.entity.DatPhong;
import com.holtel.hotel_management.entity.DatPhongSanPham;
import com.holtel.hotel_management.entity.SanPham;
import com.holtel.hotel_management.repository.DatPhongRepository;
import com.holtel.hotel_management.repository.SanPhamRepository;
import com.holtel.hotel_management.service.DatPhongSanPhamService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/datphong-sanpham")
@CrossOrigin(origins = "*")
public class DatPhongSanPhamController {

    @Autowired
    private DatPhongSanPhamService datPhongSanPhamService;
    
    @Autowired
    private DatPhongRepository datPhongRepository;
    
    @Autowired
    private SanPhamRepository sanPhamRepository;

    // Lấy tất cả đặt phòng sản phẩm
    @GetMapping
    public ResponseEntity<List<DatPhongSanPhamDTO>> getAllDatPhongSanPham() {
        List<DatPhongSanPham> datPhongSanPhamList = datPhongSanPhamService.getAllDatPhongSanPham();
        List<DatPhongSanPhamDTO> dtoList = datPhongSanPhamList.stream()
            .map(this::convertToDTO)
            .toList();
        return ResponseEntity.ok(dtoList);
    }

    // Lấy đặt phòng sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<DatPhongSanPhamDTO> getDatPhongSanPhamById(@PathVariable Integer id) {
        var datPhongSanPham = datPhongSanPhamService.getDatPhongSanPhamById(id);
        if (datPhongSanPham.isPresent()) {
            return ResponseEntity.ok(convertToDTO(datPhongSanPham.get()));
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy đặt phòng sản phẩm theo ID đặt phòng
    @GetMapping("/datphong/{idDatPhong}")
    public ResponseEntity<List<DatPhongSanPhamDTO>> getDatPhongSanPhamByDatPhongId(@PathVariable Integer idDatPhong) {
        List<DatPhongSanPham> datPhongSanPhamList = datPhongSanPhamService.findByDatPhong_IdDatPhong(idDatPhong);
        List<DatPhongSanPhamDTO> dtoList = datPhongSanPhamList.stream()
            .map(this::convertToDTO)
            .toList();
        return ResponseEntity.ok(dtoList);
    }

    // Lấy đặt phòng sản phẩm theo ID sản phẩm
    @GetMapping("/sanpham/{idSp}")
    public ResponseEntity<List<DatPhongSanPhamDTO>> getDatPhongSanPhamBySanPhamId(@PathVariable Integer idSp) {
        List<DatPhongSanPham> datPhongSanPhamList = datPhongSanPhamService.findBySanPham_IdSp(idSp);
        List<DatPhongSanPhamDTO> dtoList = datPhongSanPhamList.stream()
            .map(this::convertToDTO)
            .toList();
        return ResponseEntity.ok(dtoList);
    }

    // Tạo đặt phòng sản phẩm mới
    @PostMapping
    public ResponseEntity<DatPhongSanPhamDTO> createDatPhongSanPham(@RequestBody DatPhongSanPhamDTO datPhongSanPhamDTO) {
        try {
            // Kiểm tra các trường bắt buộc
            if (datPhongSanPhamDTO.getIdDatPhong() == null || datPhongSanPhamDTO.getIdSp() == null || datPhongSanPhamDTO.getSoLuong() == null) {
                return ResponseEntity.badRequest().build();
            }
            
            // Tìm đặt phòng và sản phẩm
            var datPhong = datPhongRepository.findById(datPhongSanPhamDTO.getIdDatPhong());
            var sanPham = sanPhamRepository.findById(datPhongSanPhamDTO.getIdSp());
            
            if (datPhong.isEmpty() || sanPham.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            // Tạo entity
            DatPhongSanPham datPhongSanPham = new DatPhongSanPham();
            datPhongSanPham.setDatPhong(datPhong.get());
            datPhongSanPham.setSanPham(sanPham.get());
            datPhongSanPham.setSoLuong(datPhongSanPhamDTO.getSoLuong());
            
            DatPhongSanPham savedDatPhongSanPham = datPhongSanPhamService.saveDatPhongSanPham(datPhongSanPham);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedDatPhongSanPham));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật đặt phòng sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<DatPhongSanPhamDTO> updateDatPhongSanPham(@PathVariable Integer id, @RequestBody DatPhongSanPhamDTO datPhongSanPhamDTO) {
        try {
            DatPhongSanPham updatedDatPhongSanPham = datPhongSanPhamService.updateDatPhongSanPham(id, convertToEntity(datPhongSanPhamDTO));
            if (updatedDatPhongSanPham != null) {
                return ResponseEntity.ok(convertToDTO(updatedDatPhongSanPham));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Xóa đặt phòng sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDatPhongSanPham(@PathVariable Integer id) {
        boolean deleted = datPhongSanPhamService.deleteDatPhongSanPham(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Đếm tổng số đặt phòng sản phẩm
    @GetMapping("/count")
    public ResponseEntity<Long> countAllDatPhongSanPham() {
        long count = datPhongSanPhamService.countAllDatPhongSanPham();
        return ResponseEntity.ok(count);
    }

    // Đếm đặt phòng sản phẩm theo đặt phòng
    @GetMapping("/count/datphong/{idDatPhong}")
    public ResponseEntity<Long> countByDatPhong_IdDatPhong(@PathVariable Integer idDatPhong) {
        long count = datPhongSanPhamService.countByDatPhong_IdDatPhong(idDatPhong);
        return ResponseEntity.ok(count);
    }

    // Đếm đặt phòng sản phẩm theo sản phẩm
    @GetMapping("/count/sanpham/{idSp}")
    public ResponseEntity<Long> countBySanPham_IdSp(@PathVariable Integer idSp) {
        long count = datPhongSanPhamService.countBySanPham_IdSp(idSp);
        return ResponseEntity.ok(count);
    }

    // Tính tổng số lượng sản phẩm theo đặt phòng
    @GetMapping("/sum/datphong/{idDatPhong}")
    public ResponseEntity<Integer> sumSoLuongByDatPhong(@PathVariable Integer idDatPhong) {
        Integer sum = datPhongSanPhamService.sumSoLuongByDatPhong(idDatPhong);
        return ResponseEntity.ok(sum != null ? sum : 0);
    }

    // Tính tổng giá trị sản phẩm theo đặt phòng
    @GetMapping("/sum-value/datphong/{idDatPhong}")
    public ResponseEntity<Double> sumGiaTriByDatPhong(@PathVariable Integer idDatPhong) {
        Double sum = datPhongSanPhamService.sumGiaTriByDatPhong(idDatPhong);
        return ResponseEntity.ok(sum != null ? sum : 0.0);
    }

    // Helper methods
    private DatPhongSanPhamDTO convertToDTO(DatPhongSanPham entity) {
        DatPhongSanPhamDTO dto = new DatPhongSanPhamDTO();
        dto.setIdDpSp(entity.getIdDpSp());
        dto.setIdDatPhong(entity.getDatPhong().getIdDatPhong());
        dto.setIdSp(entity.getSanPham().getIdSp());
        dto.setSoLuong(entity.getSoLuong());
        return dto;
    }

    private DatPhongSanPham convertToEntity(DatPhongSanPhamDTO dto) {
        DatPhongSanPham entity = new DatPhongSanPham();
        entity.setIdDpSp(dto.getIdDpSp());
        // Note: This is a simplified conversion, in practice you'd need to load the related entities
        return entity;
    }
}
