package com.mayushii.order_service.service.impl;

import com.mayushii.order_service.entity.Order;
import com.mayushii.order_service.external.client.PaymentService;
import com.mayushii.order_service.external.client.ProductService;
import com.mayushii.order_service.model.CheckoutRequest;
import com.mayushii.order_service.model.OrderStatus;
import com.mayushii.order_service.model.PaymentMethod;
import com.mayushii.order_service.repository.OrderRepository;
import com.mayushii.order_service.service.OrderService;
import com.mayushii.order_service.model.OrderRequest;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
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

    @Override
    @Transactional
    public Long checkoutOrder(CheckoutRequest checkoutRequest) {
        log.info("Starting checkout for {} items, total amount: {}",
                checkoutRequest.getCartItems().size(), checkoutRequest.getTotalAmount());

        Long firstOrderId = null;

        // Process each cart item as a separate order
        for (CheckoutRequest.CartItem cartItem : checkoutRequest.getCartItems()) {
            try {
                // Reduce product quantity
                productService.reduceQuantity(cartItem.getProductId(), cartItem.getQuantity().longValue());

                // Create order
                Order order = new Order();
                order.setAmount(cartItem.getPrice().multiply(new java.math.BigDecimal(cartItem.getQuantity())));
                order.setProductId(cartItem.getProductId());
                order.setQuantity(cartItem.getQuantity().longValue());
                order.setOrderDate(Instant.now());
                order.setOrderStatus(OrderStatus.CREATED.name());

                order = orderRepository.save(order);
                if (firstOrderId == null) {
                    firstOrderId = order.getId();
                }

                log.info("Order saved with id: {}, status: {}", order.getId(), order.getOrderStatus());
            } catch (Exception e) {
                log.error("Failed to process order item: productId={}, quantity={}",
                        cartItem.getProductId(), cartItem.getQuantity(), e);
                throw new RuntimeException("Order processing failed: " + e.getMessage(), e);
            }
        }

        // Process payment for the entire checkout
        try {
            PaymentService.PaymentRequest paymentRequest = new PaymentService.PaymentRequest();
            paymentRequest.setOrderId(firstOrderId);
            paymentRequest.setAmount(checkoutRequest.getTotalAmount());
            paymentRequest.setReferenceNumber(UUID.randomUUID().toString());
            // Map the payment method from checkout to existing PaymentMethod enum
            PaymentMethod paymentMethod = PaymentMethod.valueOf(checkoutRequest.getPaymentInfo().getMethod());
            paymentRequest.setPaymentMode(paymentMethod);

            var paymentResponse = paymentService.doPayment(paymentRequest);
            Long transactionId = paymentResponse.getBody();

            // Update all orders to PLACED status
            List<Order> orders = orderRepository.findByOrderStatus(OrderStatus.CREATED.name());
            for (Order order : orders) {
                if (order.getId() >= firstOrderId) { // Assuming sequential IDs
                    order.setOrderStatus(OrderStatus.PLACED.name());
                    order.setOrderDate(Instant.now());
                    orderRepository.save(order);
                }
            }

            log.info("Payment successful for checkout, first order ID: {}, transactionId: {}",
                    firstOrderId, transactionId);

        } catch (FeignException e) {
            // Payment failed - update all orders to PAYMENT_FAILED
            List<Order> orders = orderRepository.findByOrderStatus(OrderStatus.CREATED.name());
            for (Order order : orders) {
                if (order.getId() >= firstOrderId) {
                    order.setOrderStatus(OrderStatus.PAYMENT_FAILED.name());
                    order.setOrderDate(Instant.now());
                    orderRepository.save(order);
                }
            }

            log.error("Payment failed for checkout starting orderId: {}, error: {}", firstOrderId, e.getMessage());
            throw new RuntimeException("Payment processing failed: " + e.getMessage(), e);
        }

        return firstOrderId;
    }
}
