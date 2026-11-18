package br.com.patio.session.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OpenSessionResponse(
        Long id,
        String licensePlate,
        String model,
        String color,
        String spotNumber,
        LocalDateTime entryAt,
        long parkingMinutes,
        BigDecimal estimatedAmount
) {
}
