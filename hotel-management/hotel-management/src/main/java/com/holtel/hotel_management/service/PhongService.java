package com.holtel.hotel_management.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.dto.PhongDTO;
import com.holtel.hotel_management.dto.PhongDetailDTO;
import com.holtel.hotel_management.entity.Phong;
import com.holtel.hotel_management.repository.DonViRepository;
import com.holtel.hotel_management.repository.LoaiPhongRepository;
import com.holtel.hotel_management.repository.PhongRepository;
import com.holtel.hotel_management.repository.TangRepository;
import com.holtel.hotel_management.util.DTOConverter;

@Service
public class PhongService {

    @Autowired
    private PhongRepository phongRepository;
    @Autowired
    private TangRepository tangRepository;
    @Autowired
    private LoaiPhongRepository loaiPhongRepository;
    @Autowired
    private DonViRepository donViRepository;

    // Lấy tất cả phòng
    public List<Phong> getAllPhong() {
        return phongRepository.findAll();
    }

    // Lấy tất cả phòng dưới dạng DTO
    public List<PhongDTO> getAllPhongDTO() {
        return DTOConverter.toPhongDTOList(phongRepository.findAll());
    }

    // Lấy phòng theo ID
    public Optional<Phong> getPhongById(Integer id) {
        return phongRepository.findById(id);
    }

    // Lấy phòng theo ID dưới dạng DTO
    public PhongDTO getPhongDTOById(Integer id) {
        Optional<Phong> phong = phongRepository.findById(id);
        return phong.map(DTOConverter::toPhongDTO).orElse(null);
    }
    
    // Lấy phòng theo ID với thông tin chi tiết
    public PhongDetailDTO getPhongDetailById(Integer id) {
        Optional<Phong> phong = phongRepository.findById(id);
        return phong.map(DTOConverter::toPhongDetailDTO).orElse(null);
    }
    
    // Lấy tất cả phòng với thông tin chi tiết
    public List<PhongDetailDTO> getAllPhongDetail() {
        List<Phong> phongList = phongRepository.findAll();
        return DTOConverter.toPhongDetailDTOList(phongList);
    }

    // Lưu phòng mới từ DTO (set đúng các trường liên kết)
    public Phong savePhong(PhongDTO phongDTO) {
        Phong phong = DTOConverter.toPhong(phongDTO);
        // Set Tang
        if (phongDTO.getIdTang() != null) {
            tangRepository.findById(phongDTO.getIdTang()).ifPresent(phong::setTang);
        }
        // Set LoaiPhong
        if (phongDTO.getIdLoaiPhong() != null) {
            loaiPhongRepository.findById(phongDTO.getIdLoaiPhong()).ifPresent(phong::setLoaiPhong);
        }
        // Set DonVi
        if (phongDTO.getIdDvi() != null) {
            donViRepository.findById(phongDTO.getIdDvi()).ifPresent(phong::setDonVi);
        }
        return phongRepository.save(phong);
    }
    // Lưu phòng entity trực tiếp (giữ lại hàm cũ cho các chỗ update ảnh)
    public Phong savePhong(Phong phong) {
        return phongRepository.save(phong);
    }

    // Cập nhật phòng
    public Phong updatePhong(Integer id, PhongDTO phongDTO) {
        Optional<Phong> existingPhong = phongRepository.findById(id);
        if (existingPhong.isPresent()) {
            Phong phong = existingPhong.get();
            
            // Chỉ cập nhật các trường không null để tránh mất thông tin
            if (phongDTO.getTenPhong() != null) {
                phong.setTenPhong(phongDTO.getTenPhong());
            }
            if (phongDTO.getTrangThai() != null) {
                phong.setTrangThai(phongDTO.getTrangThai());
            }
            if (phongDTO.getAnhPhong() != null) {
                phong.setAnhPhong(phongDTO.getAnhPhong());
            }

            // Cập nhật liên kết Tang - chỉ khi có giá trị mới
            if (phongDTO.getIdTang() != null) {
                tangRepository.findById(phongDTO.getIdTang()).ifPresent(phong::setTang);
            }
            // Cập nhật liên kết LoaiPhong - chỉ khi có giá trị mới
            if (phongDTO.getIdLoaiPhong() != null) {
                loaiPhongRepository.findById(phongDTO.getIdLoaiPhong()).ifPresent(phong::setLoaiPhong);
            }
            // Cập nhật liên kết DonVi - chỉ khi có giá trị mới
            if (phongDTO.getIdDvi() != null) {
                donViRepository.findById(phongDTO.getIdDvi()).ifPresent(phong::setDonVi);
            }
            return phongRepository.save(phong);
        }
        return null;
    }

