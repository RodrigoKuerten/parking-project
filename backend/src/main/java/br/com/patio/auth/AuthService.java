package br.com.patio.auth;

import br.com.patio.auth.dto.ChangePasswordRequest;
import br.com.patio.auth.dto.LoginRequest;
import br.com.patio.auth.dto.LoginResponse;
import br.com.patio.security.JwtTokenService;
import br.com.patio.shared.BusinessRuleException;
import br.com.patio.user.AppUser;
import br.com.patio.user.UserRepository;
import br.com.patio.user.dto.UserResponse;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService tokenService;
    private final LoginAttemptService loginAttempts;
    private final Clock clock;
    private final String dummyHash;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenService tokenService,
                       LoginAttemptService loginAttempts,
                       Clock clock) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.loginAttempts = loginAttempts;
        this.clock = clock;
        this.dummyHash = passwordEncoder.encode("unused-placeholder-password-1");
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (loginAttempts.isBlocked(email)) {
            throw new TooManyAttemptsException("Too many failed sign-in attempts. Try again in 15 minutes.");
        }

        AppUser user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        String hash = user == null ? dummyHash : user.getPasswordHash();
        boolean passwordMatches = passwordEncoder.matches(request.password(), hash);

        if (user == null || !passwordMatches || !user.isActive()) {
            loginAttempts.recordFailure(email);
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        loginAttempts.recordSuccess(email);
        user.recordLogin(LocalDateTime.now(clock));
        JwtTokenService.IssuedToken issuedToken = tokenService.issue(user);
        return new LoginResponse(
                issuedToken.value(),
                "Bearer",
                issuedToken.expiresAt(),
                UserResponse.from(user)
        );
    }

    @Transactional(readOnly = true)
    public UserResponse me(String email) {
        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new InvalidCredentialsException("Authenticated user not found."));
        return UserResponse.from(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new InvalidCredentialsException("Authenticated user not found."));
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("The current password is incorrect.");
        }
        user.updatePassword(passwordEncoder.encode(request.newPassword()));
    }
}
