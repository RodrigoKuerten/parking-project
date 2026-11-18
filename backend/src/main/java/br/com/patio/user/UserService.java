package br.com.patio.user;

import br.com.patio.shared.BusinessRuleException;
import br.com.patio.shared.ResourceNotFoundException;
import br.com.patio.user.dto.CreateUserRequest;
import br.com.patio.user.dto.UpdateUserRequest;
import br.com.patio.user.dto.UserResponse;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final Clock clock;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder, Clock clock) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> list() {
        return repository.findAllByOrderByNameAsc().stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        String email = normalizeEmail(request.email());
        if (repository.existsByEmailIgnoreCase(email)) {
            throw new BusinessRuleException("A user with this email already exists.");
        }
        AppUser user = new AppUser(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                request.role(),
                LocalDateTime.now(clock)
        );
        return UserResponse.from(repository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request, String currentEmail) {
        AppUser user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        AppUser current = repository.findByEmailIgnoreCase(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));

        boolean removingAdminAccess = user.getRole() == UserRole.ADMIN && user.isActive();
        boolean nextStateHasAdminAccess = request.role() == UserRole.ADMIN && request.active();

        if (user.getId().equals(current.getId()) && (!request.active() || request.role() != UserRole.ADMIN)) {
            throw new BusinessRuleException("You cannot remove your own administrator access.");
        }
        if (removingAdminAccess && !nextStateHasAdminAccess
                && repository.countByRoleAndActiveTrue(UserRole.ADMIN) <= 1) {
            throw new BusinessRuleException("At least one active administrator is required.");
        }

        user.updateProfile(request.name().trim(), request.role(), request.active());
        if (request.newPassword() != null && !request.newPassword().isBlank()) {
            user.updatePassword(passwordEncoder.encode(request.newPassword()));
        }
        return UserResponse.from(user);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
