package com.parking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parking.entity.EstadoTicket;

@Repository
public interface EstadoTicketRepository extends JpaRepository<EstadoTicket, Integer> {

    Optional<EstadoTicket> findByNombreIgnoreCase(String nombre);
}
