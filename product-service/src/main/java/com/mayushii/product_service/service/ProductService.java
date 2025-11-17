package com.mayushii.product_service.service;

import com.mayushii.product_service.model.ProductRequest;
import com.mayushii.product_service.model.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse addProduct(ProductRequest productRequest);

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(Long id);

    void reduceQuantity(Long id, Long quantity);
}
