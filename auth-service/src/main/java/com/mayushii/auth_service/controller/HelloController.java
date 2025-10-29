package com.mayushii.auth_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/")
    public String hello() {
        return "Hello from Security >:)";
    }

    @PostMapping("/")
    public String post() {
        return "Post Sec";
    }
}
