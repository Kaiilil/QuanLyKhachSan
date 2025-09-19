package com.holtel.hotel_management.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/test/**").permitAll()
                // API endpoints - allow public access for development
                //// Protected endpoints - require authentication
                // .requestMatchers("/api/users/**").authenticated()
                // .requestMatchers("/api/roles/**").authenticated()
                // .requestMatchers("/api/khachhang/**").authenticated()
                // .requestMatchers("/api/phong/**").authenticated()
                // .requestMatchers("/api/datphong/**").authenticated()
                // .requestMatchers("/api/loaiphong/**").authenticated()
                // .requestMatchers("/api/congty/**").authenticated()
                // .requestMatchers("/api/tang/**").authenticated()
                // .requestMatchers("/api/donvi/**").authenticated()
                // .requestMatchers("/api/thanhtoan/**").authenticated()
                // .requestMatchers("/api/sanpham/**").authenticated()
                // .requestMatchers("/api/thietbi/**").authenticated()
                // .requestMatchers("/api/phongthietbi/**").authenticated()
                // .requestMatchers("/api/lichsuphong/**").authenticated()
                // .requestMatchers("/api/datphongsanpham/**").authenticated()
                // .requestMatchers("/api/dudoaikhach/**").authenticated()
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/api/roles/**").permitAll()
                .requestMatchers("/api/khachhang/**").permitAll()
                .requestMatchers("/api/phong/**").permitAll()
                .requestMatchers("/api/datphong/**").permitAll()
                .requestMatchers("/api/loaiphong/**").permitAll()
                .requestMatchers("/api/congty/**").permitAll()
                .requestMatchers("/api/tang/**").permitAll()
                .requestMatchers("/api/donvi/**").permitAll()
                .requestMatchers("/api/thanhtoan/**").permitAll()
                .requestMatchers("/api/sanpham/**").permitAll()
                .requestMatchers("/api/thietbi/**").permitAll()
                .requestMatchers("/api/phongthietbi/**").permitAll()
                .requestMatchers("/api/lichsuphong/**").permitAll()
                .requestMatchers("/api/datphongsanpham/**").permitAll()
                .requestMatchers("/api/dudoaikhach/**").permitAll()
                // Allow all other requests for now (can be restricted later)
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 