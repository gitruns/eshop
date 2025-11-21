package com.mayushii.payment_service.service.impl;

import com.mayushii.payment_service.entity.TransactionDetail;
import com.mayushii.payment_service.exception.PaymentException;
import com.mayushii.payment_service.model.PaymentMethod;
import com.mayushii.payment_service.model.PaymentRequest;
import com.mayushii.payment_service.repository.PaymentRepository;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        // Use a real meter registry for testing
        MeterRegistry meterRegistry = new SimpleMeterRegistry();

        // Create a real instance
        paymentService = new PaymentServiceImpl(paymentRepository, meterRegistry, 70, 100, 200);
    }

    @Test
    void testDoPayment_Success() {
        // Given
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setAmount(BigDecimal.valueOf(100.0));
        request.setReferenceNumber("REF123");
        request.setPaymentMode(PaymentMethod.CREDIT_CARD);

        TransactionDetail savedTransaction = new TransactionDetail();
        savedTransaction.setId(1L);
        when(paymentRepository.save(any(TransactionDetail.class))).thenReturn(savedTransaction);

        // Override success rate to 100% for this test
        ReflectionTestUtils.setField(paymentService, "successRate", 100);

        // When
        Long result = paymentService.doPayment(request);

        // Then
        assertEquals(1L, result);
        verify(paymentRepository).save(any(TransactionDetail.class));
    }

    @Test
    void testDoPayment_Failure() {
        // Given
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setAmount(BigDecimal.valueOf(100.0));
        request.setReferenceNumber("REF123");
        request.setPaymentMode(PaymentMethod.CREDIT_CARD);

        // Override success rate to 0% for this test
        ReflectionTestUtils.setField(paymentService, "successRate", 0);

        // When & Then
        assertThrows(PaymentException.class, () -> paymentService.doPayment(request));
        verify(paymentRepository, never()).save(any(TransactionDetail.class));
    }

    @Test
    void testDoPayment_InvalidAmount() {
        // Given
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setAmount(BigDecimal.valueOf(-100.0)); // Invalid amount
        request.setReferenceNumber("REF123");
        request.setPaymentMode(PaymentMethod.CREDIT_CARD);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> paymentService.doPayment(request));
        verify(paymentRepository, never()).save(any(TransactionDetail.class));
    }

    @Test
    void testDoPayment_InvalidOrderId() {
        // Given
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(null); // Invalid order ID
        request.setAmount(BigDecimal.valueOf(100.0));
        request.setReferenceNumber("REF123");
        request.setPaymentMode(PaymentMethod.CREDIT_CARD);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> paymentService.doPayment(request));
        verify(paymentRepository, never()).save(any(TransactionDetail.class));
    }

    @Test
    void testTransactionDetailCreation() {
        // Given
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setAmount(BigDecimal.valueOf(100.0));
        request.setReferenceNumber("REF123");
        request.setPaymentMode(PaymentMethod.CREDIT_CARD);

        ArgumentCaptor<TransactionDetail> captor = ArgumentCaptor.forClass(TransactionDetail.class);
        when(paymentRepository.save(captor.capture())).thenReturn(new TransactionDetail());

        // Override success rate to 100% for this test
        ReflectionTestUtils.setField(paymentService, "successRate", 100);

        // When
        paymentService.doPayment(request);

        // Then
        TransactionDetail captured = captor.getValue();
        assertEquals(1L, captured.getOrderId());
        assertEquals(BigDecimal.valueOf(100.0), captured.getAmount());
        assertEquals(PaymentMethod.CREDIT_CARD.name(), captured.getPaymentMode());
        assertEquals("REF123", captured.getReferenceNumber());
        assertEquals("SUCCESS", captured.getPaymentStatus());
        assertNotNull(captured.getPaymentDate());
    }

    @Test
    void testReferenceNumberGeneration() {
        // Given
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setAmount(BigDecimal.valueOf(100.0));
        request.setReferenceNumber(null); // No reference number provided
        request.setPaymentMode(PaymentMethod.CREDIT_CARD);

        ArgumentCaptor<TransactionDetail> captor = ArgumentCaptor.forClass(TransactionDetail.class);
        when(paymentRepository.save(captor.capture())).thenReturn(new TransactionDetail());

        // Override success rate to 100% for this test
        ReflectionTestUtils.setField(paymentService, "successRate", 100);

        // When
        paymentService.doPayment(request);

        // Then
        TransactionDetail captured = captor.getValue();
        assertNotNull(captured.getReferenceNumber());
        assertFalse(captured.getReferenceNumber().isEmpty());
        // Should be a UUID since not provided
        assertDoesNotThrow(() -> UUID.fromString(captured.getReferenceNumber()));
    }
}
