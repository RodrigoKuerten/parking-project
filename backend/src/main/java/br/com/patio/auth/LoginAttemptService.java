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
        attempts.compute(key, (ignored, current) -> {
            if (current == null || (current.blockedUntil() != null && !current.blockedUntil().isAfter(now))) {
                return new Attempt(1, null);
            }
            if (current.blockedUntil() != null) {
                return current;
            }
            int failures = current.failures() + 1;
            return new Attempt(failures, failures >= MAX_ATTEMPTS ? now.plus(BLOCK_DURATION) : null);
        });
    }

    public void recordSuccess(String key) {
        attempts.remove(key);
    }

    private record Attempt(int failures, Instant blockedUntil) {
    }
}
