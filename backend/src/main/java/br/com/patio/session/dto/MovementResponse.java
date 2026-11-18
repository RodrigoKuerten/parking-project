package br.com.patio.session.dto;

import br.com.patio.session.SessionStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovementResponse(
        Long id,
        String licensePlate,
        String model,
        String color,
        String spotNumber,
        LocalDateTime entryAt,
        LocalDateTime exitAt,
        SessionStatus status,
        BigDecimal amount,
        long parkingMinutes
) {
}
