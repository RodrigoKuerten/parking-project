package br.com.patio.dashboard;

import br.com.patio.session.ParkingSessionMapper;
import br.com.patio.session.ParkingSessionRepository;
import br.com.patio.session.SessionStatus;
import br.com.patio.session.dto.MovementResponse;
import br.com.patio.spot.ParkingSpotRepository;
import br.com.patio.spot.SpotStatus;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final ParkingSpotRepository spotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final ParkingSessionMapper mapper;
    private final Clock clock;

    public DashboardService(ParkingSpotRepository spotRepository,
                            ParkingSessionRepository sessionRepository,
                            ParkingSessionMapper mapper,
                            Clock clock) {
        this.spotRepository = spotRepository;
        this.sessionRepository = sessionRepository;
        this.mapper = mapper;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public DashboardResponse get() {
        LocalDateTime now = LocalDateTime.now(clock);
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        long totalSpots = spotRepository.count();
        long occupiedSpots = spotRepository.countByStatus(SpotStatus.OCCUPIED);
        long parkedVehicles = sessionRepository.countByStatus(SessionStatus.OPEN);
        BigDecimal revenueToday = sessionRepository.sumAmounts(SessionStatus.CLOSED, startOfDay, endOfDay);
        if (revenueToday == null) {
            revenueToday = BigDecimal.ZERO;
        }
        long checkOutsToday = sessionRepository.countByStatusAndExitBetween(
                SessionStatus.CLOSED, startOfDay, endOfDay);
        double occupancyRate = totalSpots == 0
                ? 0.0
                : Math.round(occupiedSpots * 1000.0 / totalSpots) / 10.0;

        List<MovementResponse> recentMovements = sessionRepository.findRecent().stream()
                .map(session -> mapper.toMovementResponse(session, now))
                .toList();

        return new DashboardResponse(
                totalSpots,
                occupiedSpots,
                totalSpots - occupiedSpots,
                parkedVehicles,
                revenueToday,
                occupancyRate,
                checkOutsToday,
                recentMovements
        );
    }
}
