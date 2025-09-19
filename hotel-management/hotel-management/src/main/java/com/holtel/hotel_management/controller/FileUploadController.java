package com.holtel.hotel_management.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.holtel.hotel_management.service.FileStorageService;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping("/room-image")
    public ResponseEntity<String> uploadRoomImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File không được để trống");
            }

            // Kiểm tra định dạng file
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/"))) {
                return ResponseEntity.badRequest().body("Chỉ chấp nhận file ảnh");
            }

            // Tạo tên file duy nhất
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = "room_" + UUID.randomUUID().toString() + fileExtension;

            // Lưu file
            String filePath = fileStorageService.storeFile(file, filename, "rooms");

            return ResponseEntity.ok(filePath);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi upload file: " + e.getMessage());
        }
    }
    
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            // Thử tìm file trong thư mục rooms trước
            Path filePath = Paths.get(uploadDir, "rooms", filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            // Nếu không tìm thấy trong rooms, thử tìm trong thư mục gốc
            if (!resource.exists() || !resource.isReadable()) {
                filePath = Paths.get(uploadDir).resolve(filename).normalize();
                resource = new UrlResource(filePath.toUri());
            }
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else if (filename.toLowerCase().endsWith(".webp")) {
            return "image/webp";
        } else {
            return "application/octet-stream";
        }
    }
}
