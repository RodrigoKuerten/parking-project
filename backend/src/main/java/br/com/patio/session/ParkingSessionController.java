package br.com.patio.session;

import br.com.patio.session.dto.CheckInRequest;
import br.com.patio.session.dto.CheckOutPreviewResponse;
import br.com.patio.session.dto.CheckOutRequest;
import br.com.patio.session.dto.MovementResponse;
import br.com.patio.session.dto.OpenSessionResponse;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
public class ParkingSessionController {

    private final ParkingSessionService service;

    public ParkingSessionController(ParkingSessionService service) {
        this.service = service;
    }

    @PostMapping("/check-in")
    @ResponseStatus(HttpStatus.CREATED)
    public OpenSessionResponse checkIn(@Valid @RequestBody CheckInRequest request) {
        return service.checkIn(request);
    }

    @GetMapping("/open")
    public List<OpenSessionResponse> listOpen() {
        return service.listOpen();
    }

    @GetMapping("/checkout-preview")
    public CheckOutPreviewResponse previewCheckOut(@RequestParam String licensePlate) {
        return service.previewCheckOut(licensePlate);
    }

    @PostMapping("/check-out")
    public CheckOutPreviewResponse checkOut(@Valid @RequestBody CheckOutRequest request) {
        return service.checkOut(request);
    }

    @GetMapping("/history")
    public List<MovementResponse> history(
            @RequestParam(required = false) String licensePlate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return service.history(licensePlate, from, to);
    }
}
