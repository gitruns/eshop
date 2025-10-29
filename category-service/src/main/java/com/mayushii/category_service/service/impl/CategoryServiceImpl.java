package com.mayushii.category_service.service.impl;

import com.mayushii.category_service.repository.CategoryRepository;
import com.mayushii.category_service.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
}
