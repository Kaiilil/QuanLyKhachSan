package com.holtel.hotel_management.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.holtel.hotel_management.entity.Users;
import com.holtel.hotel_management.repository.UsersRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepository.findByUsernameWithRole(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new User(
            user.getUsername(),
            user.getPassword(),
            getAuthorities(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(Users user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        if (user.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName().toUpperCase()));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }
        
        return authorities;
    }
} 