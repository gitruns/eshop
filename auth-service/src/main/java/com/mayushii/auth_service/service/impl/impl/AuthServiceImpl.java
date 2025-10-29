package com.mayushii.auth_service.service.impl.impl;

import com.mayushii.auth_service.entity.Role;
import com.mayushii.auth_service.entity.User;
import com.mayushii.auth_service.payload.LoginDto;
import com.mayushii.auth_service.payload.RegisterDto;
import com.mayushii.auth_service.repository.RoleRepository;
import com.mayushii.auth_service.repository.UserRepository;
import com.mayushii.auth_service.security.JwtTokenProvider;
import com.mayushii.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public String login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsernameOrEmail(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
//        return "User logged in successfully";

        String token = jwtTokenProvider.generateToken(authentication);
        return token;
    }

    @Override
    public String register(RegisterDto registerDto) {
        // add check for username and email exist in db
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RuntimeException("Username is already in use!");
        }
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email already in use!");
        }

        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        // set roles
        Role userRole = roleRepository.findByName(registerDto.getRole())
                .orElseThrow(() -> new RuntimeException("No such role: " + registerDto.getRole()));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);

        return "User registered successfully";
    }
}
