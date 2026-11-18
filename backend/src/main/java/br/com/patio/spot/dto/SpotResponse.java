package br.com.patio.spot.dto;

import br.com.patio.spot.SpotStatus;

public record SpotResponse(
        Long id,
        String number,
        SpotStatus status,
        String licensePlate,
        Long sessionId
) {
}
