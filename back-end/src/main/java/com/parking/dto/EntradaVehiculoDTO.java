package com.parking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EntradaVehiculoDTO {

    @NotBlank(message = "La placa es requerida")
    @Size(max = 20, message = "La placa no puede exceder 20 caracteres")
    private String placa;

    @NotBlank(message = "El tipo de vehiculo es requerido")
    @Size(max = 20, message = "El tipo de vehiculo no puede exceder 20 caracteres")
    private String tipoVehiculo;

    @NotNull(message = "El id del espacio es requerido")
    private Long espacioId;
}
