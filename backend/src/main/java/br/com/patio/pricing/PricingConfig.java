package br.com.patio.pricing;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pricing_config")
@Getter
@Setter
@NoArgsConstructor
public class PricingConfig {

    public static final long SINGLETON_ID = 1L;

    @Id
    private Long id = SINGLETON_ID;

    @Column(name = "first_hour_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal firstHourRate;

    @Column(name = "additional_hour_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal additionalHourRate;

    @Column(name = "daily_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate;

    @Column(name = "grace_minutes", nullable = false)
    private int graceMinutes;

    @Column(name = "rounding_minutes", nullable = false)
    private int roundingMinutes;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void update(BigDecimal firstHourRate, BigDecimal additionalHourRate, BigDecimal dailyRate,
                       int graceMinutes, int roundingMinutes, LocalDateTime updatedAt) {
        this.firstHourRate = firstHourRate;
        this.additionalHourRate = additionalHourRate;
        this.dailyRate = dailyRate;
        this.graceMinutes = graceMinutes;
        this.roundingMinutes = roundingMinutes;
        this.updatedAt = updatedAt;
    }
}
