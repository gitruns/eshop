package com.mayushii.auth_service.config;

import com.mayushii.auth_service.entity.Role;
import com.mayushii.auth_service.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner commandLineRunner(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                List<Role> roles = new ArrayList<>();

                Role userRole = new Role();
                userRole.setName("ROLE_USER");
                roles.add(userRole);

                Role adminRole = new Role();
                adminRole.setName("ROLE_ADMIN");
                roles.add(adminRole);

                roleRepository.saveAll(roles);
                System.out.println("Loaded " + roles.size() + " roles into the database.");
            }
        };
    }
}
