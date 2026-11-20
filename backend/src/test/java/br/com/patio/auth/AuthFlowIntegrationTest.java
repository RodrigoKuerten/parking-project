package br.com.patio.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.patio.config.AppConfig;
import br.com.patio.security.AccountStatusFilter;
import br.com.patio.security.JwtTokenService;
import br.com.patio.security.RestAccessDeniedHandler;
import br.com.patio.security.RestAuthenticationEntryPoint;
import br.com.patio.security.SecurityConfig;
import br.com.patio.user.AppUser;
import br.com.patio.user.UserController;
import br.com.patio.user.UserRepository;
import br.com.patio.user.UserRole;
import br.com.patio.user.UserService;
import br.com.patio.user.dto.UserResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(controllers = {AuthController.class, UserController.class})
@Import({
        SecurityConfig.class,
        AppConfig.class,
        AuthService.class,
        LoginAttemptService.class,
        JwtTokenService.class,
        AccountStatusFilter.class,
        RestAuthenticationEntryPoint.class,
        RestAccessDeniedHandler.class
})
class AuthFlowIntegrationTest {

    private static final String EMAIL = "admin@patio.local";
    private static final String PASSWORD = "Secret@123";
    private static final String PASSWORD_HASH = new BCryptPasswordEncoder(4).encode(PASSWORD);

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtEncoder jwtEncoder;

