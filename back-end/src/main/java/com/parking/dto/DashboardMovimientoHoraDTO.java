package com.parking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardMovimientoHoraDTO {

    private Integer hora;
    private String etiquetaHora;
    private Integer entradas;
    private Integer salidas;
}
