package com.mayushii.category_service.service;

import java.util.List;

import com.mayushii.category_service.model.CategoryResponse;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long categoryId);
}
