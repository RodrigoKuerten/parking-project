package br.com.patio.pricing;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PriceCalculatorTest {

    private static final LocalDateTime ENTRY_AT = LocalDateTime.of(2026, 11, 18, 8, 0);

    private PriceCalculator calculator;
    private PricingConfig config;

    @BeforeEach
    void setUp() {
        calculator = new PriceCalculator();
        config = new PricingConfig();
        config.update(
                new BigDecimal("12.00"),
                new BigDecimal("6.00"),
                new BigDecimal("45.00"),
                10,
                60,
                ENTRY_AT
        );
    }

    @Test
    @DisplayName("sessions within the grace period are free")
    void withinGracePeriod() {
        PriceCalculation result = calculate(10);

        assertThat(result.amount()).isEqualByComparingTo("0.00");
        assertThat(result.billedMinutes()).isZero();
    }

    @Test
    @DisplayName("first hour uses the configured rate")
    void firstHour() {
        assertThat(calculate(45).amount()).isEqualByComparingTo("12.00");
        assertThat(calculate(60).amount()).isEqualByComparingTo("12.00");
    }

    @Test
    @DisplayName("each started hour is billed as a full hour")
    void startedHour() {
        assertThat(calculate(61).amount()).isEqualByComparingTo("18.00");
        assertThat(calculate(120).amount()).isEqualByComparingTo("18.00");
        assertThat(calculate(180).amount()).isEqualByComparingTo("24.00");
        assertThat(calculate(181).amount()).isEqualByComparingTo("30.00");
    }

    @Test
    @DisplayName("daily rate caps each 24-hour block")
    void dailyRateCap() {
        assertThat(calculate(1_410).amount()).isEqualByComparingTo("45.00");
        assertThat(calculate(1_440).amount()).isEqualByComparingTo("45.00");
        assertThat(calculate(1_441).amount()).isEqualByComparingTo("57.00");
    }

    @Test
    @DisplayName("rounding setting groups minutes into blocks")
    void customRounding() {
        config.setRoundingMinutes(15);

        PriceCalculation result = calculate(61);

        assertThat(result.billedMinutes()).isEqualTo(75);
        assertThat(result.amount()).isEqualByComparingTo("18.00");
    }

    private PriceCalculation calculate(long minutes) {
        return calculator.calculate(ENTRY_AT, ENTRY_AT.plusMinutes(minutes), config);
    }
}
