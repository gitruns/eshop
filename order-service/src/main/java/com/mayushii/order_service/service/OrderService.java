package com.mayushii.order_service.service;

import com.mayushii.order_service.model.CheckoutRequest;
import com.mayushii.order_service.model.OrderRequest;

public interface OrderService {
    Long placeOrder(OrderRequest orderRequest);

    Long checkoutOrder(CheckoutRequest checkoutRequest);
}
