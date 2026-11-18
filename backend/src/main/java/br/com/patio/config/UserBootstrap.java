package br.com.patio.config;

import br.com.patio.user.AppUser;
import br.com.patio.user.UserRepository;
import br.com.patio.user.UserRole;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UserBootstrap implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(UserBootstrap.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Clock clock;
    private final boolean demoData;
    private final String adminName;
    private final String adminEmail;
    private final String adminPassword;

    public UserBootstrap(UserRepository userRepository,
                         PasswordEncoder passwordEncoder,
                         Clock clock,
                         @Value("${app.demo-data:true}") boolean demoData,
                         @Value("${app.bootstrap-admin.name}") String adminName,
                         @Value("${app.bootstrap-admin.email}") String adminEmail,
                         @Value("${app.bootstrap-admin.password}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.clock = clock;
        this.demoData = demoData;
        this.adminName = adminName;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            return;
        }
        if (adminPassword == null || adminPassword.length() < 8) {
            throw new IllegalStateException("The bootstrap administrator password must have at least 8 characters.");
        }

        create(adminName, adminEmail, adminPassword, UserRole.ADMIN);
        if (demoData) {
            create("Lot Manager", "manager@patio.local", "Manager@123", UserRole.MANAGER);
            create("Front Desk", "attendant@patio.local", "Attendant@123", UserRole.ATTENDANT);
        }
        log.info("Bootstrap users created. Change the default credentials before deploying.");
    }

    private void create(String name, String email, String password, UserRole role) {
        AppUser user = new AppUser(
                name,
                email.trim().toLowerCase(Locale.ROOT),
                passwordEncoder.encode(password),
                role,
                LocalDateTime.now(clock)
        );
        userRepository.save(user);
    }
}
