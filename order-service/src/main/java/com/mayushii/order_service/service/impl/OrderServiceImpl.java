package com.mayushii.order_service.service.impl;

import com.mayushii.order_service.entity.Order;
import com.mayushii.order_service.external.client.ProductService;
import com.mayushii.order_service.model.OrderStatus;
import com.mayushii.order_service.repository.OrderRepository;
import com.mayushii.order_service.service.OrderService;
import com.mayushii.order_service.model.OrderRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ProductService productService;

    OrderServiceImpl(OrderRepository orderRepository, ProductService productService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
    }

    @Override
    public Long placeOrder(OrderRequest orderRequest) {

        // 1. reduce or block the quantity by calling the product service
        productService.reduceQuantity(orderRequest.getProductId(), orderRequest.getQuantity());

        // 2. save the order details to the db and status as CREATED
        Order order = new Order();
        String ORDER_STATUS = OrderStatus.CREATED.name();
        order.setAmount(orderRequest.getAmount());
        order.setProductId(orderRequest.getProductId());
        order.setQuantity(orderRequest.getQuantity());
        order.setOrderDate(Instant.now());
        order.setOrderStatus(ORDER_STATUS);

        // 3. call the product service to reduce the inventory (block the quantity)
        order = orderRepository.save(order);

        // 3. call the payment service to make the payment; if success update the order
        // status to PLACED

        // 4. if payment fails update the order status to PAYMENT_FAILED

        return order.getId();
    }
}
