package com.mayushii.order_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    private List<CartItem> cartItems;
    private ShippingInfo shippingInfo;
    private PaymentInfo paymentInfo;
    private BigDecimal totalAmount;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItem {
        private Long productId;
        private String name;
        private Integer quantity;
        private BigDecimal price;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingInfo {
        private String firstName;
        private String lastName;
        private String email;
        private String address;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentInfo {
        private String cardNumber;
        private String expiryMonth;
        private String expiryYear;
        private String cvv;
        private String nameOnCard;
        private String method;
    }
}