    // Xóa phòng
    public boolean deletePhong(Integer id) {
        if (phongRepository.existsById(id)) {
            phongRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Tìm phòng theo tên phòng
    public Optional<Phong> findByTenPhong(String tenPhong) {
        return phongRepository.findByTenPhong(tenPhong);
    }

    // Tìm phòng theo trạng thái
    public List<Phong> findByTrangThai(String trangThai) {
        return phongRepository.findByTrangThai(trangThai);
    }

    // Tìm phòng theo loại phòng
    public List<Phong> findByLoaiPhong_IdLoaiPhong(Integer idLoaiPhong) {
        return phongRepository.findByLoaiPhong_IdLoaiPhong(idLoaiPhong);
    }

    // Tìm phòng theo tầng
    public List<Phong> findByTang_IdTang(Integer idTang) {
        return phongRepository.findByTang_IdTang(idTang);
    }

    // Tìm phòng theo từ khóa
    public List<Phong> findByKeyword(String keyword) {
        return phongRepository.findByTenPhongContaining(keyword);
    }

    // Đếm tổng số phòng
    public long countAllPhong() {
        return phongRepository.count();
    }

    // Đếm phòng theo trạng thái
    public long countByTrangThai(String trangThai) {
        return phongRepository.countByTrangThai(trangThai);
    }

    // Đếm phòng theo loại phòng
    public long countByLoaiPhong_IdLoaiPhong(Integer idLoaiPhong) {
        return phongRepository.countByLoaiPhong_IdLoaiPhong(idLoaiPhong);
    }

    // Đếm phòng theo tầng
    public long countByTang_IdTang(Integer idTang) {
        return phongRepository.countByTang_IdTang(idTang);
    }

    // Tìm phòng trống
    public List<Phong> findAvailableRooms() {
        return phongRepository.findByTrangThai("Trống");
    }

    // Tìm phòng đã đặt
    public List<Phong> findBookedRooms() {
        return phongRepository.findByTrangThai("Đã đặt");
    }

    // Tìm phòng đang sử dụng
    public List<Phong> findOccupiedRooms() {
        return phongRepository.findByTrangThai("Đang sử dụng");
    }

    // Tìm phòng bảo trì
    public List<Phong> findMaintenanceRooms() {
        return phongRepository.findByTrangThai("Bảo trì");
    }

    // Tìm phòng theo loại phòng và trạng thái
    public List<Phong> findByLoaiPhong_IdLoaiPhongAndTrangThai(Integer idLoaiPhong, String trangThai) {
        return phongRepository.findByLoaiPhong_IdLoaiPhongAndTrangThai(idLoaiPhong, trangThai);
    }

    // Tìm phòng theo tầng và trạng thái
    public List<Phong> findByTang_IdTangAndTrangThai(Integer idTang, String trangThai) {
        return phongRepository.findByTang_IdTangAndTrangThai(idTang, trangThai);
    }

    // Tìm phòng theo tầng và sắp xếp theo tên phòng
    public List<Phong> findByTang_IdTangOrderByTenPhong(Integer idTang) {
        return phongRepository.findByTang_IdTangOrderByTenPhong(idTang);
    }

    // Tìm phòng theo loại phòng và sắp xếp theo tên phòng
    public List<Phong> findByLoaiPhong_IdLoaiPhongOrderByTenPhong(Integer idLoaiPhong) {
        return phongRepository.findByLoaiPhong_IdLoaiPhongOrderByTenPhong(idLoaiPhong);
    }

    // Cập nhật trạng thái phòng dựa trên thời gian thực
    public void updateRoomStatusBasedOnBookings() {
        List<Phong> allRooms = phongRepository.findAll();
        LocalDate today = LocalDate.now();
        
        for (Phong phong : allRooms) {
            // Kiểm tra xem phòng có đơn đặt nào đang diễn ra không
            boolean hasActiveBooking = phong.getDanhSachDatPhong().stream()
                .anyMatch(booking -> {
                    // Đơn đặt đang diễn ra: ngày hôm nay nằm trong khoảng từ ngày đặt đến ngày trả
                    // VÀ trạng thái đơn đặt phòng là "Đã xác nhận" (không tính "Đã hủy")
                    return !booking.getNgayDat().isAfter(today) && 
                           !booking.getNgayTra().isBefore(today) &&
                           "Đã xác nhận".equals(booking.getTrangThai());
                });
            
            // Cập nhật trạng thái: chỉ có 2 trạng thái thực tế
            if (hasActiveBooking) {
                phong.setTrangThai("Đang sử dụng");
            } else {
                phong.setTrangThai("Trống");
            }
            
            phongRepository.save(phong);
        }
    }

    // Cập nhật trạng thái cho một phòng cụ thể
    public void updateRoomStatus(Integer phongId) {
        Optional<Phong> phongOpt = phongRepository.findById(phongId);
        if (phongOpt.isPresent()) {
            Phong phong = phongOpt.get();
            LocalDate today = LocalDate.now();
            
            // Kiểm tra xem phòng có đơn đặt nào đang diễn ra không (chỉ tính "Đã xác nhận")
            boolean hasActiveBooking = phong.getDanhSachDatPhong().stream()
                .anyMatch(booking -> {
                    return !booking.getNgayDat().isAfter(today) && 
                           !booking.getNgayTra().isBefore(today) &&
                           "Đã xác nhận".equals(booking.getTrangThai());
                });
            
            // Cập nhật trạng thái: chỉ có 2 trạng thái thực tế
            if (hasActiveBooking) {
                phong.setTrangThai("Đang sử dụng");
            } else {
                phong.setTrangThai("Trống");
            }
            
            phongRepository.save(phong);
        }
    }
} 