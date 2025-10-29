package com.mayushii.order_service.service;

import com.mayushii.order_service.model.OrderRequest;

public interface OrderService {
    Long placeOrder(OrderRequest orderRequest);
}
