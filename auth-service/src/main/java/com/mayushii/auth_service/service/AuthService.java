package com.mayushii.auth_service.service;

import com.mayushii.auth_service.payload.LoginDto;
import com.mayushii.auth_service.payload.RegisterDto;

public interface AuthService {
    String login(LoginDto loginDto);
    String register(RegisterDto registerDto);
}
