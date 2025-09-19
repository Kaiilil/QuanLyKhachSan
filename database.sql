-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quanly_khachsan
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_congty`
--

DROP TABLE IF EXISTS `tb_congty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_congty` (
  `MACTY` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `TENCTY` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`MACTY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_congty`
--

LOCK TABLES `tb_congty` WRITE;
/*!40000 ALTER TABLE `tb_congty` DISABLE KEYS */;
INSERT INTO `tb_congty` VALUES ('',''),('CT01','Công ty TNHH MTV Khách sạn Hòa Bình 23'),('CT02','Công ty TNHH MTV Khách sạn Mường Thanh');
/*!40000 ALTER TABLE `tb_congty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_datphong`
--

DROP TABLE IF EXISTS `tb_datphong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_datphong` (
  `IDDATPHONG` int(11) NOT NULL AUTO_INCREMENT,
  `IDPHONG` int(11) DEFAULT NULL,
  `IDKH` int(11) DEFAULT NULL,
  `NGAYDAT` date DEFAULT NULL,
  `NGAYTRA` date DEFAULT NULL,
  `TRANGTHAI` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`IDDATPHONG`),
  KEY `IDPHONG` (`IDPHONG`),
  KEY `IDKH` (`IDKH`),
  CONSTRAINT `tb_datphong_ibfk_1` FOREIGN KEY (`IDPHONG`) REFERENCES `tb_phong` (`idphong`),
  CONSTRAINT `tb_datphong_ibfk_2` FOREIGN KEY (`IDKH`) REFERENCES `tb_khachhang` (`idkh`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_datphong`
--

