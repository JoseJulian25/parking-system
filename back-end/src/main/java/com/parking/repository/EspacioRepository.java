package com.parking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parking.entity.Espacio;

@Repository
public interface EspacioRepository extends JpaRepository<Espacio, Long> {

    List<Espacio> findAllByActivoTrueOrderByIdAsc();

    List<Espacio> findAllByActivoFalseOrderByIdAsc();

    Optional<Espacio> findByIdAndActivoTrue(Long id);

    Optional<Espacio> findByIdAndActivoFalse(Long id);

    List<Espacio> findByCodigoEspacioStartingWith(String prefijo);
}
