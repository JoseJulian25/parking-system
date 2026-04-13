package com.parking.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parking.entity.Pago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

	List<Pago> findAllByHoraPagoGreaterThanEqualAndHoraPagoLessThan(LocalDateTime horaDesde, LocalDateTime horaHasta);

	List<Pago> findAllByTicket_PlacaIgnoreCase(String placa);

	Optional<Pago> findFirstByTicket_Id(Long ticketId);
}
