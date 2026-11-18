package br.com.patio.spot;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {

    List<ParkingSpot> findAllByOrderByNumberAsc();

    long countByStatus(SpotStatus status);

    boolean existsByNumber(String number);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from ParkingSpot s where s.id = :id")
    Optional<ParkingSpot> findByIdForUpdate(@Param("id") Long id);

    @Query(value = "select * from parking_spots where status = 'AVAILABLE' order by number limit 1 for update", nativeQuery = true)
    Optional<ParkingSpot> findFirstAvailableForUpdate();
}
