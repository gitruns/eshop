package com.mayushii.payment_service.controller;

import com.mayushii.payment_service.model.PaymentRequest;
import com.mayushii.payment_service.service.impl.PaymentServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/payments")
@RestController
public class PaymentController {
    private PaymentServiceImpl paymentService;

    PaymentController(PaymentServiceImpl paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/do-payment")
    public ResponseEntity<Long> doPayment(@RequestBody PaymentRequest paymentRequest) {
        Long transactionId = paymentService.doPayment(paymentRequest);
        return ResponseEntity.ok(transactionId);
    }
}
