package com.holtel.hotel_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RoomStatusScheduler {

    @Autowired
    private PhongService phongService;

    // Cập nhật trạng thái phòng mỗi ngày lúc 00:00
    @Scheduled(cron = "0 0 0 * * ?")
    public void updateRoomStatusDaily() {
        try {
            phongService.updateRoomStatusBasedOnBookings();
            System.out.println("Đã cập nhật trạng thái phòng tự động lúc " + java.time.LocalDateTime.now());
        } catch (Exception e) {
            System.err.println("Lỗi khi cập nhật trạng thái phòng tự động: " + e.getMessage());
        }
    }

    // Cập nhật trạng thái phòng mỗi giờ (tùy chọn)
    @Scheduled(cron = "0 0 * * * ?")
    public void updateRoomStatusHourly() {
        try {
            phongService.updateRoomStatusBasedOnBookings();
            System.out.println("Đã cập nhật trạng thái phòng hàng giờ lúc " + java.time.LocalDateTime.now());
        } catch (Exception e) {
            System.err.println("Lỗi khi cập nhật trạng thái phòng hàng giờ: " + e.getMessage());
        }
    }
}