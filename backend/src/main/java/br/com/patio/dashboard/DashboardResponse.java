package br.com.patio.dashboard;

import br.com.patio.session.dto.MovementResponse;
import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long totalSpots,
        long occupiedSpots,
        long availableSpots,
        long parkedVehicles,
        BigDecimal revenueToday,
        double occupancyRate,
        long checkOutsToday,
        List<MovementResponse> recentMovements
) {
}
