package com.parking.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parking.dto.DashboardMovimientoHoraDTO;
import com.parking.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/movimientos-hoy")
    public ResponseEntity<List<DashboardMovimientoHoraDTO>> obtenerMovimientosHoy() {
        return ResponseEntity.ok(dashboardService.obtenerMovimientosHoy());
    }
}
