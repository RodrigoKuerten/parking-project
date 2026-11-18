package br.com.patio.spot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SpotRequest(
        @NotBlank(message = "Enter the spot number")
        @Pattern(regexp = "[A-Za-z0-9-]{1,10}", message = "Use up to 10 letters, numbers, or hyphens")
        String number
) {
}
