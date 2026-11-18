package br.com.patio.session.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CheckOutPreviewResponse(
        Long id,
        String licensePlate,
        String model,
        String color,
        String spotNumber,
        LocalDateTime entryAt,
        LocalDateTime exitAt,
        long parkingMinutes,
        long billedMinutes,
        BigDecimal amount
) {
}
