package br.com.patio.security;

import br.com.patio.user.AppUser;
import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    private final JwtEncoder encoder;
    private final Clock clock;
    private final String issuer;
    private final long expirationHours;

    public JwtTokenService(JwtEncoder encoder,
                           Clock clock,
                           @Value("${app.jwt.issuer}") String issuer,
                           @Value("${app.jwt.expiration-hours}") long expirationHours) {
        this.encoder = encoder;
        this.clock = clock;
        this.issuer = issuer;
        this.expirationHours = expirationHours;
    }

    public IssuedToken issue(AppUser user) {
        Instant issuedAt = Instant.now(clock);
        Instant expiresAt = issuedAt.plus(expirationHours, ChronoUnit.HOURS);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .subject(user.getEmail())
                .claim("uid", user.getId())
                .claim("name", user.getName())
                .claim("role", user.getRole().name())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        Jwt jwt = encoder.encode(JwtEncoderParameters.from(header, claims));
        return new IssuedToken(jwt.getTokenValue(), expiresAt);
    }

    public record IssuedToken(String value, Instant expiresAt) {
    }
}
