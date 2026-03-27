package com.parking.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddEspaciosLoteDTO {

    @NotNull(message = "cantidadCarros es obligatoria")
    @Min(0)
    private Integer cantidadCarros;

    @NotNull(message = "cantidadMotos es obligatoria")
    @Min(0)
    private Integer cantidadMotos;

    @AssertTrue(message = "Debes agregar al menos un espacio")
    public boolean isCantidadTotalValida() {
        if (cantidadCarros == null || cantidadMotos == null) {
            return true;
        }
        return (cantidadCarros + cantidadMotos) > 0;
    }
}
