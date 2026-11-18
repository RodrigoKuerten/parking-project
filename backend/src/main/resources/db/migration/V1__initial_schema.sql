CREATE TABLE vehicles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    license_plate VARCHAR(8) NOT NULL,
    model VARCHAR(80) NOT NULL,
    color VARCHAR(30) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_vehicles_license_plate (license_plate)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE parking_spots (
    id BIGINT NOT NULL AUTO_INCREMENT,
    number VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_parking_spots_number (number)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE pricing_config (
    id BIGINT NOT NULL,
    first_hour_rate DECIMAL(10, 2) NOT NULL,
    additional_hour_rate DECIMAL(10, 2) NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    grace_minutes INT NOT NULL,
    rounding_minutes INT NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE parking_sessions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    vehicle_id BIGINT NOT NULL,
    spot_id BIGINT NOT NULL,
    entry_at DATETIME(6) NOT NULL,
    exit_at DATETIME(6) NULL,
    amount DECIMAL(10, 2) NULL,
    status VARCHAR(20) NOT NULL,
    open_vehicle_id BIGINT GENERATED ALWAYS AS (
        CASE WHEN status = 'OPEN' THEN vehicle_id ELSE NULL END
    ) STORED,
    open_spot_id BIGINT GENERATED ALWAYS AS (
        CASE WHEN status = 'OPEN' THEN spot_id ELSE NULL END
    ) STORED,
    PRIMARY KEY (id),
    UNIQUE KEY uk_sessions_open_vehicle (open_vehicle_id),
    UNIQUE KEY uk_sessions_open_spot (open_spot_id),
    KEY idx_sessions_status_exit (status, exit_at),
    CONSTRAINT fk_sessions_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    CONSTRAINT fk_sessions_spot FOREIGN KEY (spot_id) REFERENCES parking_spots (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO pricing_config
    (id, first_hour_rate, additional_hour_rate, daily_rate, grace_minutes, rounding_minutes, updated_at)
VALUES
    (1, 12.00, 6.00, 45.00, 10, 60, NOW(6));

INSERT INTO parking_spots (number, status) VALUES
    ('01', 'AVAILABLE'), ('02', 'AVAILABLE'), ('03', 'AVAILABLE'), ('04', 'AVAILABLE'), ('05', 'AVAILABLE'),
    ('06', 'AVAILABLE'), ('07', 'AVAILABLE'), ('08', 'AVAILABLE'), ('09', 'AVAILABLE'), ('10', 'AVAILABLE'),
    ('11', 'AVAILABLE'), ('12', 'AVAILABLE'), ('13', 'AVAILABLE'), ('14', 'AVAILABLE'), ('15', 'AVAILABLE'),
    ('16', 'AVAILABLE'), ('17', 'AVAILABLE'), ('18', 'AVAILABLE'), ('19', 'AVAILABLE'), ('20', 'AVAILABLE');
