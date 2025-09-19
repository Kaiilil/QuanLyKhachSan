package com.holtel.hotel_management.enums;

public enum UserRole {
    USER(0, "Người dùng"),
    ADMIN(1, "Admin");
    
    private final Integer id;
    private final String name;
    
    UserRole(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
    
    public Integer getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public static UserRole fromId(Integer id) {
        for (UserRole role : values()) {
            if (role.getId().equals(id)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid role ID: " + id);
    }
} 