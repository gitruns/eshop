package com.mayushii.category_service.config;

import com.mayushii.category_service.entity.Category;
import com.mayushii.category_service.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner commandLineRunner(CategoryRepository categoryRepository) {
        return args -> {
            // Only load data if the database is empty
            if (categoryRepository.count() == 0) {
                RestTemplate restTemplate = new RestTemplate();
                String url = "https://api.escuelajs.co/api/v1/categories";
                Category[] categories = restTemplate.getForObject(url, Category[].class);

                if (categories != null) {
                    categoryRepository.saveAll(Arrays.asList(categories));
                    System.out.println("Loaded " + categories.length + " categories into the database.");
                }
            }
        };
    }
}