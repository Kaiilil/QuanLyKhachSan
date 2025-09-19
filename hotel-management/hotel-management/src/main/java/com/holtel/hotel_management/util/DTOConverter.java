package com.holtel.hotel_management.util;

import java.util.List;
import java.util.stream.Collectors;

import com.holtel.hotel_management.dto.CongTyDTO;
import com.holtel.hotel_management.dto.DatPhongDTO;
import com.holtel.hotel_management.dto.DatPhongSanPhamDTO;
import com.holtel.hotel_management.dto.DonViDTO;
import com.holtel.hotel_management.dto.DuDoanKhachDTO;
import com.holtel.hotel_management.dto.KhachHangDTO;
import com.holtel.hotel_management.dto.LichSuPhongDTO;
import com.holtel.hotel_management.dto.LoaiPhongDTO;
import com.holtel.hotel_management.dto.PhongDTO;
import com.holtel.hotel_management.dto.PhongDetailDTO;
import com.holtel.hotel_management.dto.PhongThietBiDTO;
import com.holtel.hotel_management.dto.RolesDTO;
import com.holtel.hotel_management.dto.SanPhamDTO;
import com.holtel.hotel_management.dto.TangDTO;
import com.holtel.hotel_management.dto.ThanhToanDTO;
import com.holtel.hotel_management.dto.ThietBiDTO;
import com.holtel.hotel_management.dto.UsersDTO;
import com.holtel.hotel_management.entity.CongTy;
import com.holtel.hotel_management.entity.DatPhong;
import com.holtel.hotel_management.entity.DatPhongSanPham;
import com.holtel.hotel_management.entity.DonVi;
import com.holtel.hotel_management.entity.DuDoanKhach;
import com.holtel.hotel_management.entity.KhachHang;
import com.holtel.hotel_management.entity.LichSuPhong;
import com.holtel.hotel_management.entity.LoaiPhong;
import com.holtel.hotel_management.entity.Phong;
import com.holtel.hotel_management.entity.PhongThietBi;
import com.holtel.hotel_management.entity.Roles;
import com.holtel.hotel_management.entity.SanPham;
import com.holtel.hotel_management.entity.Tang;
import com.holtel.hotel_management.entity.ThanhToan;
import com.holtel.hotel_management.entity.ThietBi;
import com.holtel.hotel_management.entity.Users;

public class DTOConverter {
    
    // CongTy
    public static CongTyDTO toCongTyDTO(CongTy congTy) {
        return new CongTyDTO(congTy.getMaCty(), congTy.getTenCty());
    }
    
    public static List<CongTyDTO> toCongTyDTOList(List<CongTy> congTyList) {
        return congTyList.stream()
                .map(DTOConverter::toCongTyDTO)
                .collect(Collectors.toList());
    }
    
    // DonVi
    public static DonViDTO toDonViDTO(DonVi donVi) {
        return new DonViDTO(donVi.getIdDvi(), donVi.getTenDvi(), 
                donVi.getCongTy() != null ? donVi.getCongTy().getMaCty() : null);
    }
    
    public static List<DonViDTO> toDonViDTOList(List<DonVi> donViList) {
        return donViList.stream()
                .map(DTOConverter::toDonViDTO)
                .collect(Collectors.toList());
    }
    
    // Tang
    public static TangDTO toTangDTO(Tang tang) {
        return new TangDTO(tang.getIdTang(), tang.getTenTang(), 
                tang.getDonVi() != null ? tang.getDonVi().getIdDvi() : null);
    }
    
    public static List<TangDTO> toTangDTOList(List<Tang> tangList) {
        return tangList.stream()
                .map(DTOConverter::toTangDTO)
                .collect(Collectors.toList());
    }
    
    // Phong
    public static PhongDTO toPhongDTO(Phong phong) {
        return new PhongDTO(
                phong.getIdPhong(),
                phong.getTenPhong(),
                phong.getTang() != null ? phong.getTang().getIdTang() : null,
                phong.getLoaiPhong() != null ? phong.getLoaiPhong().getIdLoaiPhong() : null,
                phong.getDonVi() != null ? phong.getDonVi().getIdDvi() : null,
                phong.getAnhPhong(),
                phong.getTrangThai()
        );
    }
    
