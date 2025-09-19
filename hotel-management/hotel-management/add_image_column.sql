-- Script để thêm cột ANHPHONG vào bảng tb_Phong
-- Chạy script này để cập nhật database hiện tại

USE quanly_khachsan;

-- Thêm cột ANHPHONG vào bảng tb_Phong
ALTER TABLE tb_Phong ADD COLUMN ANHPHONG VARCHAR(255) DEFAULT NULL;

-- Cập nhật một số ảnh mẫu cho các phòng hiện có
UPDATE tb_Phong SET ANHPHONG = '/images/rooms/room101.jpg' WHERE TENPHONG = 'P101';
UPDATE tb_Phong SET ANHPHONG = '/images/rooms/room102.jpg' WHERE TENPHONG = 'P102';
UPDATE tb_Phong SET ANHPHONG = '/images/rooms/room201.jpg' WHERE TENPHONG = 'P201';
UPDATE tb_Phong SET ANHPHONG = '/images/rooms/room202.jpg' WHERE TENPHONG = 'P202';
UPDATE tb_Phong SET ANHPHONG = '/images/rooms/room301.jpg' WHERE TENPHONG = 'P301';

-- Kiểm tra kết quả
SELECT IDPHONG, TENPHONG, ANHPHONG, TRANGTHAI FROM tb_Phong;
