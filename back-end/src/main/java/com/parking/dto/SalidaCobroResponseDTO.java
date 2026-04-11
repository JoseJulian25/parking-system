package com.parking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SalidaCobroResponseDTO {

    private Long espacioId;
    private String codigoEspacio;
    private String codigoTicket;
    private String placa;
    private String tipoVehiculo;
    private LocalDateTime horaEntrada;
    private LocalDateTime horaSalida;
    private long minutosEstadia;
    private BigDecimal montoTotal;
    private String metodoPago;
    private BigDecimal montoRecibido;
    private BigDecimal cambio;
    private String estadoTicket;
}
