package br.com.patio.pricing;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PricingConfigResponse(
        BigDecimal firstHourRate,
        BigDecimal additionalHourRate,
        BigDecimal dailyRate,
        int graceMinutes,
        int roundingMinutes,
        LocalDateTime updatedAt
) {
    public static PricingConfigResponse from(PricingConfig config) {
        return new PricingConfigResponse(
                config.getFirstHourRate(),
                config.getAdditionalHourRate(),
                config.getDailyRate(),
                config.getGraceMinutes(),
                config.getRoundingMinutes(),
                config.getUpdatedAt()
        );
    }
}
