package com.parking.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SalidaCobroDTO {

    @NotNull(message = "El id del espacio es requerido")
    private Long espacioId;

    @NotBlank(message = "El metodo de pago es requerido")
    private String metodoPago;

    @DecimalMin(value = "0.0", inclusive = true, message = "El monto recibido no puede ser negativo")
    private BigDecimal montoRecibido;
}
