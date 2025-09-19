package com.holtel.hotel_management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {
    @NotBlank(message = "Username không được bỏ trống")
    @Pattern(regexp = "^[a-zA-Z0-9]{4,20}$", message = "Username chỉ chứa chữ cái, số và từ 4-20 ký tự")
    private String username;

    @NotBlank(message = "Email không được bỏ trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Password không được bỏ trống")
    private String password;

    @NotBlank(message = "Số điện thoại không được bỏ trống")
    @Pattern(regexp = "^[0-9]{9,11}$", message = "Số điện thoại phải là số và có 9-11 chữ số")
    private String soDienThoai;

    @NotBlank(message = "Địa chỉ không được bỏ trống")
    private String diaChi;
}