package com.mayushii.payment_service.service.impl;

import com.mayushii.payment_service.entity.TransactionDetail;
import com.mayushii.payment_service.model.PaymentRequest;
import com.mayushii.payment_service.repository.PaymentRepository;
import com.mayushii.payment_service.service.PaymentService;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class PaymentServiceImpl implements PaymentService {
    private PaymentRepository paymentRepository;

    PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Long doPayment(PaymentRequest paymentRequest) {
        TransactionDetail transactionDetail = new TransactionDetail();
        transactionDetail.setOrderId(paymentRequest.getOrderId());
        transactionDetail.setAmount(paymentRequest.getAmount());
        transactionDetail.setPaymentDate(Instant.now());
        transactionDetail.setPaymentMode(paymentRequest.getPaymentMode().name());
        transactionDetail.setReferenceNumber(paymentRequest.getReferenceNumber());
        transactionDetail.setPaymentStatus("SUCCESS");
        transactionDetail = paymentRepository.save(transactionDetail);
        return transactionDetail.getId();
    }
}