    public static List<PhongDTO> toPhongDTOList(List<Phong> phongList) {
        return phongList.stream()
                .map(DTOConverter::toPhongDTO)
                .collect(Collectors.toList());
    }
    
    // KhachHang
    public static KhachHangDTO toKhachHangDTO(KhachHang khachHang) {
        return new KhachHangDTO(
                khachHang.getIdKh(),
                khachHang.getHoTen(),
                khachHang.getCccd(),
                khachHang.getSoDienThoai(),
                khachHang.getEmail(),
                khachHang.getDiaChi()
        );
    }
    
    public static List<KhachHangDTO> toKhachHangDTOList(List<KhachHang> khachHangList) {
        return khachHangList.stream()
                .map(DTOConverter::toKhachHangDTO)
                .collect(Collectors.toList());
    }
    
    // DatPhong
    public static DatPhongDTO toDatPhongDTO(DatPhong datPhong) {
        return new DatPhongDTO(
                datPhong.getIdDatPhong(),
                datPhong.getPhong() != null ? datPhong.getPhong().getIdPhong() : null,
                datPhong.getKhachHang() != null ? datPhong.getKhachHang().getIdKh() : null,
                datPhong.getNgayDat(),
                datPhong.getNgayTra(),
                datPhong.getTrangThai()
        );
    }
    
    public static List<DatPhongDTO> toDatPhongDTOList(List<DatPhong> datPhongList) {
        return datPhongList.stream()
                .map(DTOConverter::toDatPhongDTO)
                .collect(Collectors.toList());
    }
    
    // LoaiPhong
    public static LoaiPhongDTO toLoaiPhongDTO(LoaiPhong loaiPhong) {
        return new LoaiPhongDTO(
                loaiPhong.getIdLoaiPhong(),
                loaiPhong.getTenLoaiPhong(),
                loaiPhong.getGia(),
                loaiPhong.getMoTa(),
                loaiPhong.getHinhAnh()
        );
    }
    
    public static List<LoaiPhongDTO> toLoaiPhongDTOList(List<LoaiPhong> loaiPhongList) {
        return loaiPhongList.stream()
                .map(DTOConverter::toLoaiPhongDTO)
                .collect(Collectors.toList());
    }
    
    // ThanhToan
    public static ThanhToanDTO toThanhToanDTO(ThanhToan thanhToan) {
        return new ThanhToanDTO(
                thanhToan.getIdTt(),
                thanhToan.getDatPhong() != null ? thanhToan.getDatPhong().getIdDatPhong() : null,
                thanhToan.getNgayTt(),
                thanhToan.getNgayDat(),
                thanhToan.getNgayTra(),
                thanhToan.getSoTien(),
                thanhToan.getHinhThucTt(),
                thanhToan.getTrangThai()
        );
    }
    
    public static List<ThanhToanDTO> toThanhToanDTOList(List<ThanhToan> thanhToanList) {
        return thanhToanList.stream()
                .map(DTOConverter::toThanhToanDTO)
                .collect(Collectors.toList());
    }
    
    // SanPham
    public static SanPhamDTO toSanPhamDTO(SanPham sanPham) {
        return new SanPhamDTO(
                sanPham.getIdSp(),
                sanPham.getTenSp(),
                sanPham.getDonGia().doubleValue(),
                sanPham.getMoTa()
        );
    }
    
    public static List<SanPhamDTO> toSanPhamDTOList(List<SanPham> sanPhamList) {
        return sanPhamList.stream()
                .map(DTOConverter::toSanPhamDTO)
                .collect(Collectors.toList());
    }
    
    // DatPhongSanPham
    public static DatPhongSanPhamDTO toDatPhongSanPhamDTO(DatPhongSanPham datPhongSanPham) {
        return new DatPhongSanPhamDTO(
                datPhongSanPham.getIdDpSp(),
                datPhongSanPham.getDatPhong() != null ? datPhongSanPham.getDatPhong().getIdDatPhong() : null,
                datPhongSanPham.getSanPham() != null ? datPhongSanPham.getSanPham().getIdSp() : null,
                datPhongSanPham.getSoLuong()
        );
    }
    
    public static List<DatPhongSanPhamDTO> toDatPhongSanPhamDTOList(List<DatPhongSanPham> datPhongSanPhamList) {
        return datPhongSanPhamList.stream()
                .map(DTOConverter::toDatPhongSanPhamDTO)
                .collect(Collectors.toList());
    }
    
