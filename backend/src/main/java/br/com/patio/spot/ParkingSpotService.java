package br.com.patio.spot;

import br.com.patio.session.ParkingSession;
import br.com.patio.session.ParkingSessionRepository;
import br.com.patio.session.SessionStatus;
import br.com.patio.shared.BusinessRuleException;
import br.com.patio.spot.dto.SpotRequest;
import br.com.patio.spot.dto.SpotResponse;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ParkingSpotService {

    private final ParkingSpotRepository spotRepository;
    private final ParkingSessionRepository sessionRepository;

    public ParkingSpotService(ParkingSpotRepository spotRepository, ParkingSessionRepository sessionRepository) {
        this.spotRepository = spotRepository;
        this.sessionRepository = sessionRepository;
    }

    @Transactional(readOnly = true)
    public List<SpotResponse> list() {
        Map<Long, ParkingSession> openSessions = sessionRepository
                .findByStatusOrderByEntryAtAsc(SessionStatus.OPEN).stream()
                .collect(Collectors.toMap(session -> session.getSpot().getId(), Function.identity()));

        return spotRepository.findAllByOrderByNumberAsc().stream()
                .map(spot -> {
                    ParkingSession session = openSessions.get(spot.getId());
                    return new SpotResponse(
                            spot.getId(),
                            spot.getNumber(),
                            spot.getStatus(),
                            session == null ? null : session.getVehicle().getLicensePlate(),
                            session == null ? null : session.getId()
                    );
                })
                .toList();
    }

    @Transactional
    public SpotResponse create(SpotRequest request) {
        String number = request.number().trim().toUpperCase(Locale.ROOT);
        if (spotRepository.existsByNumber(number)) {
            throw new BusinessRuleException("A spot with number " + number + " already exists.");
        }
        ParkingSpot spot = spotRepository.save(new ParkingSpot(number));
        return new SpotResponse(spot.getId(), spot.getNumber(), spot.getStatus(), null, null);
    }
}
