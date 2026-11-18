package br.com.patio.session;

import br.com.patio.pricing.PriceCalculation;
import br.com.patio.pricing.PricingConfig;
import br.com.patio.pricing.PriceCalculator;
import br.com.patio.session.dto.CheckOutPreviewResponse;
import br.com.patio.session.dto.MovementResponse;
import br.com.patio.session.dto.OpenSessionResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class ParkingSessionMapper {

    private final PriceCalculator calculator;

    public ParkingSessionMapper(PriceCalculator calculator) {
        this.calculator = calculator;
    }

    public OpenSessionResponse toOpenResponse(ParkingSession session, PricingConfig config, LocalDateTime now) {
        PriceCalculation calculation = calculator.calculate(session.getEntryAt(), now, config);
        return new OpenSessionResponse(
                session.getId(),
                session.getVehicle().getLicensePlate(),
                session.getVehicle().getModel(),
                session.getVehicle().getColor(),
                session.getSpot().getNumber(),
                session.getEntryAt(),
                calculation.parkingMinutes(),
                calculation.amount()
        );
    }

    public CheckOutPreviewResponse toCheckOutResponse(ParkingSession session, PriceCalculation calculation) {
        return toCheckOutResponse(session, session.getExitAt(), calculation);
    }

    public CheckOutPreviewResponse toCheckOutResponse(ParkingSession session, LocalDateTime exitAt, PriceCalculation calculation) {
        return new CheckOutPreviewResponse(
                session.getId(),
                session.getVehicle().getLicensePlate(),
                session.getVehicle().getModel(),
                session.getVehicle().getColor(),
                session.getSpot().getNumber(),
                session.getEntryAt(),
                exitAt,
                calculation.parkingMinutes(),
                calculation.billedMinutes(),
                calculation.amount()
        );
    }

    public MovementResponse toMovementResponse(ParkingSession session, LocalDateTime now) {
        LocalDateTime reference = session.getExitAt() != null ? session.getExitAt() : now;
        long minutes = Math.max(0, Duration.between(session.getEntryAt(), reference).toMinutes());
        return new MovementResponse(
                session.getId(),
                session.getVehicle().getLicensePlate(),
                session.getVehicle().getModel(),
                session.getVehicle().getColor(),
                session.getSpot().getNumber(),
                session.getEntryAt(),
                session.getExitAt(),
                session.getStatus(),
                session.getAmount(),
                minutes
        );
    }
}
