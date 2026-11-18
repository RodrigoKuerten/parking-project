package br.com.patio.session;

import br.com.patio.pricing.PriceCalculation;
import br.com.patio.pricing.PriceCalculator;
import br.com.patio.pricing.PricingConfig;
import br.com.patio.pricing.PricingConfigService;
import br.com.patio.session.dto.CheckInRequest;
import br.com.patio.session.dto.CheckOutPreviewResponse;
import br.com.patio.session.dto.CheckOutRequest;
import br.com.patio.session.dto.MovementResponse;
import br.com.patio.session.dto.OpenSessionResponse;
import br.com.patio.shared.BusinessRuleException;
import br.com.patio.shared.LicensePlate;
import br.com.patio.shared.ResourceNotFoundException;
import br.com.patio.spot.ParkingSpot;
import br.com.patio.spot.ParkingSpotRepository;
import br.com.patio.spot.SpotStatus;
import br.com.patio.vehicle.Vehicle;
import br.com.patio.vehicle.VehicleRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ParkingSessionService {

    private final ParkingSessionRepository sessionRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingSpotRepository spotRepository;
    private final PricingConfigService pricingConfigService;
    private final PriceCalculator calculator;
    private final ParkingSessionMapper mapper;
    private final Clock clock;

    public ParkingSessionService(ParkingSessionRepository sessionRepository,
                                 VehicleRepository vehicleRepository,
                                 ParkingSpotRepository spotRepository,
                                 PricingConfigService pricingConfigService,
                                 PriceCalculator calculator,
                                 ParkingSessionMapper mapper,
                                 Clock clock) {
        this.sessionRepository = sessionRepository;
        this.vehicleRepository = vehicleRepository;
        this.spotRepository = spotRepository;
        this.pricingConfigService = pricingConfigService;
        this.calculator = calculator;
        this.mapper = mapper;
        this.clock = clock;
    }

    @Transactional
    public OpenSessionResponse checkIn(CheckInRequest request) {
        String licensePlate = LicensePlate.requireValid(request.licensePlate());

        if (sessionRepository.existsForVehicle(licensePlate, SessionStatus.OPEN)) {
            throw new BusinessRuleException("This vehicle already has an open parking session.");
        }

        ParkingSpot spot = reserveSpot(request.spotId());
        Vehicle vehicle = vehicleRepository.findByLicensePlate(licensePlate)
                .orElseGet(() -> new Vehicle(licensePlate, request.model().trim(), request.color().trim()));
        vehicle.updateDetails(request.model().trim(), request.color().trim());
        vehicleRepository.save(vehicle);

        spot.occupy();
        spotRepository.save(spot);

        LocalDateTime now = LocalDateTime.now(clock);
        ParkingSession session = sessionRepository.save(ParkingSession.open(vehicle, spot, now));
        return mapper.toOpenResponse(session, pricingConfigService.get(), now);
    }

    private ParkingSpot reserveSpot(Long spotId) {
        ParkingSpot spot;
        if (spotId == null) {
            spot = spotRepository.findFirstAvailableForUpdate()
                    .orElseThrow(() -> new BusinessRuleException("There are no available spots for a new check-in."));
        } else {
            spot = spotRepository.findByIdForUpdate(spotId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parking spot not found."));
            if (spot.getStatus() != SpotStatus.AVAILABLE) {
                throw new BusinessRuleException("Spot " + spot.getNumber() + " is not available.");
            }
        }
        return spot;
    }

    @Transactional(readOnly = true)
    public List<OpenSessionResponse> listOpen() {
        PricingConfig config = pricingConfigService.get();
        LocalDateTime now = LocalDateTime.now(clock);
        return sessionRepository.findByStatusOrderByEntryAtAsc(SessionStatus.OPEN).stream()
                .map(session -> mapper.toOpenResponse(session, config, now))
                .toList();
    }

    @Transactional(readOnly = true)
    public CheckOutPreviewResponse previewCheckOut(String licensePlate) {
        String normalized = LicensePlate.requireValid(licensePlate);
        ParkingSession session = findOpenSession(normalized);
        LocalDateTime now = LocalDateTime.now(clock);
        PricingConfig config = pricingConfigService.get();
        PriceCalculation calculation = calculator.calculate(session.getEntryAt(), now, config);
        return mapper.toCheckOutResponse(session, now, calculation);
    }

    @Transactional
    public CheckOutPreviewResponse checkOut(CheckOutRequest request) {
        String licensePlate = LicensePlate.requireValid(request.licensePlate());
        ParkingSession session = sessionRepository
                .findByLicensePlateAndStatusForUpdate(licensePlate, SessionStatus.OPEN)
                .orElseThrow(() -> new BusinessRuleException("This vehicle is not parked."));

        LocalDateTime exitAt = LocalDateTime.now(clock);
        PricingConfig config = pricingConfigService.get();
        PriceCalculation calculation = calculator.calculate(session.getEntryAt(), exitAt, config);

        session.close(exitAt, calculation.amount());
        session.getSpot().release();
        spotRepository.save(session.getSpot());

        return mapper.toCheckOutResponse(session, calculation);
    }

    @Transactional(readOnly = true)
    public List<MovementResponse> history(String licensePlate, LocalDate from, LocalDate to) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new BusinessRuleException("The start date cannot be after the end date.");
        }
        String plateFilter = licensePlate == null || licensePlate.isBlank()
                ? null
                : LicensePlate.normalize(licensePlate);
        LocalDateTime fromDateTime = from == null ? null : from.atStartOfDay();
        LocalDateTime toDateTime = to == null ? null : to.plusDays(1).atStartOfDay();
        LocalDateTime now = LocalDateTime.now(clock);

        return sessionRepository.findHistory(SessionStatus.CLOSED, plateFilter, fromDateTime, toDateTime).stream()
                .map(session -> mapper.toMovementResponse(session, now))
                .toList();
    }

    private ParkingSession findOpenSession(String licensePlate) {
        return sessionRepository.findByLicensePlateAndStatus(licensePlate, SessionStatus.OPEN)
                .orElseThrow(() -> new BusinessRuleException("This vehicle is not parked."));
    }
}
