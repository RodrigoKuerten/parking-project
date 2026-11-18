package br.com.patio.user.dto;

import br.com.patio.user.UserRole;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        UserRole role,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime lastLoginAt
) {
    public static UserResponse from(br.com.patio.user.AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt(),
                user.getLastLoginAt()
        );
    }
}
