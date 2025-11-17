package com.mayushii.category_service.service.impl;

import com.mayushii.category_service.entity.Category;
import com.mayushii.category_service.model.CategoryResponse;
import com.mayushii.category_service.repository.CategoryRepository;
import com.mayushii.category_service.service.CategoryService;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    private CategoryResponse toCategoryResponse(Category category) {
        CategoryResponse categoryResponse = new CategoryResponse();
        BeanUtils.copyProperties(category, categoryResponse);
        return categoryResponse;
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toCategoryResponse).toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        return toCategoryResponse(category);
    }
}
