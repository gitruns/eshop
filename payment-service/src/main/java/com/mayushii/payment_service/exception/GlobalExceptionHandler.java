package com.mayushii.payment_service.exception;

import com.mayushii.payment_service.response.ErrorDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<ErrorDetail> handlePaymentException(PaymentException ex) {
        ErrorDetail errorDetail = new ErrorDetail(ex.getMessage(), ex.getErrorCode());
        return ResponseEntity.status(ex.getStatusCode()).body(errorDetail);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDetail> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorDetail errorDetail = new ErrorDetail(ex.getMessage(), "INVALID_REQUEST");
        return ResponseEntity.badRequest().body(errorDetail);
    }
}
