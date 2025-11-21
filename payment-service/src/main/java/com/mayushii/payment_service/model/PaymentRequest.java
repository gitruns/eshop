package com.mayushii.payment_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Data
public class PaymentRequest {
    private Long orderId;
    private BigDecimal amount;
    private String referenceNumber;
    private PaymentMethod paymentMode;
}
