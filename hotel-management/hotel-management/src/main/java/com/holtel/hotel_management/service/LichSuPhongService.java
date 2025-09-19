package com.holtel.hotel_management.service;

import com.holtel.hotel_management.entity.LichSuPhong;
import com.holtel.hotel_management.repository.LichSuPhongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LichSuPhongService {

    @Autowired
    private LichSuPhongRepository lichSuPhongRepository;

    // Lấy tất cả lịch sử phòng
    public List<LichSuPhong> getAllLichSuPhong() {
        return lichSuPhongRepository.findAll();
    }

    // Lấy lịch sử phòng theo ID
    public Optional<LichSuPhong> getLichSuPhongById(Integer id) {
        return lichSuPhongRepository.findById(id);
    }

    // Lưu lịch sử phòng mới
    public LichSuPhong saveLichSuPhong(LichSuPhong lichSuPhong) {
        return lichSuPhongRepository.save(lichSuPhong);
    }

    // Cập nhật lịch sử phòng
    public LichSuPhong updateLichSuPhong(Integer id, LichSuPhong lichSuPhongDetails) {
        Optional<LichSuPhong> existingLichSuPhong = lichSuPhongRepository.findById(id);
        if (existingLichSuPhong.isPresent()) {
            LichSuPhong lichSuPhong = existingLichSuPhong.get();
            lichSuPhong.setThoiGian(lichSuPhongDetails.getThoiGian());
            lichSuPhong.setTrangThai(lichSuPhongDetails.getTrangThai());
            lichSuPhong.setPhong(lichSuPhongDetails.getPhong());
            return lichSuPhongRepository.save(lichSuPhong);
        }
        return null;
    }

    // Xóa lịch sử phòng
    public boolean deleteLichSuPhong(Integer id) {
        if (lichSuPhongRepository.existsById(id)) {
            lichSuPhongRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm lịch sử phòng theo phòng
    public List<LichSuPhong> findByPhong_IdPhong(Integer idPhong) {
        return lichSuPhongRepository.findByPhong_IdPhong(idPhong);
    }

    // Tìm lịch sử phòng theo trạng thái
    public List<LichSuPhong> findByTrangThai(String trangThai) {
        return lichSuPhongRepository.findByTrangThai(trangThai);
    }

    // Tìm lịch sử phòng theo thời gian
    public List<LichSuPhong> findByThoiGian(LocalDateTime thoiGian) {
        return lichSuPhongRepository.findByThoiGian(thoiGian);
    }

    // Tìm lịch sử phòng theo khoảng thời gian
    public List<LichSuPhong> findByThoiGianBetween(LocalDateTime startTime, LocalDateTime endTime) {
        return lichSuPhongRepository.findByThoiGianBetween(startTime, endTime);
    }

    // Tìm lịch sử phòng theo phòng và trạng thái
    public List<LichSuPhong> findByPhong_IdPhongAndTrangThai(Integer idPhong, String trangThai) {
        return lichSuPhongRepository.findByPhong_IdPhongAndTrangThai(idPhong, trangThai);
    }

    // Tìm lịch sử phòng theo phòng và thời gian
    public List<LichSuPhong> findByPhong_IdPhongAndThoiGianBetween(Integer idPhong, LocalDateTime startTime, LocalDateTime endTime) {
        return lichSuPhongRepository.findByPhong_IdPhongAndThoiGianBetween(idPhong, startTime, endTime);
    }

    // Tìm lịch sử phòng theo trạng thái và thời gian
    public List<LichSuPhong> findByTrangThaiAndThoiGianBetween(String trangThai, LocalDateTime startTime, LocalDateTime endTime) {
        return lichSuPhongRepository.findByTrangThaiAndThoiGianBetween(trangThai, startTime, endTime);
    }

    // Đếm tổng số lịch sử phòng
    public long countAllLichSuPhong() {
        return lichSuPhongRepository.count();
    }

    // Đếm lịch sử phòng theo phòng
    public long countByPhong_IdPhong(Integer idPhong) {
        return lichSuPhongRepository.countByPhong_IdPhong(idPhong);
    }

    // Đếm lịch sử phòng theo trạng thái
    public long countByTrangThai(String trangThai) {
        return lichSuPhongRepository.countByTrangThai(trangThai);
    }

    // Đếm lịch sử phòng theo thời gian
    public long countByThoiGian(LocalDateTime thoiGian) {
        return lichSuPhongRepository.countByThoiGian(thoiGian);
    }

    // Tìm lịch sử phòng theo phòng và sắp xếp theo thời gian
    public List<LichSuPhong> findByPhong_IdPhongOrderByThoiGianDesc(Integer idPhong) {
        return lichSuPhongRepository.findByPhong_IdPhongOrderByThoiGianDesc(idPhong);
    }

    // Tìm lịch sử phòng theo trạng thái và sắp xếp theo thời gian
    public List<LichSuPhong> findByTrangThaiOrderByThoiGianDesc(String trangThai) {
        return lichSuPhongRepository.findByTrangThaiOrderByThoiGianDesc(trangThai);
    }

    // Tìm lịch sử mới nhất của phòng
    public List<LichSuPhong> findLichSuMoiNhatByPhong(Integer idPhong) {
        return lichSuPhongRepository.findLichSuMoiNhatByPhong(idPhong);
    }

    // Tìm lịch sử cũ nhất của phòng
    public List<LichSuPhong> findLichSuCuNhatByPhong(Integer idPhong) {
        return lichSuPhongRepository.findLichSuCuNhatByPhong(idPhong);
    }

    // Tìm lịch sử theo mã công ty
    public List<LichSuPhong> findByCongTy_MaCty(String maCty) {
        return lichSuPhongRepository.findByCongTy_MaCty(maCty);
    }

    // Tìm lịch sử theo mã công ty và trạng thái
    public List<LichSuPhong> findByCongTy_MaCtyAndTrangThai(String maCty, String trangThai) {
        return lichSuPhongRepository.findByCongTy_MaCtyAndTrangThai(maCty, trangThai);
    }

    // Tìm lịch sử theo đơn vị
    public List<LichSuPhong> findByDonVi_IdDvi(Integer idDvi) {
        return lichSuPhongRepository.findByDonVi_IdDvi(idDvi);
    }

    // Tìm lịch sử theo tầng
    public List<LichSuPhong> findByTang_IdTang(Integer idTang) {
        return lichSuPhongRepository.findByTang_IdTang(idTang);
    }

    // Tìm lịch sử theo loại phòng
    public List<LichSuPhong> findByLoaiPhong_IdLoaiPhong(Integer idLoaiPhong) {
        return lichSuPhongRepository.findByLoaiPhong_IdLoaiPhong(idLoaiPhong);
    }

    // Tìm lịch sử theo ngày
    public List<LichSuPhong> findByNgay(String date) {
        return lichSuPhongRepository.findByNgay(date);
    }

    // Tìm lịch sử theo tháng năm
    public List<LichSuPhong> findByThangNam(Integer year, Integer month) {
        return lichSuPhongRepository.findByThangNam(year, month);
    }

    // Tìm lịch sử hôm nay
    public List<LichSuPhong> findTodayHistory() {
        LocalDateTime today = LocalDateTime.now();
        return lichSuPhongRepository.findByThoiGian(today);
    }

    // Tìm lịch sử trong tuần này
    public List<LichSuPhong> findThisWeekHistory() {
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(LocalDateTime.now().getDayOfWeek().getValue() - 1);
        LocalDateTime endOfWeek = startOfWeek.plusDays(6);
        return lichSuPhongRepository.findByThoiGianBetween(startOfWeek, endOfWeek);
    }

    // Tìm lịch sử trong tháng này
    public List<LichSuPhong> findThisMonthHistory() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1);
        LocalDateTime endOfMonth = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth());
        return lichSuPhongRepository.findByThoiGianBetween(startOfMonth, endOfMonth);
    }

    // Tìm lịch sử sắp tới (từ bây giờ)
    public List<LichSuPhong> findUpcomingHistory() {
        // Sử dụng findByThoiGianBetween với thời gian hiện tại đến tương lai
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusYears(10); // Giả sử 10 năm tới
        return lichSuPhongRepository.findByThoiGianBetween(now, future);
    }

    // Tìm lịch sử đã qua (trước bây giờ)
    public List<LichSuPhong> findPastHistory() {
        // Sử dụng findByThoiGianBetween với thời gian quá khứ đến hiện tại
        LocalDateTime past = LocalDateTime.now().minusYears(10); // Giả sử 10 năm trước
        LocalDateTime now = LocalDateTime.now();
        return lichSuPhongRepository.findByThoiGianBetween(past, now);
    }
} 