package com.holtel.hotel_management.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping
    public Map<String, Object> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "API is working!");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Hotel Management API");
        return response;
    }
} 