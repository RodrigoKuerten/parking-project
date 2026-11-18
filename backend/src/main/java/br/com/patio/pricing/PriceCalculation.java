package br.com.patio.pricing;

import java.math.BigDecimal;

public record PriceCalculation(BigDecimal amount, long parkingMinutes, long billedMinutes) {
}
