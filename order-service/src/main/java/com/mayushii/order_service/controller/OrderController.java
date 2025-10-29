package com.mayushii.order_service.controller;

import com.mayushii.order_service.service.impl.OrderServiceImpl;
import com.mayushii.order_service.model.OrderRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/orders")
@RestController
public class OrderController {
    private OrderServiceImpl orderService;
    OrderController(OrderServiceImpl orderService) {
        this.orderService = orderService;
    }


    @PostMapping("/placed")
    public ResponseEntity<Long> placeOrder(@RequestBody OrderRequest orderRequest) {
        Long orderId = orderService.placeOrder(orderRequest);
        return new ResponseEntity<>(orderId, HttpStatus.CREATED);
    }
}
