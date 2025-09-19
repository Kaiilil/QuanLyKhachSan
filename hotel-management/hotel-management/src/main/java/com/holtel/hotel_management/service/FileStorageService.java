package com.holtel.hotel_management.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file, String filename, String subDirectory) throws IOException {
        // Tạo thư mục upload nếu chưa tồn tại
        Path uploadPath = Paths.get(uploadDir, subDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Tạo đường dẫn file
        Path filePath = uploadPath.resolve(filename);
        
        // Lưu file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Trả về đường dẫn tương đối để lưu vào database
        return "/" + subDirectory + "/" + filename;
    }

    public void deleteFile(String filePath) throws IOException {
        if (filePath != null && !filePath.isEmpty()) {
            Path fullPath = Paths.get(uploadDir, filePath.substring(1)); // Bỏ dấu / đầu tiên
            if (Files.exists(fullPath)) {
                Files.delete(fullPath);
            }
        }
    }
}
