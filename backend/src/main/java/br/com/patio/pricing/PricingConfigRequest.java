package br.com.patio.pricing;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PricingConfigRequest(
        @NotNull(message = "Enter the first hour rate")
        @DecimalMin(value = "0.01", message = "The first hour rate must be greater than zero")
        @Digits(integer = 8, fraction = 2, message = "Use at most 2 decimal places")
        BigDecimal firstHourRate,

        @NotNull(message = "Enter the additional hour rate")
        @DecimalMin(value = "0.01", message = "The additional hour rate must be greater than zero")
        @Digits(integer = 8, fraction = 2, message = "Use at most 2 decimal places")
        BigDecimal additionalHourRate,

        @NotNull(message = "Enter the daily rate")
        @DecimalMin(value = "0.01", message = "The daily rate must be greater than zero")
        @Digits(integer = 8, fraction = 2, message = "Use at most 2 decimal places")
        BigDecimal dailyRate,

        @Min(value = 0, message = "Grace period cannot be negative")
        @Max(value = 120, message = "Grace period cannot exceed 120 minutes")
        int graceMinutes,

        @Min(value = 5, message = "Rounding must be at least 5 minutes")
        @Max(value = 60, message = "Rounding cannot exceed 60 minutes")
        int roundingMinutes
) {
}