LOCK TABLES `tb_datphong` WRITE;
/*!40000 ALTER TABLE `tb_datphong` DISABLE KEYS */;
INSERT INTO `tb_datphong` VALUES (15,13,14,'2025-10-21','2025-10-22','Đã xác nhận'),(19,13,18,'2025-08-17','2025-08-18','Đã xác nhận'),(21,14,20,'2025-12-18','2025-12-19','Chờ xử lý'),(22,14,21,'2025-12-20','2025-12-21','Chờ xử lý'),(32,14,6,'2025-08-30','2025-08-31','Chờ xử lý'),(33,17,31,'2025-12-20','2025-12-21','Chờ xử lý'),(34,14,32,'2025-12-22','2025-12-23','Chờ xử lý');
/*!40000 ALTER TABLE `tb_datphong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_datphong_sanpham`
--

DROP TABLE IF EXISTS `tb_datphong_sanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_datphong_sanpham` (
  `IDDP_SP` int(11) NOT NULL AUTO_INCREMENT,
  `IDDATPHONG` int(11) DEFAULT NULL,
  `IDSP` int(11) DEFAULT NULL,
  `SOLUONG` int(11) DEFAULT NULL,
  PRIMARY KEY (`IDDP_SP`),
  KEY `IDDATPHONG` (`IDDATPHONG`),
  KEY `IDSP` (`IDSP`),
  CONSTRAINT `tb_datphong_sanpham_ibfk_1` FOREIGN KEY (`IDDATPHONG`) REFERENCES `tb_datphong` (`iddatphong`),
  CONSTRAINT `tb_datphong_sanpham_ibfk_2` FOREIGN KEY (`IDSP`) REFERENCES `tb_sanpham` (`idsp`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_datphong_sanpham`
--

LOCK TABLES `tb_datphong_sanpham` WRITE;
/*!40000 ALTER TABLE `tb_datphong_sanpham` DISABLE KEYS */;
INSERT INTO `tb_datphong_sanpham` VALUES (8,15,1,2),(9,19,2,4),(10,21,3,6),(11,32,1,1);
/*!40000 ALTER TABLE `tb_datphong_sanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_donvi`
--

DROP TABLE IF EXISTS `tb_donvi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_donvi` (
  `IDDVI` int(11) NOT NULL AUTO_INCREMENT,
  `TENDVI` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `MACTY` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`IDDVI`),
  KEY `MACTY` (`MACTY`),
  CONSTRAINT `tb_donvi_ibfk_1` FOREIGN KEY (`MACTY`) REFERENCES `tb_congty` (`macty`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_donvi`
--

LOCK TABLES `tb_donvi` WRITE;
/*!40000 ALTER TABLE `tb_donvi` DISABLE KEYS */;
INSERT INTO `tb_donvi` VALUES (1,'Khách sạn Luxury Hà Nội','CT01');
/*!40000 ALTER TABLE `tb_donvi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_dudoankhach`
--

DROP TABLE IF EXISTS `tb_dudoankhach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_dudoankhach` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `THANG` int(11) DEFAULT NULL,
  `NAM` int(11) DEFAULT NULL,
  `MACTY` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `IDDVI` int(11) DEFAULT NULL,
  `DUDOAN_SOLUONGKHACH` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `MACTY` (`MACTY`),
  KEY `IDDVI` (`IDDVI`),
  CONSTRAINT `tb_dudoankhach_ibfk_1` FOREIGN KEY (`MACTY`) REFERENCES `tb_congty` (`macty`),
  CONSTRAINT `tb_dudoankhach_ibfk_2` FOREIGN KEY (`IDDVI`) REFERENCES `tb_donvi` (`iddvi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_dudoankhach`
--

LOCK TABLES `tb_dudoankhach` WRITE;
/*!40000 ALTER TABLE `tb_dudoankhach` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_dudoankhach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_khachhang`
--

DROP TABLE IF EXISTS `tb_khachhang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_khachhang` (
  `IDKH` int(11) NOT NULL AUTO_INCREMENT,
  `HOTEN` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `CCCD` varchar(20) DEFAULT NULL,
  `SDT` varchar(15) DEFAULT NULL,
  `EMAIL` varchar(100) DEFAULT NULL,
  `DIACHI` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`IDKH`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_khachhang`
--

LOCK TABLES `tb_khachhang` WRITE;
/*!40000 ALTER TABLE `tb_khachhang` DISABLE KEYS */;
INSERT INTO `tb_khachhang` VALUES (1,'Nguyễn Văn A','123456789','0987654321','nguyenvana@email.com','123 Đường A'),(2,'Trần Thị B','987654321','0912345678','tranthib@email.com','456 Đường B'),(6,'Nguyễn Võ Thành','123456789112','0929352067','nguyenvothanh20044@gmail.com','123'),(7,'Nguyễn Võ Thành','123456789112','0929352067','nvct2004@gmail.com','123'),(8,'Nguyễn Võ Thành','123456789112','0929352067','nvct2004@gmail.com','123'),(9,'Nguyễn Võ Thành','123456789112','0929352067','nvct2004@gmail.com','123'),(10,'Nguyễn Võ Thành','123456789112','0929352067','nvct2004@gmail.com','123'),(11,'Nguyễn Võ Thành','123456789112','0929352067','nvct2004@gmail.com','123'),(12,'Nguyễn Võ Thành','123456789112','0929352067','2251120246@ut.edu.vn','123'),(13,'Nguyễn Võ Thành','123456789112','0929352067','2251120246@ut.edu.vn','123'),(14,'Nguyễn Võ Thành','123456789112','0929352067','2251120246@ut.edu.vn','123'),(15,'Nguyễn Võ Thành','123456789112','0929352067','2251120246@ut.edu.vn',''),(16,'123123','123456789112','0929352067','2251120246@ut.edu.vn','123'),(17,'Nguyễn Võ Thành','123456789112','0929352067','2251120246@ut.edu.vn','123'),(18,'Nguyễn Võ Thành','123456789112','0929352067','2251120246@ut.edu.vn','123'),(19,'123123','123456789112','0929352067','2251120246@ut.edu.vn','123'),(20,'123123','123456789112','0929352067','2251120246@ut.edu.vn','123'),(21,'123123','123456789112','0929352067','2251120246@ut.edu.vn','123'),(22,'Nguyễn Võ Thành','','0929352067','ngh@gmail.com',''),(23,'Thành','','01234990587','gkl@gmail.com',''),(24,'Thành','','01234990587','klj@gmail.com',''),(30,'admin','123456789112','01234990587','admin@hotel.com','123'),(31,'admin','123456789112','01234990587','admin@hotel.com','123'),(32,'Thành','','01234990587','vc@gmail.com','');
/*!40000 ALTER TABLE `tb_khachhang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_lichsuphong`
--

DROP TABLE IF EXISTS `tb_lichsuphong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_lichsuphong` (
  `IDLSP` int(11) NOT NULL AUTO_INCREMENT,
  `IDPHONG` int(11) DEFAULT NULL,
  `THOIGIAN` datetime DEFAULT NULL,
  `TRANGTHAI` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`IDLSP`),
  KEY `IDPHONG` (`IDPHONG`),
  CONSTRAINT `tb_lichsuphong_ibfk_1` FOREIGN KEY (`IDPHONG`) REFERENCES `tb_phong` (`idphong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_lichsuphong`
--

LOCK TABLES `tb_lichsuphong` WRITE;
/*!40000 ALTER TABLE `tb_lichsuphong` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_lichsuphong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_loaiphong`
--

DROP TABLE IF EXISTS `tb_loaiphong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_loaiphong` (
  `IDLOAIPHONG` int(11) NOT NULL AUTO_INCREMENT,
  `TENLOAIPHONG` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `GIA` decimal(10,2) DEFAULT NULL,
  `MOTA` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `HINHANH` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`IDLOAIPHONG`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_loaiphong`
--

LOCK TABLES `tb_loaiphong` WRITE;
/*!40000 ALTER TABLE `tb_loaiphong` DISABLE KEYS */;
INSERT INTO `tb_loaiphong` VALUES (1,'Phòng đơn',500000.00,'Phòng dành cho 1 người ','/uploads/rooms/room_dd73b7a4-f450-4b34-b28e-b209aaca28fd.webp'),(2,'Phòng đôi',800000.00,'Phòng dành cho 2 người','/uploads/rooms/room_6fe655e6-cf4f-4593-b5d0-0b1daebe7e4f.jpg'),(4,'Phòng Vip',1500000.00,'Phòng Vip','/uploads/rooms/room_41ef44a3-40da-4899-84fb-cb1f71cb0e7c.jpg'),(13,'Phòng  A',1000000.00,'21321','/uploads/rooms/room_7886c3bf-0487-4ea8-82eb-b15f481c92d9.png');
/*!40000 ALTER TABLE `tb_loaiphong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_phong`
--

DROP TABLE IF EXISTS `tb_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_phong` (
  `IDPHONG` int(11) NOT NULL AUTO_INCREMENT,
  `TENPHONG` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `IDTANG` int(11) DEFAULT NULL,
  `IDLOAIPHONG` int(11) DEFAULT NULL,
  `IDDVI` int(11) DEFAULT NULL,
  `TRANGTHAI` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `anhphong` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IDPHONG`),
  KEY `IDTANG` (`IDTANG`),
  KEY `IDLOAIPHONG` (`IDLOAIPHONG`),
  KEY `IDDVI` (`IDDVI`),
  CONSTRAINT `tb_phong_ibfk_1` FOREIGN KEY (`IDTANG`) REFERENCES `tb_tang` (`idtang`),
  CONSTRAINT `tb_phong_ibfk_2` FOREIGN KEY (`IDLOAIPHONG`) REFERENCES `tb_loaiphong` (`idloaiphong`),
  CONSTRAINT `tb_phong_ibfk_3` FOREIGN KEY (`IDDVI`) REFERENCES `tb_donvi` (`iddvi`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_phong`
--

LOCK TABLES `tb_phong` WRITE;
/*!40000 ALTER TABLE `tb_phong` DISABLE KEYS */;
INSERT INTO `tb_phong` VALUES (13,'P101',1,1,1,'Đang sử dụng','/uploads/rooms/room_1d4473db-2abe-4ddd-a030-e58ea04b6975.webp'),(14,'P102',1,2,1,'Trống','/uploads/rooms/room_aa251418-ec01-45bd-be92-9e898e7097e6.webp'),(16,'P103',1,4,1,'Trống','/rooms/room_1755593534221.jpg'),(17,'P201',2,1,1,'Đang sử dụng','/rooms/room_1755593583942.jpg'),(18,'P202',2,2,1,'Trống','/rooms/room_1755593619812.jpg'),(19,'P203',2,4,1,'Trống','/rooms/room_1755593660060.jpg');
/*!40000 ALTER TABLE `tb_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_phong_thietbi`
--

DROP TABLE IF EXISTS `tb_phong_thietbi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_phong_thietbi` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `IDPHONG` int(11) DEFAULT NULL,
  `IDTB` int(11) DEFAULT NULL,
  `SOLUONG` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDPHONG` (`IDPHONG`),
  KEY `IDTB` (`IDTB`),
  CONSTRAINT `tb_phong_thietbi_ibfk_1` FOREIGN KEY (`IDPHONG`) REFERENCES `tb_phong` (`idphong`),
  CONSTRAINT `tb_phong_thietbi_ibfk_2` FOREIGN KEY (`IDTB`) REFERENCES `tb_thietbi` (`idtb`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_phong_thietbi`
--

LOCK TABLES `tb_phong_thietbi` WRITE;
/*!40000 ALTER TABLE `tb_phong_thietbi` DISABLE KEYS */;
INSERT INTO `tb_phong_thietbi` VALUES (5,13,1,1),(6,13,2,1),(7,13,3,1),(8,14,2,1),(9,14,3,1),(10,16,3,1),(11,16,5,1),(12,17,2,1);
/*!40000 ALTER TABLE `tb_phong_thietbi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_roles`
--

DROP TABLE IF EXISTS `tb_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_roles` (
  `IDROLE` int(11) NOT NULL AUTO_INCREMENT,
  `ROLENAME` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`IDROLE`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_roles`
--

LOCK TABLES `tb_roles` WRITE;
/*!40000 ALTER TABLE `tb_roles` DISABLE KEYS */;
INSERT INTO `tb_roles` VALUES (1,'USER'),(2,'ADMIN');
/*!40000 ALTER TABLE `tb_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_sanpham`
--

DROP TABLE IF EXISTS `tb_sanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_sanpham` (
  `IDSP` int(11) NOT NULL AUTO_INCREMENT,
  `TENSP` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `DONGIA` decimal(10,2) DEFAULT NULL,
  `MOTA` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`IDSP`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_sanpham`
--

LOCK TABLES `tb_sanpham` WRITE;
/*!40000 ALTER TABLE `tb_sanpham` DISABLE KEYS */;
INSERT INTO `tb_sanpham` VALUES (1,'Nước khoáng',15000.00,'Nước khoáng 500ml'),(2,'Bánh snack',25000.00,'Bánh snack các loại'),(3,'Cà phê',35000.00,'Cà phê sữa đá');
/*!40000 ALTER TABLE `tb_sanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_tang`
--

DROP TABLE IF EXISTS `tb_tang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_tang` (
  `IDTANG` int(11) NOT NULL AUTO_INCREMENT,
  `TENTANG` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `IDDVI` int(11) DEFAULT NULL,
  PRIMARY KEY (`IDTANG`),
  KEY `IDDVI` (`IDDVI`),
  CONSTRAINT `tb_tang_ibfk_1` FOREIGN KEY (`IDDVI`) REFERENCES `tb_donvi` (`iddvi`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_tang`
--

LOCK TABLES `tb_tang` WRITE;
/*!40000 ALTER TABLE `tb_tang` DISABLE KEYS */;
INSERT INTO `tb_tang` VALUES (1,'Tầng 1',1),(2,'Tầng 2',1),(3,'Tầng 3',1);
/*!40000 ALTER TABLE `tb_tang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_thanhtoan`
--

DROP TABLE IF EXISTS `tb_thanhtoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_thanhtoan` (
  `IDTT` int(11) NOT NULL AUTO_INCREMENT,
  `IDDATPHONG` int(11) DEFAULT NULL,
  `NGAYTT` date DEFAULT NULL,
  `NGAYDAT` date DEFAULT NULL,
  `NGAYTRA` date DEFAULT NULL,
  `SOTIEN` decimal(10,2) DEFAULT NULL,
  `HINHTHUCTT` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `TRANGTHAI` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`IDTT`),
  KEY `IDDATPHONG` (`IDDATPHONG`),
  CONSTRAINT `tb_thanhtoan_ibfk_1` FOREIGN KEY (`IDDATPHONG`) REFERENCES `tb_datphong` (`iddatphong`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_thanhtoan`
--

LOCK TABLES `tb_thanhtoan` WRITE;
/*!40000 ALTER TABLE `tb_thanhtoan` DISABLE KEYS */;
INSERT INTO `tb_thanhtoan` VALUES (10,15,'2025-08-15','2025-10-21','2025-10-22',500000.00,'payment','Chờ thanh toán'),(13,19,'2025-08-17','2025-08-17','2025-08-18',500000.00,'payment','Chờ thanh toán'),(15,21,'2025-08-18','2025-12-18','2025-12-19',800000.00,'payment','Đã thanh toán'),(16,22,'2025-08-18','2025-12-20','2025-12-21',800000.00,'payment','Chờ thanh toán'),(19,32,'2025-08-28','2025-08-30','2025-08-31',815000.00,'payment','Đã thanh toán'),(20,33,'2025-08-28','2025-12-20','2025-12-21',500000.00,'payment','Chờ thanh toán'),(21,34,'2025-08-28','2025-12-22','2025-12-23',800000.00,'payment','Đã thanh toán');
/*!40000 ALTER TABLE `tb_thanhtoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_thietbi`
--

DROP TABLE IF EXISTS `tb_thietbi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_thietbi` (
  `IDTB` int(11) NOT NULL AUTO_INCREMENT,
  `TENTB` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `MOTA` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`IDTB`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_thietbi`
--

LOCK TABLES `tb_thietbi` WRITE;
/*!40000 ALTER TABLE `tb_thietbi` DISABLE KEYS */;
INSERT INTO `tb_thietbi` VALUES (1,'Tủ lạnh','Tủ lạnh mini'),(2,'TV','Tivi 32 inch'),(3,'Điều hòa','Điều hòa 1 chiều'),(5,'Lò vi sóng','Lò vi sóng');
/*!40000 ALTER TABLE `tb_thietbi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_users`
--

DROP TABLE IF EXISTS `tb_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tb_users` (
  `IDUSER` int(11) NOT NULL AUTO_INCREMENT,
  `USERNAME` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `PASSWORD` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `EMAIL` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `SODIENTHOAI` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `DIACHI` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `IDROLE` int(11) DEFAULT NULL,
  PRIMARY KEY (`IDUSER`),
  KEY `IDROLE` (`IDROLE`),
  CONSTRAINT `tb_users_ibfk_1` FOREIGN KEY (`IDROLE`) REFERENCES `tb_roles` (`idrole`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_users`
--

LOCK TABLES `tb_users` WRITE;
/*!40000 ALTER TABLE `tb_users` DISABLE KEYS */;
INSERT INTO `tb_users` VALUES (1,'admin','$2a$10$ogt8sD2v8IMmvm1Tyu7Iburg6uqTzu5ckxwAHAqv8sHmgfRTBLQ/u','admin@hotel.com','0929352067','123',2),(2,'user','$2a$10$YbdZNKzlLGRPZZ5yVbOFYulnau9sBRh9IAdSRYvJJCCTUquAjku/m','user@hotel.com',NULL,NULL,1),(3,'thanh','$2a$10$JuLYUumV1XgjwC0kpJv3KuOAyxH2WObYhv..hCqtZyWg3JLfFgKQm','nvt@gmail.com','01234990587','123',1),(4,'nhokbok','$2a$10$6Qsq5V/ATDLZUVH0MRr95OXYg15cEimxnDwmmjmKIFFHP4qh8KeKy','n@gmail.com','0929352067','123',1),(6,'thanhka','$2a$10$G.9Tbr3yk7gojan0Zq076OKW2I4xuzO359nzwu0jvq.KZBxXQATlq','nvt11@gmail.com','01234990587','123',1);
/*!40000 ALTER TABLE `tb_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-05 23:45:20
