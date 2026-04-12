package com.parking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReservaCancelacionDTO {

    @NotBlank(message = "El motivo de cancelacion es requerido")
    @Size(max = 300, message = "El motivo de cancelacion no puede exceder 300 caracteres")
    private String motivoCancelacion;
}
