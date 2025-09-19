package com.holtel.hotel_management.controller;

import java.util.List;
import java.util.Optional;

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
import org.springframework.web.multipart.MultipartFile;

import com.holtel.hotel_management.dto.PhongDTO;
import com.holtel.hotel_management.dto.PhongDetailDTO;
import com.holtel.hotel_management.entity.Phong;
import com.holtel.hotel_management.service.FileStorageService;
import com.holtel.hotel_management.service.PhongService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/phong")
@CrossOrigin(origins = "*")
public class PhongController {

    @Autowired
    private PhongService phongService;
    
    @Autowired
    private FileStorageService fileStorageService;

    // Lấy tất cả phòng (chỉ thông tin cơ bản - DTO)
    @GetMapping
    public ResponseEntity<List<PhongDTO>> getAllPhong() {
        List<PhongDTO> phongList = phongService.getAllPhongDTO();
        return ResponseEntity.ok(phongList);
    }

    // Lấy tất cả phòng với thông tin chi tiết
    @GetMapping("/detail")
    public ResponseEntity<List<PhongDetailDTO>> getAllPhongDetail() {
        List<PhongDetailDTO> phongList = phongService.getAllPhongDetail();
        return ResponseEntity.ok(phongList);
    }

    // Lấy phòng theo ID (chỉ thông tin cơ bản - DTO)
    @GetMapping("/{id}")
    public ResponseEntity<PhongDTO> getPhongById(@PathVariable Integer id) {
        PhongDTO phong = phongService.getPhongDTOById(id);
        if (phong != null) {
            return ResponseEntity.ok(phong);
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy phòng theo ID với thông tin chi tiết
    @GetMapping("/{id}/detail")
    public ResponseEntity<PhongDetailDTO> getPhongDetailById(@PathVariable Integer id) {
        PhongDetailDTO phong = phongService.getPhongDetailById(id);
        if (phong != null) {
            return ResponseEntity.ok(phong);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo phòng mới (nhận DTO, trả về DTO)
 
    
    // Tạo phòng mới với ảnh (multipart/form-data)
    @PostMapping // POST /api/phong
    public ResponseEntity<PhongDTO> createPhongWithImage(
            @RequestParam("tenPhong") String tenPhong,
            @RequestParam("idTang") Integer idTang,
            @RequestParam("idLoaiPhong") Integer idLoaiPhong,
            @RequestParam("idDvi") Integer idDvi,
            @RequestParam("trangThai") String trangThai,
            @RequestParam("file") MultipartFile file) { // file là bắt buộc
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(null); // hoặc trả về message lỗi
            }
            // Tạo PhongDTO
            PhongDTO phongDTO = new PhongDTO();
            phongDTO.setTenPhong(tenPhong);
            phongDTO.setIdTang(idTang);
            phongDTO.setIdLoaiPhong(idLoaiPhong);
            phongDTO.setIdDvi(idDvi);
            phongDTO.setTrangThai(trangThai);
            // Xử lý upload ảnh
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/"))) {
                return ResponseEntity.badRequest().build();
            }
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = "room_" + System.currentTimeMillis() + fileExtension;
            String filePath = fileStorageService.storeFile(file, filename, "rooms");
            phongDTO.setAnhPhong(filePath);
            // Lưu phòng vào database
            Phong savedPhong = phongService.savePhong(phongDTO);
            PhongDTO savedDTO = DTOConverter.toPhongDTO(savedPhong);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật phòng (nhận DTO, trả về DTO)
    @PutMapping("/{id}")
    public ResponseEntity<PhongDTO> updatePhong(@PathVariable Integer id, @RequestBody PhongDTO phongDTO) {
        Phong updatedPhong = phongService.updatePhong(id, phongDTO); // truyền DTO trực tiếp
        if (updatedPhong != null) {
            PhongDTO updatedDTO = DTOConverter.toPhongDTO(updatedPhong);
            return ResponseEntity.ok(updatedDTO);
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa phòng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhong(@PathVariable Integer id) {
        boolean deleted = phongService.deletePhong(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Các API tìm kiếm, lọc, trả về List<Phong> => chuyển sang List<PhongDTO>
    @GetMapping("/search/ten")
    public ResponseEntity<PhongDTO> findByTenPhong(@RequestParam String tenPhong) {
        Optional<Phong> phong = phongService.findByTenPhong(tenPhong);
        return phong.map(DTOConverter::toPhongDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/trangthai")
    public ResponseEntity<List<PhongDTO>> findByTrangThai(@RequestParam String trangThai) {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findByTrangThai(trangThai));
        return ResponseEntity.ok(phongList);
    }

    @GetMapping("/search/loaiphong/{idLoaiPhong}")
    public ResponseEntity<List<PhongDTO>> findByLoaiPhong_IdLoaiPhong(@PathVariable Integer idLoaiPhong) {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findByLoaiPhong_IdLoaiPhong(idLoaiPhong));
        return ResponseEntity.ok(phongList);
    }

    @GetMapping("/search/tang/{idTang}")
    public ResponseEntity<List<PhongDTO>> findByTang_IdTang(@PathVariable Integer idTang) {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findByTang_IdTang(idTang));
        return ResponseEntity.ok(phongList);
    }

    @GetMapping("/search/keyword")
    public ResponseEntity<List<PhongDTO>> findByKeyword(@RequestParam String keyword) {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findByKeyword(keyword));
        return ResponseEntity.ok(phongList);
    }

    // Tìm phòng trống
    @GetMapping("/available")
    public ResponseEntity<List<PhongDTO>> findAvailableRooms() {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findAvailableRooms());
        return ResponseEntity.ok(phongList);
    }

    // Tìm phòng đã đặt
    @GetMapping("/booked")
    public ResponseEntity<List<PhongDTO>> findBookedRooms() {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findBookedRooms());
        return ResponseEntity.ok(phongList);
    }

    // Tìm phòng đang sử dụng
    @GetMapping("/occupied")
    public ResponseEntity<List<PhongDTO>> findOccupiedRooms() {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findOccupiedRooms());
        return ResponseEntity.ok(phongList);
    }

    // Tìm phòng bảo trì
    @GetMapping("/maintenance")
    public ResponseEntity<List<PhongDTO>> findMaintenanceRooms() {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findMaintenanceRooms());
        return ResponseEntity.ok(phongList);
    }

    // Tìm phòng theo loại phòng và trạng thái
    @GetMapping("/search/loaiphong-trangthai")
    public ResponseEntity<List<PhongDTO>> findByLoaiPhong_IdLoaiPhongAndTrangThai(@RequestParam Integer idLoaiPhong, @RequestParam String trangThai) {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findByLoaiPhong_IdLoaiPhongAndTrangThai(idLoaiPhong, trangThai));
        return ResponseEntity.ok(phongList);
    }

