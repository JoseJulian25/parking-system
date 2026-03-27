package com.parking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parking.entity.EstadoEspacio;

@Repository
public interface EstadoEspacioRepository extends JpaRepository<EstadoEspacio, Integer> {

    Optional<EstadoEspacio> findByNombreIgnoreCase(String nombre);
}
