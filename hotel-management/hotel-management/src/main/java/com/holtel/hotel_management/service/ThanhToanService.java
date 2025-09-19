package com.holtel.hotel_management.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.entity.ThanhToan;
import com.holtel.hotel_management.repository.ThanhToanRepository;

@Service
public class ThanhToanService {

    @Autowired
    private ThanhToanRepository thanhToanRepository;

    // Lấy tất cả thanh toán
    public List<ThanhToan> getAllThanhToan() {
        return thanhToanRepository.findAll();
    }

    // Lấy thanh toán theo ID
    public Optional<ThanhToan> getThanhToanById(Integer id) {
        return thanhToanRepository.findById(id);
    }

    // Lưu thanh toán mới
    public ThanhToan saveThanhToan(ThanhToan thanhToan) {
        return thanhToanRepository.save(thanhToan);
    }

    // Cập nhật thanh toán
    public ThanhToan updateThanhToan(Integer id, ThanhToan thanhToanDetails) {
        Optional<ThanhToan> existingThanhToan = thanhToanRepository.findById(id);
        if (existingThanhToan.isPresent()) {
            ThanhToan thanhToan = existingThanhToan.get();
            thanhToan.setNgayTt(thanhToanDetails.getNgayTt());
            thanhToan.setNgayDat(thanhToanDetails.getNgayDat());
            thanhToan.setNgayTra(thanhToanDetails.getNgayTra());
            thanhToan.setSoTien(thanhToanDetails.getSoTien());
            thanhToan.setHinhThucTt(thanhToanDetails.getHinhThucTt());
            thanhToan.setTrangThai(thanhToanDetails.getTrangThai());
            thanhToan.setDatPhong(thanhToanDetails.getDatPhong());
            return thanhToanRepository.save(thanhToan);
        }
        return null;
    }

