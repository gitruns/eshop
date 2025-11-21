package com.mayushii.order_service.external.client;

import com.mayushii.order_service.model.PaymentMethod;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigDecimal;

@FeignClient(name = "payment-service", path = "/api/payments")
public interface PaymentService {

    @PostMapping("/do-payment")
    public ResponseEntity<Long> doPayment(@RequestBody PaymentRequest paymentRequest);

    // Inner class for request
    @Data
    class PaymentRequest {
        private Long orderId;
        private BigDecimal amount;
        private String referenceNumber;
        private PaymentMethod paymentMode;
    }
}
