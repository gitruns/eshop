package com.mayushii.product_service.external.client;

import com.mayushii.product_service.model.CategoryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "category-service", path = "/api/categories")
public interface CategoryService {
    @GetMapping
    List<CategoryDto> getAllCategories();

    @GetMapping("/{id}")
    CategoryDto getCategoryById(@PathVariable("id") Long categoryId);
}
