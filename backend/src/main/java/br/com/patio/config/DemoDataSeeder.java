package br.com.patio.config;

import br.com.patio.pricing.PriceCalculation;
import br.com.patio.pricing.PriceCalculator;
import br.com.patio.pricing.PricingConfig;
import br.com.patio.pricing.PricingConfigRepository;
import br.com.patio.session.ParkingSession;
import br.com.patio.session.ParkingSessionRepository;
import br.com.patio.spot.ParkingSpot;
import br.com.patio.spot.ParkingSpotRepository;
import br.com.patio.vehicle.Vehicle;
import br.com.patio.vehicle.VehicleRepository;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(prefix = "app", name = "demo-data", havingValue = "true", matchIfMissing = true)
public class DemoDataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final ParkingSessionRepository sessionRepository;
    private final PricingConfigRepository pricingRepository;
    private final ParkingSpotRepository spotRepository;
    private final VehicleRepository vehicleRepository;
    private final PriceCalculator calculator;
    private final Clock clock;

    public DemoDataSeeder(ParkingSessionRepository sessionRepository,
                          PricingConfigRepository pricingRepository,
                          ParkingSpotRepository spotRepository,
                          VehicleRepository vehicleRepository,
                          PriceCalculator calculator,
                          Clock clock) {
        this.sessionRepository = sessionRepository;
        this.pricingRepository = pricingRepository;
        this.spotRepository = spotRepository;
        this.vehicleRepository = vehicleRepository;
        this.calculator = calculator;
        this.clock = clock;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (sessionRepository.count() > 0) {
            return;
        }
        PricingConfig config = pricingRepository.findById(PricingConfig.SINGLETON_ID).orElse(null);
        List<ParkingSpot> spots = spotRepository.findAllByOrderByNumberAsc();
        if (config == null || spots.size() < 12) {
            return;
        }

        LocalDateTime now = LocalDateTime.now(clock);

        closedSession(spots.get(0), "ABC1D45", "Fiat Argo", "Silver",
                now.minusHours(5), now.minusHours(4).minusMinutes(10), config);
        closedSession(spots.get(1), "DEF2G67", "Hyundai HB20", "White",
                now.minusHours(3), now.minusHours(1).minusMinutes(40), config);
        closedSession(spots.get(2), "GHI3J89", "Chevrolet Onix", "Gray",
                now.minusHours(8), now.minusHours(5), config);
        LocalDateTime yesterday = now.minusDays(1);
        closedSession(spots.get(3), "JKL4M01", "Volkswagen Gol", "Red",
                yesterday.withHour(15).withMinute(0), yesterday.withHour(18).withMinute(20), config);

        openSession(spots.get(4), "BRA2E19", "Honda Civic", "Black", now.minusHours(2).minusMinutes(14));
        openSession(spots.get(7), "QWE4R56", "Jeep Renegade", "White", now.minusMinutes(47));
        openSession(spots.get(11), "ASD7F89", "Toyota Corolla", "Silver", now.minusMinutes(11));

        log.info("Demo data created: 4 completed sessions and 3 vehicles currently parked.");
    }

    private void closedSession(ParkingSpot spot, String licensePlate, String model, String color,
                               LocalDateTime entryAt, LocalDateTime exitAt, PricingConfig config) {
        Vehicle vehicle = vehicleRepository.save(new Vehicle(licensePlate, model, color));
        PriceCalculation calculation = calculator.calculate(entryAt, exitAt, config);
        ParkingSession session = ParkingSession.open(vehicle, spot, entryAt);
        session.close(exitAt, calculation.amount());
        sessionRepository.save(session);
    }

    private void openSession(ParkingSpot spot, String licensePlate, String model, String color,
                             LocalDateTime entryAt) {
        Vehicle vehicle = vehicleRepository.save(new Vehicle(licensePlate, model, color));
        spot.occupy();
        spotRepository.save(spot);
        sessionRepository.save(ParkingSession.open(vehicle, spot, entryAt));
    }
}
