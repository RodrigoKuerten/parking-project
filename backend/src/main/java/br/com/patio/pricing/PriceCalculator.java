package br.com.patio.pricing;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import org.springframework.stereotype.Component;

@Component
public class PriceCalculator {

    private static final int MINUTES_PER_HOUR = 60;
    private static final int MINUTES_PER_DAY = 1440;

    public PriceCalculation calculate(LocalDateTime entryAt, LocalDateTime exitAt, PricingConfig config) {
        long minutes = ChronoUnit.MINUTES.between(entryAt, exitAt);
        if (minutes < 0) {
            throw new IllegalArgumentException("Exit time cannot be before entry time.");
        }
        if (minutes <= config.getGraceMinutes()) {
            return new PriceCalculation(BigDecimal.ZERO.setScale(2), minutes, 0);
        }

        int block = Math.max(1, config.getRoundingMinutes());
        long blocks = (minutes + block - 1) / block;
        long billedMinutes = blocks * block;

        long days = billedMinutes / MINUTES_PER_DAY;
        long remaining = billedMinutes % MINUTES_PER_DAY;
        BigDecimal total = config.getDailyRate().multiply(BigDecimal.valueOf(days));

        if (remaining > 0) {
            BigDecimal segment = remaining <= MINUTES_PER_HOUR
                    ? config.getFirstHourRate()
                    : config.getFirstHourRate().add(
                            config.getAdditionalHourRate().multiply(BigDecimal.valueOf(extraHours(remaining))));
            segment = segment.min(config.getDailyRate());
            total = total.add(segment);
        }

        return new PriceCalculation(total.setScale(2, RoundingMode.HALF_UP), minutes, billedMinutes);
    }

    private long extraHours(long minutes) {
        return (minutes - MINUTES_PER_HOUR + MINUTES_PER_HOUR - 1) / MINUTES_PER_HOUR;
    }
}