    @Autowired
    private LoginAttemptService loginAttempts;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.jwt.issuer}")
    private String issuer;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private UserService userService;

    private AppUser admin;

    @BeforeEach
    void setUp() {
        loginAttempts.recordSuccess(EMAIL);
        loginAttempts.recordSuccess("attendant@patio.local");
        admin = account(1L, EMAIL, UserRole.ADMIN, true);
    }

    @Test
    @DisplayName("login returns a signed token and the current account without the password hash")
    void loginReturnsTokenAndUser() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));

        MvcResult result = login("Admin@Patio.Local", PASSWORD)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.email").value(EMAIL))
                .andExpect(jsonPath("$.user.role").value("ADMIN"))
                .andExpect(jsonPath("$.user.active").value(true))
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist())
                .andReturn();

        assertThat(result.getResponse().getContentAsString()).doesNotContain(PASSWORD_HASH);
    }

    @Test
    @DisplayName("wrong password is rejected with 401 and a generic message")
    void wrongPasswordIsRejected() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));

        login(EMAIL, "Wrong@123")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    @Test
    @DisplayName("unknown email is rejected with the same generic message")
    void unknownEmailIsRejected() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.empty());

        login(EMAIL, PASSWORD)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    @Test
    @DisplayName("inactive account cannot sign in")
    void inactiveAccountCannotSignIn() throws Exception {
        AppUser inactive = account(2L, EMAIL, UserRole.ADMIN, false);
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(inactive));

        login(EMAIL, PASSWORD)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    @Test
    @DisplayName("sixth failed attempt is throttled with 429")
    void failedAttemptsAreThrottled() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));

        for (int attempt = 0; attempt < 5; attempt++) {
            login(EMAIL, "Wrong@123").andExpect(status().isUnauthorized());
        }

        login(EMAIL, "Wrong@123")
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.message").value("Too many failed sign-in attempts. Try again in 15 minutes."));
    }

    @Test
    @DisplayName("protected endpoint without a token returns 401")
    void protectedEndpointWithoutTokenReturns401() throws Exception {
        mvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Authentication is required."));
    }

    @Test
    @DisplayName("expired token returns 401")
    void expiredTokenReturns401() throws Exception {
        String token = jwtEncoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(),
                JwtClaimsSet.builder()
                        .issuer(issuer)
                        .issuedAt(Instant.now().minus(2, ChronoUnit.HOURS))
                        .expiresAt(Instant.now().minus(1, ChronoUnit.HOURS))
                        .subject(EMAIL)
                        .claim("role", "ADMIN")
                        .build()
        )).getTokenValue();

        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("attendant receives 403 on the admin-only users endpoint")
    void attendantCannotListUsers() throws Exception {
        AppUser attendant = account(3L, "attendant@patio.local", UserRole.ATTENDANT, true);
        when(userRepository.findByEmailIgnoreCase(attendant.getEmail())).thenReturn(Optional.of(attendant));

        MvcResult loginResult = login(attendant.getEmail(), PASSWORD)
                .andExpect(status().isOk())
                .andReturn();
        String token = token(loginResult);

        mvc.perform(get("/api/users").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message")
                        .value("You do not have permission to perform this action."));
    }

    @Test
    @DisplayName("administrator can list users")
    void administratorCanListUsers() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));
        when(userService.list()).thenReturn(List.of(UserResponse.from(admin)));

        MvcResult loginResult = login(EMAIL, PASSWORD).andExpect(status().isOk()).andReturn();

        mvc.perform(get("/api/users").header("Authorization", "Bearer " + token(loginResult)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value(EMAIL));
    }

    @Test
    @DisplayName("role change in the database takes effect without a new token")
    void roleChangeTakesEffectImmediately() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));
        MvcResult loginResult = login(EMAIL, PASSWORD).andExpect(status().isOk()).andReturn();
        String token = token(loginResult);

        AppUser demoted = account(1L, EMAIL, UserRole.ATTENDANT, true);
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(demoted));

        mvc.perform(get("/api/users").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("deactivated account loses access even with a valid token")
    void deactivatedAccountLosesAccess() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));
        MvcResult loginResult = login(EMAIL, PASSWORD).andExpect(status().isOk()).andReturn();
        String token = token(loginResult);

        AppUser deactivated = account(1L, EMAIL, UserRole.ADMIN, false);
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(deactivated));

        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("This account is not active."));
    }

    @Test
    @DisplayName("me returns the authenticated account")
    void meReturnsAuthenticatedAccount() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));
        MvcResult loginResult = login(EMAIL, PASSWORD).andExpect(status().isOk()).andReturn();

        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token(loginResult)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(EMAIL))
                .andExpect(jsonPath("$.lastLoginAt").isNotEmpty());
    }

    @Test
    @DisplayName("signed-in user can change the own password")
    void changesOwnPassword() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));
        String token = token(login(EMAIL, PASSWORD).andExpect(status().isOk()).andReturn());

        mvc.perform(post("/api/auth/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "currentPassword", PASSWORD,
                                "newPassword", "NewSecret@456"))))
                .andExpect(status().isNoContent());

        assertThat(passwordEncoder.matches("NewSecret@456", admin.getPasswordHash())).isTrue();
        login(EMAIL, "NewSecret@456").andExpect(status().isOk());
    }

    @Test
    @DisplayName("wrong current password keeps the hash unchanged")
    void wrongCurrentPasswordIsRejected() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));
        String token = token(login(EMAIL, PASSWORD).andExpect(status().isOk()).andReturn());
        String originalHash = admin.getPasswordHash();

        mvc.perform(post("/api/auth/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "currentPassword", "Wrong@123",
                                "newPassword", "NewSecret@456"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("The current password is incorrect."));

        assertThat(admin.getPasswordHash()).isEqualTo(originalHash);
    }

    @Test
    @DisplayName("new password must follow the password policy")
    void weakNewPasswordIsRejected() throws Exception {
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(admin));
        String token = token(login(EMAIL, PASSWORD).andExpect(status().isOk()).andReturn());

        mvc.perform(post("/api/auth/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "currentPassword", PASSWORD,
                                "newPassword", "short"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("password change requires authentication")
    void passwordChangeRequiresAuthentication() throws Exception {
        mvc.perform(post("/api/auth/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "currentPassword", PASSWORD,
                                "newPassword", "NewSecret@456"))))
                .andExpect(status().isUnauthorized());
    }

    private ResultActions login(String email, String password) throws Exception {
        return mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email, "password", password))));
    }

    private String token(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    private AppUser account(Long id, String email, UserRole role, boolean active) {
        AppUser user = new AppUser("Test User", email, PASSWORD_HASH, role, LocalDateTime.now());
        user.setId(id);
        user.setActive(active);
        return user;
    }
}
