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

import com.holtel.hotel_management.dto.DatPhongDTO;
import com.holtel.hotel_management.entity.DatPhong;
import com.holtel.hotel_management.entity.KhachHang;
import com.holtel.hotel_management.entity.Phong;
import com.holtel.hotel_management.repository.KhachHangRepository;
import com.holtel.hotel_management.repository.PhongRepository;
import com.holtel.hotel_management.service.DatPhongService;
import com.holtel.hotel_management.service.PhongService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/datphong")
@CrossOrigin(origins = "*")
public class DatPhongController {

    @Autowired
    private DatPhongService datPhongService;
    
    @Autowired
    private PhongRepository phongRepository;
    
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private PhongService phongService;

    // Lấy tất cả đặt phòng (chỉ thông tin cơ bản - DTO)
    @GetMapping
    public ResponseEntity<List<DatPhongDTO>> getAllDatPhong() {
        List<DatPhongDTO> datPhongList = datPhongService.getAllDatPhongDTO();
        return ResponseEntity.ok(datPhongList);
    }

    // Lấy tất cả đặt phòng với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/detail")
    public ResponseEntity<List<DatPhongDTO>> getAllDatPhongDetail() {
        List<DatPhongDTO> datPhongList = datPhongService.getAllDatPhongDTO();
        return ResponseEntity.ok(datPhongList);
    }

