package com.mayushii.product_service.exception;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductServiceException extends RuntimeException {
    private String errorCode;

    public ProductServiceException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

}