    // ThietBi
    public static ThietBiDTO toThietBiDTO(ThietBi thietBi) {
        return new ThietBiDTO(
                thietBi.getIdTb(),
                thietBi.getTenTb(),
                thietBi.getMoTa()
        );
    }
    
    public static List<ThietBiDTO> toThietBiDTOList(List<ThietBi> thietBiList) {
        return thietBiList.stream()
                .map(DTOConverter::toThietBiDTO)
                .collect(Collectors.toList());
    }
    
    // PhongThietBi
    public static PhongThietBiDTO toPhongThietBiDTO(PhongThietBi phongThietBi) {
        return new PhongThietBiDTO(
                phongThietBi.getId(),
                phongThietBi.getPhong() != null ? phongThietBi.getPhong().getIdPhong() : null,
                phongThietBi.getThietBi() != null ? phongThietBi.getThietBi().getIdTb() : null,
                phongThietBi.getSoLuong()
        );
    }
    
    public static List<PhongThietBiDTO> toPhongThietBiDTOList(List<PhongThietBi> phongThietBiList) {
        return phongThietBiList.stream()
                .map(DTOConverter::toPhongThietBiDTO)
                .collect(Collectors.toList());
    }
    
    // LichSuPhong
    public static LichSuPhongDTO toLichSuPhongDTO(LichSuPhong lichSuPhong) {
        return new LichSuPhongDTO(
                lichSuPhong.getIdLsp(),
                lichSuPhong.getPhong() != null ? lichSuPhong.getPhong().getIdPhong() : null,
                lichSuPhong.getThoiGian(),
                lichSuPhong.getTrangThai()
        );
    }
    
    public static List<LichSuPhongDTO> toLichSuPhongDTOList(List<LichSuPhong> lichSuPhongList) {
        return lichSuPhongList.stream()
                .map(DTOConverter::toLichSuPhongDTO)
                .collect(Collectors.toList());
    }
    
    // DuDoanKhach
    public static DuDoanKhachDTO toDuDoanKhachDTO(DuDoanKhach duDoanKhach) {
        return new DuDoanKhachDTO(
                duDoanKhach.getId(),
                duDoanKhach.getThang(),
                duDoanKhach.getNam(),
                duDoanKhach.getCongTy() != null ? duDoanKhach.getCongTy().getMaCty() : null,
                duDoanKhach.getDonVi() != null ? duDoanKhach.getDonVi().getIdDvi() : null,
                duDoanKhach.getDuDoanSoLuongKhach()
        );
    }
    
    public static List<DuDoanKhachDTO> toDuDoanKhachDTOList(List<DuDoanKhach> duDoanKhachList) {
        return duDoanKhachList.stream()
                .map(DTOConverter::toDuDoanKhachDTO)
                .collect(Collectors.toList());
    }
    
    // Users
    public static UsersDTO toUsersDTO(Users users) {
        return new UsersDTO(
                users.getIdUser(),
                users.getUsername(),
                users.getEmail(),
                users.getSoDienThoai(),
                users.getDiaChi(),
                users.getRole() != null ? users.getRole().getIdRole() : null
        );
    }
    
    public static List<UsersDTO> toUsersDTOList(List<Users> usersList) {
        return usersList.stream()
                .map(DTOConverter::toUsersDTO)
                .collect(Collectors.toList());
    }
    
    // Roles
    public static RolesDTO toRolesDTO(Roles roles) {
        return new RolesDTO(
                roles.getIdRole(),
                roles.getRoleName()
        );
    }
    
    public static List<RolesDTO> toRolesDTOList(List<Roles> rolesList) {
        return rolesList.stream()
                .map(DTOConverter::toRolesDTO)
                .collect(Collectors.toList());
    }

    // Chuyển từ DatPhongDTO sang DatPhong
    public static DatPhong toDatPhong(DatPhongDTO dto) {
        DatPhong datPhong = new DatPhong();
        datPhong.setIdDatPhong(dto.getIdDatPhong());
        datPhong.setNgayDat(dto.getNgayDat());
        datPhong.setNgayTra(dto.getNgayTra());
        datPhong.setTrangThai(dto.getTrangThai());
        
        // Các trường liên kết sẽ được set ở service level
        // vì cần load từ database dựa trên ID
        return datPhong;
    }

