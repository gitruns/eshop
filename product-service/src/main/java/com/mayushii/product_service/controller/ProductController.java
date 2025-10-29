package com.mayushii.product_service.controller;

import com.mayushii.product_service.model.ProductRequest;
import com.mayushii.product_service.model.ProductResponse;
import com.mayushii.product_service.service.impl.ProductServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/products")
@RestController
public class ProductController {
    private final ProductServiceImpl productService;
    ProductController(ProductServiceImpl productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> addProduct(@RequestBody ProductRequest productRequest) {
        ProductResponse productResponse = productService.addProduct(productRequest);
        return new ResponseEntity<>(productResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> productResponses = productService.getAllProducts();
        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse productResponse = productService.getProductById(id);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    @PutMapping("/{id}/reduce-quantity")
    public ResponseEntity<Void> reduceQuantity(@PathVariable Long id,
                                               @RequestParam("quantity") Long quantity) {
        productService.reduceQuantity(id, quantity);
        return ResponseEntity.noContent().build();
    }
}
