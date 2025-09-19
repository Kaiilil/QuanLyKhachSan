package com.holtel.hotel_management.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
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

import com.holtel.hotel_management.dto.ThanhToanDTO;
import com.holtel.hotel_management.entity.DatPhong;
import com.holtel.hotel_management.entity.ThanhToan;
import com.holtel.hotel_management.repository.DatPhongRepository;
import com.holtel.hotel_management.service.ThanhToanService;
import com.holtel.hotel_management.util.DTOConverter;

@RestController
@RequestMapping("/api/thanhtoan")
@CrossOrigin(origins = "*")
public class ThanhToanController {

    @Autowired
    private ThanhToanService thanhToanService;
    
    @Autowired
    private DatPhongRepository datPhongRepository;

    // Lấy tất cả thanh toán
    @GetMapping
    public ResponseEntity<List<ThanhToanDTO>> getAllThanhToan() {
        List<ThanhToan> thanhToanList = thanhToanService.getAllThanhToan();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Lấy thanh toán theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ThanhToanDTO> getThanhToanById(@PathVariable Integer id) {
        Optional<ThanhToan> thanhToan = thanhToanService.getThanhToanById(id);
        if (thanhToan.isPresent()) {
            ThanhToanDTO thanhToanDTO = DTOConverter.toThanhToanDTO(thanhToan.get());
            return ResponseEntity.ok(thanhToanDTO);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo thanh toán mới (chỉ cho phép hình thức payment)
    @PostMapping
    public ResponseEntity<ThanhToanDTO> createThanhToan(@RequestBody ThanhToanDTO thanhToanDTO) {
        try {
            // Kiểm tra các trường bắt buộc
            if (thanhToanDTO.getSoTien() == null || thanhToanDTO.getSoTien().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().build();
            }
            
            // Kiểm tra hình thức thanh toán
            if (thanhToanDTO.getHinhThucTt() != null && 
                !thanhToanDTO.getHinhThucTt().equalsIgnoreCase("payment")) {
                return ResponseEntity.badRequest().build();
            }
            
            // Tìm đặt phòng nếu có
            if (thanhToanDTO.getIdDatPhong() != null) {
                Optional<DatPhong> datPhong = datPhongRepository.findById(thanhToanDTO.getIdDatPhong());
                if (!datPhong.isPresent()) {
                    return ResponseEntity.badRequest().build();
                }
            }
            
            // Tạo entity và set các trường
            ThanhToan thanhToan = DTOConverter.toThanhToan(thanhToanDTO);
            
            // Set hình thức thanh toán mặc định
            thanhToan.setHinhThucTt("payment");
            
            // Set ngày thanh toán mặc định nếu không có
            if (thanhToan.getNgayTt() == null) {
                thanhToan.setNgayTt(LocalDate.now());
            }
            
            // Set trạng thái mặc định nếu không có
            if (thanhToan.getTrangThai() == null) {
                thanhToan.setTrangThai("Đang xử lý");
            }
            
            // Set đặt phòng nếu có
            if (thanhToanDTO.getIdDatPhong() != null) {
                Optional<DatPhong> datPhong = datPhongRepository.findById(thanhToanDTO.getIdDatPhong());
                if (datPhong.isPresent()) {
                    thanhToan.setDatPhong(datPhong.get());
                }
            }
            
            ThanhToan savedThanhToan = thanhToanService.saveThanhToan(thanhToan);
            ThanhToanDTO savedThanhToanDTO = DTOConverter.toThanhToanDTO(savedThanhToan);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedThanhToanDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật thanh toán (chỉ cho phép hình thức payment)
    @PutMapping("/{id}")
    public ResponseEntity<ThanhToanDTO> updateThanhToan(@PathVariable Integer id, @RequestBody ThanhToanDTO thanhToanDTO) {
        try {
            // Kiểm tra hình thức thanh toán nếu được cung cấp
            if (thanhToanDTO.getHinhThucTt() != null && 
                !thanhToanDTO.getHinhThucTt().equalsIgnoreCase("payment")) {
                return ResponseEntity.badRequest().build();
            }
            
            // Kiểm tra số tiền nếu được cung cấp
            if (thanhToanDTO.getSoTien() != null && thanhToanDTO.getSoTien().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().build();
            }
            
            // Tìm thanh toán hiện tại
            Optional<ThanhToan> existingThanhToan = thanhToanService.getThanhToanById(id);
            if (!existingThanhToan.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            ThanhToan thanhToan = existingThanhToan.get();
            
            // Cập nhật các trường cơ bản
            if (thanhToanDTO.getNgayTt() != null) {
                thanhToan.setNgayTt(thanhToanDTO.getNgayTt());
            }
            if (thanhToanDTO.getNgayDat() != null) {
                thanhToan.setNgayDat(thanhToanDTO.getNgayDat());
            }
            if (thanhToanDTO.getNgayTra() != null) {
                thanhToan.setNgayTra(thanhToanDTO.getNgayTra());
            }
            if (thanhToanDTO.getSoTien() != null) {
                thanhToan.setSoTien(thanhToanDTO.getSoTien());
            }
            if (thanhToanDTO.getTrangThai() != null) {
                thanhToan.setTrangThai(thanhToanDTO.getTrangThai());
            }
            
            // Đảm bảo hình thức thanh toán là payment
            thanhToan.setHinhThucTt("payment");
            
            // Cập nhật đặt phòng nếu được cung cấp
            if (thanhToanDTO.getIdDatPhong() != null) {
                Optional<DatPhong> datPhong = datPhongRepository.findById(thanhToanDTO.getIdDatPhong());
                if (datPhong.isPresent()) {
                    thanhToan.setDatPhong(datPhong.get());
                }
            }
            
            ThanhToan savedThanhToan = thanhToanService.saveThanhToan(thanhToan);
            ThanhToanDTO savedThanhToanDTO = DTOConverter.toThanhToanDTO(savedThanhToan);
            return ResponseEntity.ok(savedThanhToanDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Xóa thanh toán
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThanhToan(@PathVariable Integer id) {
        boolean deleted = thanhToanService.deleteThanhToan(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Tìm thanh toán theo đặt phòng
    @GetMapping("/datphong/{idDatPhong}")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanByDatPhong(@PathVariable Integer idDatPhong) {
        List<ThanhToan> thanhToanList = thanhToanService.findByDatPhong_IdDatPhong(idDatPhong);
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán theo ngày thanh toán
    @GetMapping("/ngay/{ngayTt}")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanByNgayTt(@PathVariable String ngayTt) {
        LocalDate ngay = LocalDate.parse(ngayTt);
        List<ThanhToan> thanhToanList = thanhToanService.findByNgayTt(ngay);
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán theo hình thức thanh toán (chỉ payment)
    @GetMapping("/hinhthuc/payment")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanByPayment() {
        List<ThanhToan> thanhToanList = thanhToanService.findByHinhThucTt("payment");
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán theo trạng thái
    @GetMapping("/trangthai/{trangThai}")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanByTrangThai(@PathVariable String trangThai) {
        List<ThanhToan> thanhToanList = thanhToanService.findByTrangThai(trangThai);
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán theo khoảng số tiền
    @GetMapping("/sotien")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanBySoTienRange(
            @RequestParam BigDecimal minTien,
            @RequestParam BigDecimal maxTien) {
        List<ThanhToan> thanhToanList = thanhToanService.findBySoTienBetween(minTien, maxTien);
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán theo khoảng thời gian
    @GetMapping("/thoigian")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanByTimeRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<ThanhToan> thanhToanList = thanhToanService.findByNgayTtBetween(start, end);
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán đã hoàn thành
    @GetMapping("/hoanthanh")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanCompleted() {
        List<ThanhToan> thanhToanList = thanhToanService.findCompletedPayments();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán đang xử lý
    @GetMapping("/dangxuly")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanPending() {
        List<ThanhToan> thanhToanList = thanhToanService.findPendingPayments();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán bị hủy
    @GetMapping("/dahuy")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanCancelled() {
        List<ThanhToan> thanhToanList = thanhToanService.findCancelledPayments();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán hôm nay
    @GetMapping("/homnay")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanToday() {
        List<ThanhToan> thanhToanList = thanhToanService.findTodayPayments();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Tìm thanh toán trong tháng này
    @GetMapping("/thangnay")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanThisMonth() {
        List<ThanhToan> thanhToanList = thanhToanService.findThisMonthPayments();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Thống kê tổng số tiền thanh toán
    @GetMapping("/tongtien")
    public ResponseEntity<BigDecimal> getTotalAmount() {
        BigDecimal totalAmount = thanhToanService.sumSoTien();
        return ResponseEntity.ok(totalAmount != null ? totalAmount : BigDecimal.ZERO);
    }

    // Thống kê tổng số tiền thanh toán theo trạng thái
    @GetMapping("/tongtien/trangthai/{trangThai}")
    public ResponseEntity<BigDecimal> getTotalAmountByTrangThai(@PathVariable String trangThai) {
        BigDecimal totalAmount = thanhToanService.sumSoTienByTrangThai(trangThai);
        return ResponseEntity.ok(totalAmount != null ? totalAmount : BigDecimal.ZERO);
    }

    // Thống kê tổng số tiền thanh toán theo hình thức (chỉ payment)
    @GetMapping("/tongtien/payment")
    public ResponseEntity<BigDecimal> getTotalAmountByPayment() {
        BigDecimal totalAmount = thanhToanService.sumSoTienByHinhThucTt("payment");
        return ResponseEntity.ok(totalAmount != null ? totalAmount : BigDecimal.ZERO);
    }

    // Thống kê số lượng thanh toán
    @GetMapping("/count")
    public ResponseEntity<Long> getThanhToanCount() {
        long count = thanhToanService.countAllThanhToan();
        return ResponseEntity.ok(count);
    }

    // Thống kê số lượng thanh toán theo hình thức (chỉ payment)
    @GetMapping("/count/payment")
    public ResponseEntity<Long> getPaymentCount() {
        long count = thanhToanService.countByHinhThucTt("payment");
        return ResponseEntity.ok(count);
    }

    // Thống kê số lượng thanh toán theo trạng thái
    @GetMapping("/count/trangthai/{trangThai}")
    public ResponseEntity<Long> getThanhToanCountByTrangThai(@PathVariable String trangThai) {
        long count = thanhToanService.countByTrangThai(trangThai);
        return ResponseEntity.ok(count);
    }

    // Tìm kiếm thanh toán theo từ khóa
    @GetMapping("/search")
    public ResponseEntity<List<ThanhToanDTO>> searchThanhToan(@RequestParam String keyword) {
        List<ThanhToan> thanhToanList = thanhToanService.findByKeyword(keyword);
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Sắp xếp thanh toán theo ngày thanh toán tăng dần
    @GetMapping("/sort/ngay-asc")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanOrderByNgayTtAsc() {
        List<ThanhToan> thanhToanList = thanhToanService.getAllThanhToanOrderByNgayTtAsc();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Sắp xếp thanh toán theo ngày thanh toán giảm dần
    @GetMapping("/sort/ngay-desc")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanOrderByNgayTtDesc() {
        List<ThanhToan> thanhToanList = thanhToanService.getAllThanhToanOrderByNgayTtDesc();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Sắp xếp thanh toán theo số tiền tăng dần
    @GetMapping("/sort/tien-asc")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanOrderBySoTienAsc() {
        List<ThanhToan> thanhToanList = thanhToanService.getAllThanhToanOrderBySoTienAsc();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }

    // Sắp xếp thanh toán theo số tiền giảm dần
    @GetMapping("/sort/tien-desc")
    public ResponseEntity<List<ThanhToanDTO>> getThanhToanOrderBySoTienDesc() {
        List<ThanhToan> thanhToanList = thanhToanService.getAllThanhToanOrderBySoTienDesc();
        List<ThanhToanDTO> thanhToanDTOList = DTOConverter.toThanhToanDTOList(thanhToanList);
        return ResponseEntity.ok(thanhToanDTOList);
    }
}