    // Chuyển từ PhongDTO sang Phong (chỉ set các trường cơ bản, các trường liên kết sẽ để null)
    public static Phong toPhong(PhongDTO dto) {
        Phong phong = new Phong();
        phong.setIdPhong(dto.getIdPhong());
        phong.setTenPhong(dto.getTenPhong());
        phong.setAnhPhong(dto.getAnhPhong());
        phong.setTrangThai(dto.getTrangThai());
        // Các trường liên kết như tang, loaiPhong sẽ được set ở service
        if (dto.getIdDvi() != null) {
            DonVi donVi = new DonVi();
            donVi.setIdDvi(dto.getIdDvi());
            phong.setDonVi(donVi);
        }
        return phong;
    }

    // Chuyển từ KhachHangDTO sang KhachHang (chỉ set các trường cơ bản)
    public static KhachHang toKhachHang(KhachHangDTO dto) {
        KhachHang kh = new KhachHang();
        kh.setIdKh(dto.getIdKh());
        kh.setHoTen(dto.getHoTen());
        kh.setCccd(dto.getCccd());
        kh.setSoDienThoai(dto.getSoDienThoai());
        kh.setEmail(dto.getEmail());
        kh.setDiaChi(dto.getDiaChi());
        return kh;
    }

    // Chuyển từ DonViDTO sang DonVi
    public static DonVi toDonVi(DonViDTO dto) {
        DonVi donVi = new DonVi();
        donVi.setIdDvi(dto.getIdDvi());
        donVi.setTenDvi(dto.getTenDvi());
        
        // Xử lý CongTy nếu có maCty
        if (dto.getMaCty() != null && !dto.getMaCty().isEmpty()) {
            CongTy congTy = new CongTy();
            congTy.setMaCty(dto.getMaCty());
            donVi.setCongTy(congTy);
        }
        
        return donVi;
    }
    // Chuyển từ TangDTO sang Tang
    public static Tang toTang(TangDTO dto) {
        Tang tang = new Tang();
        tang.setIdTang(dto.getIdTang());
        tang.setTenTang(dto.getTenTang());
        // Set DonVi nếu có idDvi
        if (dto.getIdDvi() != null) {
            DonVi donVi = new DonVi();
            donVi.setIdDvi(dto.getIdDvi());
            tang.setDonVi(donVi);
        }
        return tang;
    }
    // Chuyển từ CongTyDTO sang CongTy
    public static CongTy toCongTy(CongTyDTO dto) {
        CongTy congTy = new CongTy();
        congTy.setMaCty(dto.getMaCty());
        congTy.setTenCty(dto.getTenCty());
        return congTy;
    }
    // Chuyển từ LoaiPhongDTO sang LoaiPhong
    public static LoaiPhong toLoaiPhong(LoaiPhongDTO dto) {
        LoaiPhong loaiPhong = new LoaiPhong();
        loaiPhong.setIdLoaiPhong(dto.getIdLoaiPhong());
        loaiPhong.setTenLoaiPhong(dto.getTenLoaiPhong());
        loaiPhong.setGia(dto.getGia());
        loaiPhong.setMoTa(dto.getMoTa());
        loaiPhong.setHinhAnh(dto.getHinhAnh());
        return loaiPhong;
    }
    // Chuyển từ RolesDTO sang Roles
    public static Roles toRoles(RolesDTO dto) {
        Roles roles = new Roles();
        roles.setIdRole(dto.getIdRole());
        roles.setRoleName(dto.getRoleName());
        return roles;
    }
    // Chuyển từ UsersDTO sang Users
    public static Users toUsers(UsersDTO dto) {
        Users users = new Users();
        users.setIdUser(dto.getIdUser());
        users.setUsername(dto.getUsername());
        users.setEmail(dto.getEmail());
        users.setSoDienThoai(dto.getSoDienThoai());
        users.setDiaChi(dto.getDiaChi());
        // users.setPassword(...) cần xử lý ở service nếu cần
        // users.setRole(...) cần xử lý ở service nếu cần
        return users;
    }
    
