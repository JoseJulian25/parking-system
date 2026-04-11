package com.parking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaActivaDTO {

    private String codigoReserva;
    private String clienteNombreCompleto;
    private String placa;
    private String horaInicio;
}
