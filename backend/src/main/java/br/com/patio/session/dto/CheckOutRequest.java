package br.com.patio.session.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckOutRequest(
        @NotBlank(message = "Enter the vehicle license plate")
        String licensePlate
) {
}
