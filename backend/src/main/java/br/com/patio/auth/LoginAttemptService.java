package br.com.patio.auth;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final int MAX_TRACKED_KEYS = 10_000;
    private static final Duration BLOCK_DURATION = Duration.ofMinutes(15);

    private final Clock clock;
    private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

    public LoginAttemptService(Clock clock) {
        this.clock = clock;
    }

    public boolean isBlocked(String key) {
        Attempt attempt = attempts.get(key);
        if (attempt == null || attempt.blockedUntil() == null) {
            return false;
        }
        if (attempt.blockedUntil().isAfter(Instant.now(clock))) {
            return true;
        }
        attempts.remove(key, attempt);
        return false;
    }

    public void recordFailure(String key) {
        Instant now = Instant.now(clock);
        Instant windowStart = now.minus(BLOCK_DURATION);
        attempts.compute(key, (ignored, current) -> {
            if (current == null) {
                return new Attempt(1, now, null);
            }
            if (current.blockedUntil() != null) {
                return current.blockedUntil().isAfter(now) ? current : new Attempt(1, now, null);
            }
            if (current.lastFailureAt().isBefore(windowStart)) {
                return new Attempt(1, now, null);
            }
            int failures = current.failures() + 1;
            return new Attempt(failures, now, failures >= MAX_ATTEMPTS ? now.plus(BLOCK_DURATION) : null);
        });

        // Keep the map bounded under spraying: drop stale keys, then reset if still full.
        if (attempts.size() > MAX_TRACKED_KEYS) {
            attempts.entrySet().removeIf(entry -> entry.getValue().lastFailureAt().isBefore(windowStart));
            if (attempts.size() > MAX_TRACKED_KEYS) {
                attempts.clear();
            }
        }
    }

    public void recordSuccess(String key) {
        attempts.remove(key);
    }

    private record Attempt(int failures, Instant lastFailureAt, Instant blockedUntil) {
    }
}
