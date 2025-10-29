package com.mayushii.payment_service.service;

import com.mayushii.payment_service.model.PaymentRequest;

public interface PaymentService {
    Long doPayment(PaymentRequest paymentRequest);
}
