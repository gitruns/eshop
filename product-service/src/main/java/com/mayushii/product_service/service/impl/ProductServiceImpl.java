package com.mayushii.product_service.service.impl;

import com.mayushii.product_service.entity.Product;
import com.mayushii.product_service.exception.ProductServiceException;
import com.mayushii.product_service.external.client.CategoryService;
import com.mayushii.product_service.model.CategoryDto;
import com.mayushii.product_service.model.ProductRequest;
import com.mayushii.product_service.model.ProductResponse;
import com.mayushii.product_service.repository.ProductRepository;
import com.mayushii.product_service.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.springframework.beans.BeanUtils.copyProperties;

@Slf4j
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductServiceImpl(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    @Override
    public ProductResponse addProduct(ProductRequest productRequest) {
        Product product = new Product();
        // set
        product.setProductName(productRequest.getName());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());

        productRepository.save(product);
        ProductResponse productResponse = new ProductResponse();
        copyProperties(product, productResponse);
        return productResponse;
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();

        List<CategoryDto> categories = categoryService.getAllCategories();
        Map<Long, CategoryDto> categoryMap = categories.stream()
                .collect(Collectors.toMap(CategoryDto::getId, Function.identity()));

        return products.stream().map(product -> {
            ProductResponse productResponse = new ProductResponse();
            copyProperties(product, productResponse);
            productResponse.setCategory(categoryMap.get(product.getCategoryId()));
            return productResponse;
        }).toList();
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository
                .findById(id)
                .orElseThrow(
                        () -> new ProductServiceException("Product not found with id: " + id, "PRODUCT_NOT_FOUND"));

        ProductResponse productResponse = new ProductResponse();
        copyProperties(product, productResponse);

        CategoryDto category = categoryService.getCategoryById(product.getCategoryId());
        productResponse.setCategory(category);

        return productResponse;
    }

    @Override
    public void reduceQuantity(Long id, Long quantity) {
        // get the product by id or else throw exception
        Product product = productRepository
                .findById(id)
                .orElseThrow(() -> new ProductServiceException("Product not found with id: " + id,
                        "PRODUCT_NOT_FOUND"));

        // check the quantity request must be less than available quantity
        if (product.getQuantity() < quantity) {
            throw new ProductServiceException("Insufficient quantity for id: " + id, "INSUFFICIENT_QUANTITY");
        } else {
            product.setQuantity(product.getQuantity() - quantity);
            productRepository.save(product);
        }
    }

}
