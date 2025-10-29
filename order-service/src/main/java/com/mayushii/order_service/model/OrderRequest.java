package com.mayushii.order_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Long productId;
    private Long quantity;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
}
