package com.parking.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parking.dto.SalidaCobroDTO;
import com.parking.dto.SalidaCobroResponseDTO;
import com.parking.dto.SalidaResumenDTO;
import com.parking.service.SalidaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/salidas")
@Validated
public class SalidaController {

    private final SalidaService salidaService;

    public SalidaController(SalidaService salidaService) {
        this.salidaService = salidaService;
    }

    @GetMapping("/espacio/{espacioId}/resumen")
    public ResponseEntity<SalidaResumenDTO> obtenerResumen(@PathVariable Long espacioId) {
        return ResponseEntity.ok(salidaService.obtenerResumen(espacioId));
    }

    @PostMapping("/cobro")
    public ResponseEntity<SalidaCobroResponseDTO> procesarCobro(@Valid @RequestBody SalidaCobroDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salidaService.procesarCobro(dto));
    }
}