    // Lấy đặt phòng theo ID (chỉ thông tin cơ bản - DTO)
    @GetMapping("/{id}")
    public ResponseEntity<DatPhongDTO> getDatPhongById(@PathVariable Integer id) {
        DatPhongDTO datPhong = datPhongService.getDatPhongDTOById(id);
        if (datPhong != null) {
            return ResponseEntity.ok(datPhong);
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy đặt phòng theo ID với thông tin chi tiết (chuẩn hóa sang DTO)
    @GetMapping("/{id}/detail")
    public ResponseEntity<DatPhongDTO> getDatPhongDetailById(@PathVariable Integer id) {
        DatPhongDTO datPhong = datPhongService.getDatPhongDTOById(id);
        if (datPhong != null) {
            return ResponseEntity.ok(datPhong);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo đặt phòng mới (nhận DTO, trả về DTO)
    @PostMapping
    public ResponseEntity<DatPhongDTO> createDatPhong(@RequestBody DatPhongDTO datPhongDTO) {
        try {
            // Kiểm tra các trường bắt buộc
            if (datPhongDTO.getIdPhong() == null || datPhongDTO.getIdKh() == null) {
                return ResponseEntity.badRequest().build();
            }
            
            // Tìm phòng và khách hàng
            Optional<Phong> phong = phongRepository.findById(datPhongDTO.getIdPhong());
            Optional<KhachHang> khachHang = khachHangRepository.findById(datPhongDTO.getIdKh());
            
            if (!phong.isPresent() || !khachHang.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            
            // Tạo entity và set các trường liên kết
            DatPhong datPhong = DTOConverter.toDatPhong(datPhongDTO);
            datPhong.setPhong(phong.get());
            datPhong.setKhachHang(khachHang.get());
            
            // Set trạng thái mặc định nếu không có
            if (datPhong.getTrangThai() == null) {
                datPhong.setTrangThai("Chờ xử lý");
            }
            
            DatPhong savedDatPhong = datPhongService.saveDatPhong(datPhong);
            
            // Tự động cập nhật trạng thái phòng dựa trên thời gian thực
            phongService.updateRoomStatus(datPhong.getPhong().getIdPhong());
            
            DatPhongDTO savedDTO = DTOConverter.toDatPhongDTO(savedDatPhong);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật đặt phòng (nhận DTO, trả về DTO)
    @PutMapping("/{id}")
    public ResponseEntity<DatPhongDTO> updateDatPhong(@PathVariable Integer id, @RequestBody DatPhongDTO datPhongDTO) {
        try {
            // Tìm đặt phòng hiện tại
            Optional<DatPhong> existingDatPhong = datPhongService.getDatPhongById(id);
            if (!existingDatPhong.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            DatPhong datPhong = existingDatPhong.get();
            
            // Cập nhật các trường cơ bản
            if (datPhongDTO.getNgayDat() != null) {
                datPhong.setNgayDat(datPhongDTO.getNgayDat());
            }
            if (datPhongDTO.getNgayTra() != null) {
                datPhong.setNgayTra(datPhongDTO.getNgayTra());
            }
            if (datPhongDTO.getTrangThai() != null) {
                datPhong.setTrangThai(datPhongDTO.getTrangThai());
            }
            
            // Cập nhật phòng nếu được cung cấp
            if (datPhongDTO.getIdPhong() != null) {
                Optional<Phong> phong = phongRepository.findById(datPhongDTO.getIdPhong());
                if (phong.isPresent()) {
                    datPhong.setPhong(phong.get());
                }
            }
            
            // Cập nhật khách hàng nếu được cung cấp
            if (datPhongDTO.getIdKh() != null) {
                Optional<KhachHang> khachHang = khachHangRepository.findById(datPhongDTO.getIdKh());
                if (khachHang.isPresent()) {
                    datPhong.setKhachHang(khachHang.get());
                }
            }
            
            DatPhong updatedDatPhong = datPhongService.saveDatPhong(datPhong);
            
            // Tự động cập nhật trạng thái phòng dựa trên thời gian thực
            phongService.updateRoomStatus(datPhong.getPhong().getIdPhong());
            
            DatPhongDTO updatedDTO = DTOConverter.toDatPhongDTO(updatedDatPhong);
            return ResponseEntity.ok(updatedDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Xóa đặt phòng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDatPhong(@PathVariable Integer id) {
        boolean deleted = datPhongService.deleteDatPhong(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Các API tìm kiếm, lọc, trả về List<DatPhong> => chuyển sang List<DatPhongDTO>
    @GetMapping("/search/khachhang/{idKh}")
    public ResponseEntity<List<DatPhongDTO>> findByKhachHang_IdKh(@PathVariable Integer idKh) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByKhachHang_IdKh(idKh));
        return ResponseEntity.ok(datPhongList);
    }

    @GetMapping("/search/phong/{idPhong}")
    public ResponseEntity<List<DatPhongDTO>> findByPhong_IdPhong(@PathVariable Integer idPhong) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByPhong_IdPhong(idPhong));
        return ResponseEntity.ok(datPhongList);
    }

    @GetMapping("/search/ngaydat")
    public ResponseEntity<List<DatPhongDTO>> findByNgayDat(@RequestParam String ngayDat) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByNgayDat(null)); // TODO: parse date
        return ResponseEntity.ok(datPhongList);
    }

    @GetMapping("/search/ngaytra")
    public ResponseEntity<List<DatPhongDTO>> findByNgayTra(@RequestParam String ngayTra) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByNgayTra(null)); // TODO: parse date
        return ResponseEntity.ok(datPhongList);
    }

    @GetMapping("/search/ngaydat-between")
    public ResponseEntity<List<DatPhongDTO>> findByNgayDatBetween(@RequestParam String startDate, @RequestParam String endDate) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByNgayDatBetween(null, null)); // TODO: parse date
        return ResponseEntity.ok(datPhongList);
    }

    @GetMapping("/search/trangthai")
    public ResponseEntity<List<DatPhongDTO>> findByTrangThai(@RequestParam String trangThai) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByTrangThai(trangThai));
        return ResponseEntity.ok(datPhongList);
    }

    @GetMapping("/current")
    public ResponseEntity<List<DatPhongDTO>> findDatPhongHienTai() {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findDatPhongHienTai());
        return ResponseEntity.ok(datPhongList);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<DatPhongDTO>> findDatPhongTuongLai() {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findDatPhongTuongLai());
        return ResponseEntity.ok(datPhongList);
    }

