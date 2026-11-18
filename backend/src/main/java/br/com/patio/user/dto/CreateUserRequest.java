package br.com.patio.user.dto;

import br.com.patio.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "Enter the user name")
        @Size(max = 100, message = "The name must have at most 100 characters")
        String name,

        @NotBlank(message = "Enter the email address")
        @Email(message = "Enter a valid email address")
        @Size(max = 160, message = "The email must have at most 160 characters")
        String email,

        @NotBlank(message = "Enter a password")
        @Size(min = 8, max = 72, message = "The password must have 8 to 72 characters")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,72}$",
                message = "The password must include at least one letter and one number")
        String password,

        @NotNull(message = "Select a role")
        UserRole role
) {
}
