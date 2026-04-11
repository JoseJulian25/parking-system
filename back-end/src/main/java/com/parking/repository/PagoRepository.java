package com.parking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parking.entity.Pago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
}
