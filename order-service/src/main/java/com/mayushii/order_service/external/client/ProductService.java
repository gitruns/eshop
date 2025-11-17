package com.mayushii.order_service.external.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "product-service", path = "/api/products")
public interface ProductService {
    @PutMapping("/{id}/reduce-quantity")
    public ResponseEntity<Void> reduceQuantity(@PathVariable Long id,
            @RequestParam("quantity") Long quantity);
}
