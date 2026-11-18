package br.com.patio.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<AppUser> findAllByOrderByNameAsc();

    long countByActiveTrue();

    long countByRole(UserRole role);

    long countByRoleAndActiveTrue(UserRole role);
}
