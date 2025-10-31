package com.mayushii.product_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String productName;
    private BigDecimal price;
    private Long quantity;
    private String description;
    private List<String> images;
    private CategoryDto category;
}
