package com.parking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateEstadoEspacioDTO {

    @NotBlank
    private String estado;
}
