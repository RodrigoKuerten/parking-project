package br.com.patio.auth;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LoginAttemptServiceTest {

    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-11-18T12:00:00Z"), ZoneOffset.UTC);

    @Test
    @DisplayName("blocks an account after five failed attempts")
    void blocksAfterFiveFailures() {
        LoginAttemptService service = new LoginAttemptService(CLOCK);

        for (int attempt = 0; attempt < 4; attempt++) {
            service.recordFailure("user@patio.local");
        }
        assertThat(service.isBlocked("user@patio.local")).isFalse();

        service.recordFailure("user@patio.local");

        assertThat(service.isBlocked("user@patio.local")).isTrue();
    }

    @Test
    @DisplayName("successful sign-in clears failed attempts")
    void successClearsFailures() {
        LoginAttemptService service = new LoginAttemptService(CLOCK);
        service.recordFailure("user@patio.local");
        service.recordFailure("user@patio.local");

        service.recordSuccess("user@patio.local");

        for (int attempt = 0; attempt < 4; attempt++) {
            service.recordFailure("user@patio.local");
        }
        assertThat(service.isBlocked("user@patio.local")).isFalse();
    }

    @Test
    @DisplayName("failures older than the block window are forgotten")
    void failuresExpireAfterTheWindow() {
        MutableClock clock = new MutableClock(Instant.parse("2026-11-18T12:00:00Z"));
        LoginAttemptService service = new LoginAttemptService(clock);

        for (int attempt = 0; attempt < 4; attempt++) {
            service.recordFailure("user@patio.local");
        }
        clock.advance(Duration.ofMinutes(16));

        service.recordFailure("user@patio.local");

        assertThat(service.isBlocked("user@patio.local")).isFalse();
    }

    @Test
    @DisplayName("the block is lifted after its window")
    void blockExpiresAfterTheWindow() {
        MutableClock clock = new MutableClock(Instant.parse("2026-11-18T12:00:00Z"));
        LoginAttemptService service = new LoginAttemptService(clock);

        for (int attempt = 0; attempt < 5; attempt++) {
            service.recordFailure("user@patio.local");
        }
        assertThat(service.isBlocked("user@patio.local")).isTrue();

        clock.advance(Duration.ofMinutes(16));

        assertThat(service.isBlocked("user@patio.local")).isFalse();
    }

    private static final class MutableClock extends Clock {

        private Instant instant;

        private MutableClock(Instant instant) {
            this.instant = instant;
        }

        private void advance(Duration duration) {
            instant = instant.plus(duration);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return instant;
        }
    }
}
