package com.parking.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PagoAnulacionResponseDTO {

    private String codigoTicket;
    private String placa;
    private String codigoEspacio;
    private String estadoTicket;
    private String estadoEspacio;
    private LocalDateTime horaEntrada;
}
