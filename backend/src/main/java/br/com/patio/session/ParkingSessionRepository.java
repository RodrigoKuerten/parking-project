package br.com.patio.session;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

public interface ParkingSessionRepository extends JpaRepository<ParkingSession, Long> {

    long countByStatus(SessionStatus status);

    List<ParkingSession> findByStatusOrderByEntryAtAsc(SessionStatus status);

    @Query("""
            select count(s) > 0 from ParkingSession s
            where s.vehicle.licensePlate = :licensePlate and s.status = :status
            """)
    boolean existsForVehicle(@Param("licensePlate") String licensePlate, @Param("status") SessionStatus status);

    @Query("select s from ParkingSession s where s.vehicle.licensePlate = :licensePlate and s.status = :status")
    Optional<ParkingSession> findByLicensePlateAndStatus(@Param("licensePlate") String licensePlate,
                                                          @Param("status") SessionStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from ParkingSession s where s.vehicle.licensePlate = :licensePlate and s.status = :status")
    Optional<ParkingSession> findByLicensePlateAndStatusForUpdate(@Param("licensePlate") String licensePlate,
                                                                  @Param("status") SessionStatus status);

    @Query(value = "select * from parking_sessions order by coalesce(exit_at, entry_at) desc limit 8", nativeQuery = true)
    List<ParkingSession> findRecent();

    @Query("""
            select s from ParkingSession s
            join fetch s.vehicle v
            join fetch s.spot
            where s.status = :status
              and (:licensePlate is null or v.licensePlate like concat('%', :licensePlate, '%'))
              and (:from is null or s.entryAt >= :from)
              and (:to is null or s.entryAt < :to)
            order by s.exitAt desc
            """)
    List<ParkingSession> findHistory(@Param("status") SessionStatus status,
                                     @Param("licensePlate") String licensePlate,
                                     @Param("from") LocalDateTime from,
                                     @Param("to") LocalDateTime to);

    @Query("""
            select sum(s.amount) from ParkingSession s
            where s.status = :status and s.exitAt >= :from and s.exitAt < :to
            """)
    BigDecimal sumAmounts(@Param("status") SessionStatus status,
                          @Param("from") LocalDateTime from,
                          @Param("to") LocalDateTime to);

    @Query("""
            select count(s) from ParkingSession s
            where s.status = :status and s.exitAt >= :from and s.exitAt < :to
            """)
    long countByStatusAndExitBetween(@Param("status") SessionStatus status,
                                     @Param("from") LocalDateTime from,
                                     @Param("to") LocalDateTime to);
}
