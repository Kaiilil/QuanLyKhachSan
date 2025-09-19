package com.holtel.hotel_management.config;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.holtel.hotel_management.entity.CongTy;
import com.holtel.hotel_management.entity.KhachHang;
import com.holtel.hotel_management.entity.LoaiPhong;
import com.holtel.hotel_management.entity.Roles;
import com.holtel.hotel_management.entity.SanPham;
import com.holtel.hotel_management.entity.ThietBi;
import com.holtel.hotel_management.entity.Users;
import com.holtel.hotel_management.repository.CongTyRepository;
import com.holtel.hotel_management.repository.DatPhongRepository;
import com.holtel.hotel_management.repository.DatPhongSanPhamRepository;
import com.holtel.hotel_management.repository.DonViRepository;
import com.holtel.hotel_management.repository.KhachHangRepository;
import com.holtel.hotel_management.repository.LoaiPhongRepository;
import com.holtel.hotel_management.repository.RolesRepository;
import com.holtel.hotel_management.repository.SanPhamRepository;
import com.holtel.hotel_management.repository.TangRepository;
import com.holtel.hotel_management.repository.ThietBiRepository;
import com.holtel.hotel_management.repository.UsersRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CongTyRepository congTyRepository;

    @Autowired
    private DonViRepository donViRepository;

    @Autowired
    private TangRepository tangRepository;

    @Autowired
    private LoaiPhongRepository loaiPhongRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private DatPhongRepository datPhongRepository;

    @Autowired
    private DatPhongSanPhamRepository datPhongSanPhamRepository;

    @Autowired
    private ThietBiRepository thietBiRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Khởi tạo dữ liệu mẫu nếu chưa có
        initializeSampleData();
    }

    private void initializeSampleData() {
        // Khởi tạo công ty mẫu
        initializeCongTy();
        
        // Khởi tạo loại phòng mẫu
        initializeLoaiPhong();
        
        // Khởi tạo khách hàng mẫu
        initializeKhachHang();
        
        // Khởi tạo sản phẩm mẫu
        initializeSanPham();
        
        // Khởi tạo thiết bị mẫu
        initializeThietBi();
        
        // Khởi tạo user mẫu
        initializeUsers();
        
        // Khởi tạo đặt phòng sản phẩm mẫu
        initializeDatPhongSanPham();
    }

    private void initializeCongTy() {
        if (congTyRepository.count() == 0) {
            CongTy congTy1 = new CongTy();
            congTy1.setMaCty("CTY001");
            congTy1.setTenCty("Công ty Du lịch ABC");
            congTyRepository.save(congTy1);

            CongTy congTy2 = new CongTy();
            congTy2.setMaCty("CTY002");
            congTy2.setTenCty("Công ty Lữ hành XYZ");
            congTyRepository.save(congTy2);

            System.out.println("Đã tạo dữ liệu công ty mẫu");
        }
    }

    private void initializeLoaiPhong() {
        if (loaiPhongRepository.count() == 0) {
            LoaiPhong loaiPhong1 = new LoaiPhong();
            loaiPhong1.setTenLoaiPhong("Phòng Đơn");
            loaiPhong1.setGia(new BigDecimal("500000"));
            loaiPhong1.setMoTa("Phòng đơn tiêu chuẩn");
            loaiPhongRepository.save(loaiPhong1);

            LoaiPhong loaiPhong2 = new LoaiPhong();
            loaiPhong2.setTenLoaiPhong("Phòng Đôi");
            loaiPhong2.setGia(new BigDecimal("800000"));
            loaiPhong2.setMoTa("Phòng đôi cao cấp");
            loaiPhongRepository.save(loaiPhong2);

            LoaiPhong loaiPhong3 = new LoaiPhong();
            loaiPhong3.setTenLoaiPhong("Phòng Suite");
            loaiPhong3.setGia(new BigDecimal("1500000"));
            loaiPhong3.setMoTa("Phòng suite sang trọng");
            loaiPhongRepository.save(loaiPhong3);

            System.out.println("Đã tạo dữ liệu loại phòng mẫu");
        }
    }

    private void initializeKhachHang() {
        if (khachHangRepository.count() == 0) {
            KhachHang khachHang1 = new KhachHang();
            khachHang1.setHoTen("Nguyễn Văn A");
            khachHang1.setCccd("123456789012");
            khachHang1.setSoDienThoai("0123456789");
            khachHang1.setEmail("nguyenvana@email.com");
            khachHang1.setDiaChi("Hà Nội");
            khachHangRepository.save(khachHang1);

            KhachHang khachHang2 = new KhachHang();
            khachHang2.setHoTen("Trần Thị B");
            khachHang2.setCccd("987654321098");
            khachHang2.setSoDienThoai("0987654321");
            khachHang2.setEmail("tranthib@email.com");
            khachHang2.setDiaChi("TP.HCM");
            khachHangRepository.save(khachHang2);

            System.out.println("Đã tạo dữ liệu khách hàng mẫu");
        }
    }

    private void initializeSanPham() {
        if (sanPhamRepository.count() == 0) {
            SanPham sanPham1 = new SanPham();
            sanPham1.setTenSp("Nước khoáng");
            sanPham1.setDonGia(new BigDecimal("15000"));
            sanPham1.setMoTa("Nước khoáng 500ml");
            sanPhamRepository.save(sanPham1);

            SanPham sanPham2 = new SanPham();
            sanPham2.setTenSp("Bánh snack");
            sanPham2.setDonGia(new BigDecimal("25000"));
            sanPham2.setMoTa("Bánh snack các loại");
            sanPhamRepository.save(sanPham2);

            SanPham sanPham3 = new SanPham();
            sanPham3.setTenSp("Cà phê");
            sanPham3.setDonGia(new BigDecimal("35000"));
            sanPham3.setMoTa("Cà phê sữa đá");
            sanPhamRepository.save(sanPham3);

            System.out.println("Đã tạo dữ liệu sản phẩm mẫu");
        }
    }

    private void initializeThietBi() {
        if (thietBiRepository.count() == 0) {
            ThietBi thietBi1 = new ThietBi();
            thietBi1.setTenTb("Tủ lạnh");
            thietBi1.setMoTa("Tủ lạnh mini");
            thietBiRepository.save(thietBi1);

            ThietBi thietBi2 = new ThietBi();
            thietBi2.setTenTb("TV");
            thietBi2.setMoTa("Tivi 32 inch");
            thietBiRepository.save(thietBi2);

            ThietBi thietBi3 = new ThietBi();
            thietBi3.setTenTb("Điều hòa");
            thietBi3.setMoTa("Điều hòa 1 chiều");
            thietBiRepository.save(thietBi3);

            System.out.println("Đã tạo dữ liệu thiết bị mẫu");
        }
    }

    private void initializeUsers() {
        if (usersRepository.count() == 0) {
            // Lấy role ADMIN
            Roles adminRole = rolesRepository.findByRoleName("ADMIN").orElse(null);
            if (adminRole != null) {
                Users adminUser = new Users();
                adminUser.setUsername("admin");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setEmail("admin@hotel.com");
                adminUser.setRole(adminRole);
                usersRepository.save(adminUser);
            }

            // Lấy role USER
            Roles userRole = rolesRepository.findByRoleName("USER").orElse(null);
            if (userRole != null) {
                Users normalUser = new Users();
                normalUser.setUsername("user");
                normalUser.setPassword(passwordEncoder.encode("user123"));
                normalUser.setEmail("user@hotel.com");
                normalUser.setRole(userRole);
                usersRepository.save(normalUser);
            }

            System.out.println("Đã tạo dữ liệu user mẫu");
        }
    }

    private void initializeDatPhongSanPham() {
        if (datPhongSanPhamRepository.count() == 0) {
            // Lấy một số đặt phòng và sản phẩm để tạo dữ liệu mẫu
            var datPhongs = datPhongRepository.findAll();
            var sanPhams = sanPhamRepository.findAll();
            
            if (!datPhongs.isEmpty() && !sanPhams.isEmpty()) {
                // Tạo một số đặt phòng sản phẩm mẫu
                for (int i = 0; i < Math.min(datPhongs.size(), 3); i++) {
                    var datPhong = datPhongs.get(i);
                    var sanPham = sanPhams.get(i % sanPhams.size());
                    
                    var datPhongSanPham = new com.holtel.hotel_management.entity.DatPhongSanPham();
                    datPhongSanPham.setDatPhong(datPhong);
                    datPhongSanPham.setSanPham(sanPham);
                    datPhongSanPham.setSoLuong((i + 1) * 2); // Số lượng mẫu
                    datPhongSanPhamRepository.save(datPhongSanPham);
                }
                
                System.out.println("Đã tạo dữ liệu đặt phòng sản phẩm mẫu");
            }
        }
    }
} 