    // Chuyển từ ThanhToanDTO sang ThanhToan
    public static ThanhToan toThanhToan(ThanhToanDTO dto) {
        ThanhToan thanhToan = new ThanhToan();
        thanhToan.setIdTt(dto.getIdTt());
        thanhToan.setNgayTt(dto.getNgayTt());
        thanhToan.setNgayDat(dto.getNgayDat());
        thanhToan.setNgayTra(dto.getNgayTra());
        thanhToan.setSoTien(dto.getSoTien());
        thanhToan.setHinhThucTt(dto.getHinhThucTt());
        thanhToan.setTrangThai(dto.getTrangThai());
        // thanhToan.setDatPhong(...) cần xử lý ở service nếu cần
        return thanhToan;
    }
    
    // PhongDetailDTO
    public static PhongDetailDTO toPhongDetailDTO(Phong phong) {
        PhongDetailDTO dto = new PhongDetailDTO();
        
        // Thông tin cơ bản
        dto.setIdPhong(phong.getIdPhong());
        dto.setTenPhong(phong.getTenPhong());
        dto.setTrangThai(phong.getTrangThai());
        dto.setAnhPhong(phong.getAnhPhong());
        
        // Thông tin tầng
        if (phong.getTang() != null) {
            dto.setIdTang(phong.getTang().getIdTang());
            dto.setTenTang(phong.getTang().getTenTang());
            
            // Thông tin đơn vị
            if (phong.getTang().getDonVi() != null) {
                dto.setIdDvi(phong.getTang().getDonVi().getIdDvi());
                dto.setTenDvi(phong.getTang().getDonVi().getTenDvi());
                
                // Thông tin công ty
                if (phong.getTang().getDonVi().getCongTy() != null) {
                    dto.setMaCty(phong.getTang().getDonVi().getCongTy().getMaCty());
                    dto.setTenCty(phong.getTang().getDonVi().getCongTy().getTenCty());
                }
            }
        }
        
        // Thông tin loại phòng
        if (phong.getLoaiPhong() != null) {
            dto.setIdLoaiPhong(phong.getLoaiPhong().getIdLoaiPhong());
            dto.setTenLoaiPhong(phong.getLoaiPhong().getTenLoaiPhong());
            dto.setGia(phong.getLoaiPhong().getGia());
            dto.setMoTa(phong.getLoaiPhong().getMoTa());
        }
        
        // Danh sách thiết bị
        if (phong.getDanhSachPhongThietBi() != null) {
            dto.setDanhSachThietBi(toPhongThietBiDTOList(phong.getDanhSachPhongThietBi()));
            dto.setSoLuongThietBi((long) phong.getDanhSachPhongThietBi().size());
        }
        
        // Danh sách lịch sử
        if (phong.getDanhSachLichSuPhong() != null) {
            dto.setDanhSachLichSu(toLichSuPhongDTOList(phong.getDanhSachLichSuPhong()));
            dto.setSoLuongLichSu((long) phong.getDanhSachLichSuPhong().size());
        }
        
        // Danh sách đặt phòng
        if (phong.getDanhSachDatPhong() != null) {
            dto.setDanhSachDatPhong(toDatPhongDTOList(phong.getDanhSachDatPhong()));
            dto.setSoLuongDatPhong((long) phong.getDanhSachDatPhong().size());
        }
        
        return dto;
    }
    
    public static List<PhongDetailDTO> toPhongDetailDTOList(List<Phong> phongList) {
        return phongList.stream()
                .map(DTOConverter::toPhongDetailDTO)
                .collect(Collectors.toList());
    }

    // Chuyển từ ThietBiDTO sang ThietBi
    public static ThietBi toThietBi(ThietBiDTO dto) {
        ThietBi thietBi = new ThietBi();
        thietBi.setIdTb(dto.getIdTb());
        thietBi.setTenTb(dto.getTenTb());
        thietBi.setMoTa(dto.getMoTa());
        return thietBi;
    }

    // Chuyển từ PhongThietBiDTO sang PhongThietBi
    public static PhongThietBi toPhongThietBi(PhongThietBiDTO dto) {
        PhongThietBi ptb = new PhongThietBi();
        ptb.setId(dto.getId());
        if (dto.getIdPhong() != null) {
            Phong phong = new Phong();
            phong.setIdPhong(dto.getIdPhong());
            ptb.setPhong(phong);
        }
        if (dto.getIdTb() != null) {
            ThietBi thietBi = new ThietBi();
            thietBi.setIdTb(dto.getIdTb());
            ptb.setThietBi(thietBi);
        }
        ptb.setSoLuong(dto.getSoLuong());
        return ptb;
    }
} 