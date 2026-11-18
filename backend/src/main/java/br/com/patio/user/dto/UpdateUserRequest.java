package br.com.patio.user.dto;

import br.com.patio.user.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @NotBlank(message = "Enter the user name")
        @Size(max = 100, message = "The name must have at most 100 characters")
        String name,

        @NotNull(message = "Select a role")
        UserRole role,

        boolean active,

        @Size(min = 8, max = 72, message = "The password must have 8 to 72 characters")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,72}$",
                message = "The password must include at least one letter and one number")
        String newPassword
) {
}
