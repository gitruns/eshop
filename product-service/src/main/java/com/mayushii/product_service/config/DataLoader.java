package com.mayushii.product_service.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mayushii.product_service.entity.Product;
import com.mayushii.product_service.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner commandLineRunner(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                RestTemplate restTemplate = new RestTemplate();
                ObjectMapper objectMapper = new ObjectMapper();
                String url = "https://api.escuelajs.co/api/v1/products";
                String jsonResponse = restTemplate.getForObject(url, String.class);

                JsonNode root = objectMapper.readTree(jsonResponse);
                List<Product> productsToSave = new ArrayList<>();
                Random random = new Random();

                for (JsonNode node : root) {
                    Product product = new Product();
                    product.setId(node.get("id").asLong());
                    product.setProductName(node.get("title").asText());
                    product.setPrice(new BigDecimal(node.get("price").asDouble()));
                    product.setDescription(node.get("description").asText());

                    // Assign a random quantity between 10 and 100
                    product.setQuantity(10L + random.nextInt(91));

                    // Extract category ID
                    if (node.has("category") && node.get("category").has("id")) {
                        product.setCategoryId(node.get("category").get("id").asLong());
                    }

                    // Extract images
                    List<String> images = objectMapper.convertValue(
                            node.get("images"),
                            new TypeReference<List<String>>() {
                            });
                    product.setImages(images);

                    productsToSave.add(product);
                }

                productRepository.saveAll(productsToSave);
                System.out.println("Loaded " + productsToSave.size() + " products into the database.");
            }
        };
    }
}