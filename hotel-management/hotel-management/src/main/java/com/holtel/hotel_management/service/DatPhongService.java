package com.holtel.hotel_management.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.dto.DatPhongDTO;
import com.holtel.hotel_management.entity.DatPhong;
import com.holtel.hotel_management.repository.DatPhongRepository;
import com.holtel.hotel_management.util.DTOConverter;

@Service
public class DatPhongService {

    @Autowired
    private DatPhongRepository datPhongRepository;

    // Lấy tất cả đặt phòng
    public List<DatPhong> getAllDatPhong() {
        return datPhongRepository.findAll();
    }

    // Lấy tất cả đặt phòng dưới dạng DTO
    public List<DatPhongDTO> getAllDatPhongDTO() {
        return DTOConverter.toDatPhongDTOList(datPhongRepository.findAll());
    }

    // Lấy đặt phòng theo ID
    public Optional<DatPhong> getDatPhongById(Integer id) {
        return datPhongRepository.findById(id);
    }

    // Lấy đặt phòng theo ID dưới dạng DTO
    public DatPhongDTO getDatPhongDTOById(Integer id) {
        Optional<DatPhong> datPhong = datPhongRepository.findById(id);
        return datPhong.map(DTOConverter::toDatPhongDTO).orElse(null);
    }

    // Lưu đặt phòng mới
    public DatPhong saveDatPhong(DatPhong datPhong) {
        return datPhongRepository.save(datPhong);
    }

    // Cập nhật đặt phòng
    public DatPhong updateDatPhong(Integer id, DatPhong datPhongDetails) {
        Optional<DatPhong> existingDatPhong = datPhongRepository.findById(id);
        if (existingDatPhong.isPresent()) {
            DatPhong datPhong = existingDatPhong.get();

            if (datPhongDetails.getNgayDat() != null) {
                datPhong.setNgayDat(datPhongDetails.getNgayDat());
            }
            if (datPhongDetails.getNgayTra() != null) {
                datPhong.setNgayTra(datPhongDetails.getNgayTra());
            }
            if (datPhongDetails.getTrangThai() != null) {
                datPhong.setTrangThai(datPhongDetails.getTrangThai());
            }
            if (datPhongDetails.getKhachHang() != null) {
                datPhong.setKhachHang(datPhongDetails.getKhachHang());
            }
            if (datPhongDetails.getPhong() != null) {
                datPhong.setPhong(datPhongDetails.getPhong());
            }

            return datPhongRepository.save(datPhong);
        }
        return null;
    }

    // Xóa đặt phòng
    public boolean deleteDatPhong(Integer id) {
        if (datPhongRepository.existsById(id)) {
            datPhongRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm đặt phòng theo khách hàng
    public List<DatPhong> findByKhachHang_IdKh(Integer idKh) {
        return datPhongRepository.findByKhachHang_IdKh(idKh);
    }

    // Tìm đặt phòng theo phòng
    public List<DatPhong> findByPhong_IdPhong(Integer idPhong) {
        return datPhongRepository.findByPhong_IdPhong(idPhong);
    }

    // Tìm đặt phòng theo ngày đặt
    public List<DatPhong> findByNgayDat(LocalDate ngayDat) {
        return datPhongRepository.findByNgayDat(ngayDat);
    }

    // Tìm đặt phòng theo ngày trả
    public List<DatPhong> findByNgayTra(LocalDate ngayTra) {
        return datPhongRepository.findByNgayTra(ngayTra);
    }

    // Tìm đặt phòng theo khoảng ngày đặt
    public List<DatPhong> findByNgayDatBetween(LocalDate startDate, LocalDate endDate) {
        return datPhongRepository.findByNgayDatBetween(startDate, endDate);
    }

    // Tìm đặt phòng theo trạng thái
    public List<DatPhong> findByTrangThai(String trangThai) {
        return datPhongRepository.findByTrangThai(trangThai);
    }

    // Đếm tổng số đặt phòng
    public long countAllDatPhong() {
        return datPhongRepository.count();
    }

    // Đếm đặt phòng theo khách hàng
    public long countByKhachHang_IdKh(Integer idKh) {
        return datPhongRepository.countByKhachHang_IdKh(idKh);
    }

    // Đếm đặt phòng theo phòng
    public long countByPhong_IdPhong(Integer idPhong) {
        return datPhongRepository.countByPhong_IdPhong(idPhong);
    }

    // Tìm đặt phòng theo khách hàng và sắp xếp theo ngày đặt
    public List<DatPhong> findByKhachHang_IdKhOrderByNgayDatDesc(Integer idKh) {
        return datPhongRepository.findByKhachHang_IdKhOrderByNgayDatDesc(idKh);
    }

    // Tìm đặt phòng theo phòng và sắp xếp theo ngày đặt
    public List<DatPhong> findByPhong_IdPhongOrderByNgayDatDesc(Integer idPhong) {
        return datPhongRepository.findByPhong_IdPhongOrderByNgayDatDesc(idPhong);
    }

    // Tìm đặt phòng hiện tại (đang diễn ra)
    public List<DatPhong> findDatPhongHienTai() {
        return datPhongRepository.findDatPhongHienTai(LocalDate.now());
    }

    // Tìm đặt phòng trong tương lai
    public List<DatPhong> findDatPhongTuongLai() {
        return datPhongRepository.findDatPhongTuongLai(LocalDate.now());
    }

    // Tìm đặt phòng trong quá khứ
    public List<DatPhong> findDatPhongQuaKhu() {
        return datPhongRepository.findDatPhongQuaKhu(LocalDate.now());
    }

    // Tìm đặt phòng theo mã công ty
    public List<DatPhong> findByCongTy_MaCty(String maCty) {
        return datPhongRepository.findByCongTy_MaCty(maCty);
    }

    // Tìm đặt phòng theo mã công ty và trạng thái
    public List<DatPhong> findByCongTy_MaCtyAndTrangThai(String maCty, String trangThai) {
        return datPhongRepository.findByCongTy_MaCtyAndTrangThai(maCty, trangThai);
    }

    // Tìm đặt phòng theo đơn vị
    public List<DatPhong> findByDonVi_IdDvi(Integer idDvi) {
        return datPhongRepository.findByDonVi_IdDvi(idDvi);
    }

    // Tìm đặt phòng theo tầng
    public List<DatPhong> findByTang_IdTang(Integer idTang) {
        return datPhongRepository.findByTang_IdTang(idTang);
    }

    // Tìm đặt phòng theo loại phòng
    public List<DatPhong> findByLoaiPhong_IdLoaiPhong(Integer idLoaiPhong) {
        return datPhongRepository.findByLoaiPhong_IdLoaiPhong(idLoaiPhong);
    }
} 