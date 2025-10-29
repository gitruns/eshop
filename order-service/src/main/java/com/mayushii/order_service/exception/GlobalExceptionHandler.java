package com.mayushii.order_service.exception;

import com.mayushii.order_service.response.ErrorDetail;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorDetail> handleCustomException(CustomException ex) {
        ErrorDetail errorDetail = new ErrorDetail(ex.getMessage(), ex.getErrorCode());
        return ResponseEntity.status(ex.getStatusCode()).body(errorDetail);
    }
}
