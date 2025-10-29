package com.mayushii.payment_service.repository;

import com.mayushii.payment_service.entity.TransactionDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<TransactionDetail, Long> {
}
