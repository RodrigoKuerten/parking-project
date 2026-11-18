package br.com.patio.session;

import br.com.patio.spot.ParkingSpot;
import br.com.patio.vehicle.Vehicle;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "parking_sessions")
@Getter
@Setter
@NoArgsConstructor
public class ParkingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "spot_id", nullable = false)
    private ParkingSpot spot;

    @Column(name = "entry_at", nullable = false)
    private LocalDateTime entryAt;

    @Column(name = "exit_at")
    private LocalDateTime exitAt;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SessionStatus status = SessionStatus.OPEN;

    public static ParkingSession open(Vehicle vehicle, ParkingSpot spot, LocalDateTime entryAt) {
        ParkingSession session = new ParkingSession();
        session.vehicle = vehicle;
        session.spot = spot;
        session.entryAt = entryAt;
        session.status = SessionStatus.OPEN;
        return session;
    }

    public void close(LocalDateTime exitAt, BigDecimal amount) {
        this.exitAt = exitAt;
        this.amount = amount;
        this.status = SessionStatus.CLOSED;
    }

    public boolean isOpen() {
        return status == SessionStatus.OPEN;
    }
}
