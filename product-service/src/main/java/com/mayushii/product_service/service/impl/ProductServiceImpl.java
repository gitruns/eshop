package com.mayushii.product_service.service.impl;

import com.mayushii.product_service.entity.Product;
import com.mayushii.product_service.exception.ProductServiceException;
import com.mayushii.product_service.model.ProductRequest;
import com.mayushii.product_service.model.ProductResponse;
import com.mayushii.product_service.repository.ProductRepository;
import com.mayushii.product_service.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.beans.BeanUtils.copyProperties;

@Slf4j
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
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

        return products.stream().map(product -> {
            ProductResponse productResponse = new ProductResponse();
            copyProperties(product, productResponse);
            return productResponse;
        }).toList();
    }

    @Override
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ProductServiceException("Product not found with id: "+ productId, "PRODUCT_NOT_FOUND"));

        ProductResponse productResponse = new ProductResponse();
        copyProperties(product, productResponse);

        return productResponse;
    }

    @Override
    public void reduceQuantity(Long productId, Long quantity) {
        // get the product by id or else throw exception
        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ProductServiceException("Product not found with id: "+ productId, "PRODUCT_NOT_FOUND"));

        // check the quantity request must be less than available quantity
        if (product.getQuantity() < quantity) {
            throw new ProductServiceException("Insufficient quantity for id: "+ productId, "INSUFFICIENT_QUANTITY");
        } else {
            product.setQuantity(product.getQuantity()-quantity);
            productRepository.save(product);
        }
    }
}