    // Xóa thanh toán
    public boolean deleteThanhToan(Integer id) {
        if (thanhToanRepository.existsById(id)) {
            thanhToanRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm thanh toán theo đặt phòng
    public List<ThanhToan> findByDatPhong_IdDatPhong(Integer idDatPhong) {
        return thanhToanRepository.findByDatPhong_IdDatPhong(idDatPhong);
    }

    // Tìm thanh toán theo ngày thanh toán
    public List<ThanhToan> findByNgayTt(LocalDate ngayTt) {
        return thanhToanRepository.findByNgayTt(ngayTt);
    }

    // Tìm thanh toán theo ngày đặt
    public List<ThanhToan> findByNgayDat(LocalDate ngayDat) {
        return thanhToanRepository.findByNgayDat(ngayDat);
    }

    // Tìm thanh toán theo ngày trả
    public List<ThanhToan> findByNgayTra(LocalDate ngayTra) {
        return thanhToanRepository.findByNgayTra(ngayTra);
    }

    // Tìm thanh toán theo khoảng ngày thanh toán
    public List<ThanhToan> findByNgayTtBetween(LocalDate startDate, LocalDate endDate) {
        return thanhToanRepository.findByNgayTtBetween(startDate, endDate);
    }

    // Tìm thanh toán theo số tiền
    public List<ThanhToan> findBySoTien(BigDecimal soTien) {
        return thanhToanRepository.findBySoTien(soTien);
    }

    // Tìm thanh toán theo khoảng số tiền
    public List<ThanhToan> findBySoTienBetween(BigDecimal minTien, BigDecimal maxTien) {
        return thanhToanRepository.findBySoTienBetween(minTien, maxTien);
    }

    // Tìm thanh toán theo hình thức thanh toán
    public List<ThanhToan> findByHinhThucTt(String hinhThucTt) {
        return thanhToanRepository.findByHinhThucTt(hinhThucTt);
    }

    // Tìm thanh toán theo trạng thái
    public List<ThanhToan> findByTrangThai(String trangThai) {
        return thanhToanRepository.findByTrangThai(trangThai);
    }

    // Tìm thanh toán theo từ khóa
    public List<ThanhToan> findByKeyword(String keyword) {
        return thanhToanRepository.findByKeyword(keyword);
    }

    // Đếm tổng số thanh toán
    public long countAllThanhToan() {
        return thanhToanRepository.count();
    }

    // Đếm thanh toán theo đặt phòng
    public long countByDatPhong_IdDatPhong(Integer idDatPhong) {
        return thanhToanRepository.countByDatPhong_IdDatPhong(idDatPhong);
    }

    // Đếm thanh toán theo hình thức thanh toán
    public long countByHinhThucTt(String hinhThucTt) {
        return thanhToanRepository.countByHinhThucTt(hinhThucTt);
    }

    // Đếm thanh toán theo trạng thái
    public long countByTrangThai(String trangThai) {
        return thanhToanRepository.countByTrangThai(trangThai);
    }

    // Lấy danh sách thanh toán theo thứ tự ngày thanh toán tăng dần
    public List<ThanhToan> getAllThanhToanOrderByNgayTtAsc() {
        return thanhToanRepository.findAllByOrderByNgayTtAsc();
    }

    // Lấy danh sách thanh toán theo thứ tự ngày thanh toán giảm dần
    public List<ThanhToan> getAllThanhToanOrderByNgayTtDesc() {
        return thanhToanRepository.findAllByOrderByNgayTtDesc();
    }

    // Lấy danh sách thanh toán theo thứ tự số tiền tăng dần
    public List<ThanhToan> getAllThanhToanOrderBySoTienAsc() {
        return thanhToanRepository.findAllByOrderBySoTienAsc();
    }

    // Lấy danh sách thanh toán theo thứ tự số tiền giảm dần
    public List<ThanhToan> getAllThanhToanOrderBySoTienDesc() {
        return thanhToanRepository.findAllByOrderBySoTienDesc();
    }

    // Tìm thanh toán theo đặt phòng và sắp xếp theo ngày thanh toán
    public List<ThanhToan> findByDatPhong_IdDatPhongOrderByNgayTtDesc(Integer idDatPhong) {
        return thanhToanRepository.findByDatPhong_IdDatPhongOrderByNgayTtDesc(idDatPhong);
    }

    // Tìm thanh toán theo hình thức thanh toán và sắp xếp theo ngày thanh toán
    public List<ThanhToan> findByHinhThucTtOrderByNgayTtDesc(String hinhThucTt) {
        return thanhToanRepository.findByHinhThucTtOrderByNgayTtDesc(hinhThucTt);
    }

    // Tìm thanh toán theo trạng thái và sắp xếp theo ngày thanh toán
    public List<ThanhToan> findByTrangThaiOrderByNgayTtDesc(String trangThai) {
        return thanhToanRepository.findByTrangThaiOrderByNgayTtDesc(trangThai);
    }

    // Tìm thanh toán đã hoàn thành
    public List<ThanhToan> findCompletedPayments() {
        return thanhToanRepository.findByTrangThai("Hoàn thành");
    }

    // Tìm thanh toán đang xử lý
    public List<ThanhToan> findPendingPayments() {
        return thanhToanRepository.findByTrangThai("Đang xử lý");
    }

    // Tìm thanh toán bị hủy
    public List<ThanhToan> findCancelledPayments() {
        return thanhToanRepository.findByTrangThai("Đã hủy");
    }

    // Tìm thanh toán tiền mặt
    public List<ThanhToan> findCashPayments() {
        return thanhToanRepository.findByHinhThucTt("Tiền mặt");
    }

    // Tìm thanh toán chuyển khoản
    public List<ThanhToan> findBankTransferPayments() {
        return thanhToanRepository.findByHinhThucTt("Chuyển khoản");
    }

    // Tìm thanh toán thẻ tín dụng
    public List<ThanhToan> findCreditCardPayments() {
        return thanhToanRepository.findByHinhThucTt("Thẻ tín dụng");
    }

    // Tính tổng số tiền thanh toán
    public BigDecimal sumSoTien() {
        return thanhToanRepository.sumSoTien();
    }

    // Tính tổng số tiền thanh toán theo trạng thái
    public BigDecimal sumSoTienByTrangThai(String trangThai) {
        return thanhToanRepository.sumSoTienByTrangThai(trangThai);
    }

    // Tính tổng số tiền thanh toán theo hình thức
    public BigDecimal sumSoTienByHinhThucTt(String hinhThucTt) {
        return thanhToanRepository.sumSoTienByHinhThucTt(hinhThucTt);
    }

    // Tìm số tiền thanh toán cao nhất
    public BigDecimal findMaxSoTien() {
        return thanhToanRepository.findMaxSoTien();
    }

    // Tìm số tiền thanh toán thấp nhất
    public BigDecimal findMinSoTien() {
        return thanhToanRepository.findMinSoTien();
    }

    // Tính số tiền thanh toán trung bình
    public BigDecimal findAverageSoTien() {
        return thanhToanRepository.findAverageSoTien();
    }

    // Tìm thanh toán hôm nay
    public List<ThanhToan> findTodayPayments() {
        return thanhToanRepository.findByNgayTt(LocalDate.now());
    }

    // Tìm thanh toán trong tháng này
    public List<ThanhToan> findThisMonthPayments() {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        return thanhToanRepository.findByNgayTtBetween(startOfMonth, endOfMonth);
    }
} 