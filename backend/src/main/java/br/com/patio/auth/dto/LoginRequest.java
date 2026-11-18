package br.com.patio.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Enter your email address")
        @Email(message = "Enter a valid email address")
        @Size(max = 160, message = "The email must have at most 160 characters")
        String email,

        @NotBlank(message = "Enter your password")
        @Size(max = 72, message = "The password must have at most 72 characters")
        String password
) {
}
