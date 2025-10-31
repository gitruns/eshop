package com.mayushii.product_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product {
        @Id
        // @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String productName;
        private BigDecimal price;
        private Long quantity;
        @Column(length = 2000)
        private String description;
        private Long categoryId;

        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
        @Column(name = "image_url", length = 1000)
        private List<String> images;
}
