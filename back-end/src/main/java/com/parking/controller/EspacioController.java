package com.parking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parking.dto.AddEspaciosLoteDTO;
import com.parking.dto.EspacioResponseDTO;
import com.parking.dto.UpdateEstadoEspacioDTO;
import com.parking.service.EspacioService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/espacios")
@Validated
public class EspacioController {

	private final EspacioService espacioService;

	public EspacioController(EspacioService espacioService) {
		this.espacioService = espacioService;
	}

	@GetMapping
	public ResponseEntity<List<EspacioResponseDTO>> listarEspacios() {
		return ResponseEntity.ok(espacioService.listarEspacios());
	}

	@GetMapping("/inactivos")
	public ResponseEntity<List<EspacioResponseDTO>> listarEspaciosInactivos() {
		return ResponseEntity.ok(espacioService.listarEspaciosInactivos());
	}

	@PatchMapping("/{id}/estado")
	public ResponseEntity<EspacioResponseDTO> actualizarEstado(
			@PathVariable @Positive(message = "El id debe ser mayor a 0") Long id,
			@Valid @RequestBody UpdateEstadoEspacioDTO dto) {
		EspacioResponseDTO response = espacioService.actualizarEstado(id, dto.getEstado());
		return ResponseEntity.ok(response);
	}

	@PostMapping("/lote")
	public ResponseEntity<List<EspacioResponseDTO>> agregarLote(@Valid @RequestBody AddEspaciosLoteDTO dto) {
		List<EspacioResponseDTO> response = espacioService.agregarLote(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarEspacio(
			@PathVariable @Positive(message = "El id debe ser mayor a 0") Long id) {
		espacioService.eliminarEspacio(id);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{id}/activar")
	public ResponseEntity<EspacioResponseDTO> reactivarEspacio(
			@PathVariable @Positive(message = "El id debe ser mayor a 0") Long id) {
		EspacioResponseDTO response = espacioService.reactivarEspacio(id);
		return ResponseEntity.ok(response);
	}
}
