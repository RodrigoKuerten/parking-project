package br.com.patio.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "Enter your current password")
        @Size(max = 72, message = "The password must have at most 72 characters")
        String currentPassword,

        @NotBlank(message = "Enter the new password")
        @Size(min = 8, max = 72, message = "The password must have 8 to 72 characters")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,72}$",
                message = "The password must include at least one letter and one number")
        String newPassword
) {
}
