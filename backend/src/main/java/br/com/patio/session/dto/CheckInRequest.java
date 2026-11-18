package br.com.patio.session.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CheckInRequest(
        @NotBlank(message = "Enter the vehicle license plate")
        @Size(max = 10, message = "The license plate must have at most 10 characters")
        String licensePlate,

        @NotBlank(message = "Enter the vehicle model")
        @Size(max = 80, message = "The model must have at most 80 characters")
        String model,

        @NotBlank(message = "Enter the vehicle color")
        @Size(max = 30, message = "The color must have at most 30 characters")
        String color,

        @Positive(message = "Invalid spot")
        Long spotId
) {
}
