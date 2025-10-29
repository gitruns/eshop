package com.mayushii.category_service.controller;

import com.mayushii.category_service.service.impl.CategoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping()
@RestController
public class CategoryController {
    @Autowired
    private CategoryServiceImpl categoryService;
}