    // Tìm phòng theo tầng và trạng thái
    @GetMapping("/search/tang-trangthai")
    public ResponseEntity<List<PhongDTO>> findByTang_IdTangAndTrangThai(@RequestParam Integer idTang, @RequestParam String trangThai) {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findByTang_IdTangAndTrangThai(idTang, trangThai));
        return ResponseEntity.ok(phongList);
    }

    // Tìm phòng theo tầng và sắp xếp theo tên phòng
    @GetMapping("/search/tang-sort/{idTang}")
    public ResponseEntity<List<PhongDTO>> findByTang_IdTangOrderByTenPhong(@PathVariable Integer idTang) {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findByTang_IdTangOrderByTenPhong(idTang));
        return ResponseEntity.ok(phongList);
    }

    // Tìm phòng theo loại phòng và sắp xếp theo tên phòng
    @GetMapping("/search/loaiphong-sort/{idLoaiPhong}")
    public ResponseEntity<List<PhongDTO>> findByLoaiPhong_IdLoaiPhongOrderByTenPhong(@PathVariable Integer idLoaiPhong) {
        List<PhongDTO> phongList = DTOConverter.toPhongDTOList(phongService.findByLoaiPhong_IdLoaiPhongOrderByTenPhong(idLoaiPhong));
        return ResponseEntity.ok(phongList);
    }

    // Đếm tổng số phòng
    @GetMapping("/count")
    public ResponseEntity<Long> countAllPhong() {
        long count = phongService.countAllPhong();
        return ResponseEntity.ok(count);
    }

    // Đếm phòng theo trạng thái
    @GetMapping("/count/trangthai")
    public ResponseEntity<Long> countByTrangThai(@RequestParam String trangThai) {
        long count = phongService.countByTrangThai(trangThai);
        return ResponseEntity.ok(count);
    }

    // Đếm phòng theo loại phòng
    @GetMapping("/count/loaiphong/{idLoaiPhong}")
    public ResponseEntity<Long> countByLoaiPhong_IdLoaiPhong(@PathVariable Integer idLoaiPhong) {
        long count = phongService.countByLoaiPhong_IdLoaiPhong(idLoaiPhong);
        return ResponseEntity.ok(count);
    }

    // Đếm phòng theo tầng
    @GetMapping("/count/tang/{idTang}")
    public ResponseEntity<Long> countByTang_IdTang(@PathVariable Integer idTang) {
        long count = phongService.countByTang_IdTang(idTang);
        return ResponseEntity.ok(count);
    }
    
    // Upload ảnh cho phòng
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<String> uploadImageForPhong(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra phòng có tồn tại không
            Optional<Phong> phongOpt = phongService.getPhongById(id);
            if (phongOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Phong phong = phongOpt.get();
            
            // Kiểm tra file
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File không được để trống");
            }
            
            // Kiểm tra định dạng file
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/"))) {
                return ResponseEntity.badRequest().body("Chỉ chấp nhận file ảnh");
            }
            
            // Upload file
            String filePath = fileStorageService.storeFile(file, "room_" + id + "_" + System.currentTimeMillis() + ".jpg", "rooms");
            
            // Cập nhật đường dẫn ảnh trong database
            phong.setAnhPhong(filePath);
            phongService.savePhong(phong);
            
            return ResponseEntity.ok(filePath);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi upload ảnh: " + e.getMessage());
        }
    }

    // Cập nhật trạng thái tất cả phòng dựa trên thời gian thực
    @PostMapping("/update-status-all")
    public ResponseEntity<String> updateAllRoomStatus() {
        try {
            phongService.updateRoomStatusBasedOnBookings();
            return ResponseEntity.ok("Đã cập nhật trạng thái tất cả phòng thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật trạng thái phòng: " + e.getMessage());
        }
    }

    // Cập nhật trạng thái một phòng cụ thể dựa trên thời gian thực
    @PostMapping("/{id}/update-status")
    public ResponseEntity<String> updateRoomStatus(@PathVariable Integer id) {
        try {
            phongService.updateRoomStatus(id);
            return ResponseEntity.ok("Đã cập nhật trạng thái phòng thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật trạng thái phòng: " + e.getMessage());
        }
    }
} 