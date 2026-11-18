package br.com.patio.auth.dto;

import br.com.patio.user.dto.UserResponse;
import java.time.Instant;

public record LoginResponse(
        String token,
        String tokenType,
        Instant expiresAt,
        UserResponse user
) {
}
