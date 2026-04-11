package com.parking.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EntradaVehiculoResponseDTO {

    private String codigoTicket;
    private String placa;
    private String tipoVehiculo;
    private Long espacioId;
    private String codigoEspacio;
    private String estadoTicket;
    private LocalDateTime horaEntrada;
}
