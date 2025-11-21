package com.mayushii.payment_service.service.impl;

import com.mayushii.payment_service.entity.TransactionDetail;
import com.mayushii.payment_service.exception.PaymentException;
import com.mayushii.payment_service.model.PaymentRequest;
import com.mayushii.payment_service.repository.PaymentRepository;
import com.mayushii.payment_service.service.PaymentService;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final Random random = new Random();

    private final int successRate;
    private final int minDelayMs;
    private final int maxDelayMs;

    private final Counter paymentSuccessCounter;
    private final Counter paymentFailureCounter;
    private final Timer paymentProcessingTimer;

    PaymentServiceImpl(PaymentRepository paymentRepository,
            MeterRegistry meterRegistry,
            @Value("${payment.simulation.success-rate:70}") int successRate,
            @Value("${payment.simulation.min-delay-ms:500}") int minDelayMs,
            @Value("${payment.simulation.max-delay-ms:2000}") int maxDelayMs) {
        this.paymentRepository = paymentRepository;
        this.successRate = successRate;
        this.minDelayMs = minDelayMs;
        this.maxDelayMs = maxDelayMs;

        this.paymentSuccessCounter = Counter.builder("payment.success.total")
                .description("Total successful payments")
                .register(meterRegistry);

        this.paymentFailureCounter = Counter.builder("payment.failure.total")
                .description("Total failed payments")
                .register(meterRegistry);

        this.paymentProcessingTimer = Timer.builder("payment.processing.duration")
                .description("Payment processing duration")
                .register(meterRegistry);
    }

    @Override
    public Long doPayment(PaymentRequest paymentRequest) {
        validatePaymentRequest(paymentRequest);

        try {
            return paymentProcessingTimer.recordCallable(() -> {
                // Simulate processing delay
                int delay = minDelayMs + random.nextInt(maxDelayMs - minDelayMs + 1);
                try {
                    Thread.sleep(delay);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.error("Payment processing interrupted for orderId: {}", paymentRequest.getOrderId(), e);
                    throw new PaymentException("Payment processing interrupted", "PAYMENT_INTERRUPTED",
                            HttpStatus.INTERNAL_SERVER_ERROR.value());
                }

                boolean isSuccess = random.nextInt(100) < successRate;

                log.info("Payment simulation for orderId: {}, amount: {}, success: {}",
                        paymentRequest.getOrderId(), paymentRequest.getAmount(), isSuccess);

                if (isSuccess) {
                    TransactionDetail transactionDetail = createTransactionDetail(paymentRequest, "SUCCESS");
                    transactionDetail = paymentRepository.save(transactionDetail);
                    paymentSuccessCounter.increment();
                    log.info("Payment successful, transactionId: {}", transactionDetail.getId());
                    return transactionDetail.getId();
                } else {
                    paymentFailureCounter.increment();
                    String failureReason = getRandomFailureReason();
                    log.warn("Payment failed for orderId: {}, reason: {}", paymentRequest.getOrderId(), failureReason);
                    throw new PaymentException(failureReason, "PAYMENT_FAILED", HttpStatus.BAD_REQUEST.value());
                }
            });
        } catch (Exception e) {
            if (e instanceof PaymentException) {
                throw (PaymentException) e;
            }
            throw new PaymentException("Payment processing error", "INTERNAL_ERROR",
                    HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private void validatePaymentRequest(PaymentRequest paymentRequest) {
        if (paymentRequest.getOrderId() == null || paymentRequest.getAmount() == null ||
                paymentRequest.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid payment request data");
        }
    }

    private TransactionDetail createTransactionDetail(PaymentRequest request, String status) {
        TransactionDetail transactionDetail = new TransactionDetail();
        transactionDetail.setOrderId(request.getOrderId());
        transactionDetail.setAmount(request.getAmount());
        transactionDetail.setPaymentDate(Instant.now());
        transactionDetail.setPaymentMode(request.getPaymentMode().name());
        transactionDetail.setReferenceNumber(
                request.getReferenceNumber() != null ? request.getReferenceNumber() : UUID.randomUUID().toString());
        transactionDetail.setPaymentStatus(status);
        return transactionDetail;
    }

    private String getRandomFailureReason() {
        String[] reasons = {
                "Insufficient funds",
                "Card expired",
                "Invalid card number",
                "Transaction timeout",
                "Bank declined"
        };
        return reasons[random.nextInt(reasons.length)];
    }
}
