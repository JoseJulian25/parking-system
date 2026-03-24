package com.parking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parking.entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findTopByEspacioIdAndEstadoNombreIgnoreCaseOrderByHoraEntradaDesc(Long espacioId, String estadoNombre);
}
