package com.mayushii.auth_service.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterDto {
    private String name;
    private String username;
    private String email;
    private String password;
    private String role;
}