    @GetMapping("/completed")
    public ResponseEntity<List<DatPhongDTO>> findDatPhongQuaKhu() {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findDatPhongQuaKhu());
        return ResponseEntity.ok(datPhongList);
    }

    // Tìm đặt phòng theo khách hàng và sắp xếp theo ngày đặt
    @GetMapping("/search/khachhang-sort/{idKh}")
    public ResponseEntity<List<DatPhongDTO>> findByKhachHang_IdKhOrderByNgayDatDesc(@PathVariable Integer idKh) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByKhachHang_IdKhOrderByNgayDatDesc(idKh));
        return ResponseEntity.ok(datPhongList);
    }

    // Tìm đặt phòng theo phòng và sắp xếp theo ngày đặt
    @GetMapping("/search/phong-sort/{idPhong}")
    public ResponseEntity<List<DatPhongDTO>> findByPhong_IdPhongOrderByNgayDatDesc(@PathVariable Integer idPhong) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByPhong_IdPhongOrderByNgayDatDesc(idPhong));
        return ResponseEntity.ok(datPhongList);
    }

    // Tìm đặt phòng theo mã công ty
    @GetMapping("/search/congty/{maCty}")
    public ResponseEntity<List<DatPhongDTO>> findByCongTy_MaCty(@PathVariable String maCty) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByCongTy_MaCty(maCty));
        return ResponseEntity.ok(datPhongList);
    }

    // Tìm đặt phòng theo mã công ty và trạng thái
    @GetMapping("/search/congty-trangthai")
    public ResponseEntity<List<DatPhongDTO>> findByCongTy_MaCtyAndTrangThai(@RequestParam String maCty, @RequestParam String trangThai) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByCongTy_MaCtyAndTrangThai(maCty, trangThai));
        return ResponseEntity.ok(datPhongList);
    }

    // Tìm đặt phòng theo đơn vị
    @GetMapping("/search/donvi/{idDvi}")
    public ResponseEntity<List<DatPhongDTO>> findByDonVi_IdDvi(@PathVariable Integer idDvi) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByDonVi_IdDvi(idDvi));
        return ResponseEntity.ok(datPhongList);
    }

    // Tìm đặt phòng theo tầng
    @GetMapping("/search/tang/{idTang}")
    public ResponseEntity<List<DatPhongDTO>> findByTang_IdTang(@PathVariable Integer idTang) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByTang_IdTang(idTang));
        return ResponseEntity.ok(datPhongList);
    }

    // Tìm đặt phòng theo loại phòng
    @GetMapping("/search/loaiphong/{idLoaiPhong}")
    public ResponseEntity<List<DatPhongDTO>> findByLoaiPhong_IdLoaiPhong(@PathVariable Integer idLoaiPhong) {
        List<DatPhongDTO> datPhongList = DTOConverter.toDatPhongDTOList(datPhongService.findByLoaiPhong_IdLoaiPhong(idLoaiPhong));
        return ResponseEntity.ok(datPhongList);
    }

    // Đếm tổng số đặt phòng
    @GetMapping("/count")
    public ResponseEntity<Long> countAllDatPhong() {
        long count = datPhongService.countAllDatPhong();
        return ResponseEntity.ok(count);
    }

    // Đếm đặt phòng theo khách hàng
    @GetMapping("/count/khachhang/{idKh}")
    public ResponseEntity<Long> countByKhachHang_IdKh(@PathVariable Integer idKh) {
        long count = datPhongService.countByKhachHang_IdKh(idKh);
        return ResponseEntity.ok(count);
    }

    // Đếm đặt phòng theo phòng
    @GetMapping("/count/phong/{idPhong}")
    public ResponseEntity<Long> countByPhong_IdPhong(@PathVariable Integer idPhong) {
        long count = datPhongService.countByPhong_IdPhong(idPhong);
        return ResponseEntity.ok(count);
    }
} 