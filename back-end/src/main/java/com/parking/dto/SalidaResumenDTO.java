package com.parking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SalidaResumenDTO {

    private Long espacioId;
    private String codigoEspacio;
    private String codigoTicket;
    private String placa;
    private String tipoVehiculo;
    private LocalDateTime horaEntrada;
    private long minutosEstadia;
    private BigDecimal montoTotal;
}
