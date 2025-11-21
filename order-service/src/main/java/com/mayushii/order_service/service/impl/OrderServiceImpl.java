package com.mayushii.order_service.service.impl;

import com.mayushii.order_service.entity.Order;
import com.mayushii.order_service.external.client.PaymentService;
import com.mayushii.order_service.external.client.ProductService;
import com.mayushii.order_service.model.OrderStatus;
import com.mayushii.order_service.repository.OrderRepository;
import com.mayushii.order_service.service.OrderService;
import com.mayushii.order_service.model.OrderRequest;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final PaymentService paymentService;

    OrderServiceImpl(OrderRepository orderRepository, ProductService productService, PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.paymentService = paymentService;
    }

    @Override
    @Transactional
    public Long placeOrder(OrderRequest orderRequest) {
        log.info("Starting order placement for productId: {}, quantity: {}, amount: {}",
                orderRequest.getProductId(), orderRequest.getQuantity(), orderRequest.getAmount());

        // 1. reduce the quantity by calling the product service
        productService.reduceQuantity(orderRequest.getProductId(), orderRequest.getQuantity());

        // 2. save the order details to the db with status CREATED
        Order order = new Order();
        order.setAmount(orderRequest.getAmount());
        order.setProductId(orderRequest.getProductId());
        order.setQuantity(orderRequest.getQuantity());
        order.setOrderDate(Instant.now());
        order.setOrderStatus(OrderStatus.CREATED.name());

        order = orderRepository.save(order);
        log.info("Order saved with id: {}, status: {}", order.getId(), order.getOrderStatus());

        // 3. call the payment service to process payment
        try {
            PaymentService.PaymentRequest paymentRequest = new PaymentService.PaymentRequest();
            paymentRequest.setOrderId(order.getId());
            paymentRequest.setAmount(orderRequest.getAmount());
            paymentRequest.setReferenceNumber(UUID.randomUUID().toString());
            paymentRequest.setPaymentMode(orderRequest.getPaymentMethod());

            var paymentResponse = paymentService.doPayment(paymentRequest);
            Long transactionId = paymentResponse.getBody();

            // Payment successful - update order status to PLACED
            order.setOrderStatus(OrderStatus.PLACED.name());
            order.setOrderDate(Instant.now()); // update timestamp
            orderRepository.save(order);

            log.info("Payment successful for orderId: {}, transactionId: {}, updated status to: {}",
                    order.getId(), transactionId, order.getOrderStatus());

        } catch (FeignException e) {
            // Payment failed - update order status to PAYMENT_FAILED
            order.setOrderStatus(OrderStatus.PAYMENT_FAILED.name());
            order.setOrderDate(Instant.now());
            orderRepository.save(order);

            log.error("Payment failed for orderId: {}, error: {}", order.getId(), e.getMessage());
            throw new RuntimeException("Payment processing failed: " + e.getMessage(), e);
        }

        return order.getId();
    }
}
