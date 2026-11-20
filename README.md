# Patio

Parking management for small lots: spots, vehicle check-in and check-out, server-side billing from configurable rates, and live operational numbers, with role-based access.

**Author:** Rodrigo Kuerten · [rodrigokuerten31@gmail.com](mailto:rodrigokuerten31@gmail.com)

| | |
|---|---|
| **Backend** | Java 21, Spring Boot 3.5, Spring Data JPA, Bean Validation, Spring Security (JWT) |
| **Database** | MySQL 8.4, Flyway migrations |
| **Frontend** | Angular 22, Tailwind CSS 4, Lucide icons, Geist font |

## Features

- **Dashboard:** occupancy, free spots, parked vehicles, revenue today, lot map and recent movements.
- **Check-in:** plate validation (legacy `ABC1234` and Mercosul `ABC1D23`), duplicate protection, automatic or manual spot.
- **Check-out:** the server computes time and amount; the attendant sees a preview before confirming.
- **Yard, History, Spots:** parked vehicles with estimates, filterable movement history with pagination, lot map with status filters.
- **Pricing:** first hour, extra hour, daily cap, grace period and rounding block, editable by managers.
- **Accounts:** three roles, user management, self-service password change, login throttling.
- **Integrity:** transactional operations and MySQL constraints so a spot or a vehicle never has two open sessions.

## Quick start

Requirements: JDK 21+, Maven 3.9+, Node.js 22.22+ (or 24.15+), Docker (or a local MySQL 8.4).

```bash
# 1. database (published on host port 3307)
docker compose up -d

# 2. API on http://localhost:8080
cd backend
mvn spring-boot:run

# 3. web app on http://localhost:4200 (proxies /api to :8080)
cd frontend
npm install
npm start
```

Sign in with a demo account (created when `DEMO_DATA=true`, the default):

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@patio.local` | `Admin@123` |
| Manager | `manager@patio.local` | `Manager@123` |
| Attendant | `attendant@patio.local` | `Attendant@123` |

Flyway creates the schema, 20 spots and the default pricing on first run. With demo data on, the API also seeds the three accounts and sample movements.

<details>
<summary>Using a local MySQL instead of Docker</summary>

```sql
CREATE DATABASE estacionamento CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'parking'@'localhost' IDENTIFIED BY 'parking123';
GRANT ALL PRIVILEGES ON estacionamento.* TO 'parking'@'localhost';
```

Then start the API with `DB_URL=jdbc:mysql://127.0.0.1:3306/estacionamento`.
</details>

## Configuration

Environment variables read by the API (defaults in `backend/src/main/resources/application.yml`):

| Variable | Default |
|---|---|
| `DB_URL` | `jdbc:mysql://127.0.0.1:3307/estacionamento` |
| `DB_USER` / `DB_PASSWORD` | `parking` / `parking123` |
| `SERVER_PORT` | `8080` |
| `CORS_ORIGINS` | `http://localhost:4200,http://127.0.0.1:4200` |
| `JWT_SECRET` | local development secret (minimum 32 bytes) |
| `JWT_EXPIRATION_HOURS` | `8` |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `Patio Admin` / `admin@patio.local` / `Admin@123` |
| `DEMO_DATA` | `true` |

If `8080` or `4200` are taken, run the API with `SERVER_PORT=8081 CORS_ORIGINS=http://localhost:4201` and point `frontend/proxy.conf.json` at the new port, then start the web app with `npm start -- --port 4201`.

### Production

```bash
SPRING_PROFILES_ACTIVE=prod \
JWT_SECRET="<at least 32 random bytes>" \
ADMIN_PASSWORD="<strong bootstrap password>" \
DB_URL="jdbc:mysql://<host>:3306/estacionamento" \
DB_USER="<user>" DB_PASSWORD="<password>" \
CORS_ORIGINS="https://<frontend-host>" \
java -jar parking-api.jar
```

The `prod` profile disables demo data and refuses to start without `JWT_SECRET` and `ADMIN_PASSWORD`. Terminate TLS in a reverse proxy; forwarded headers are honored.

## Roles

| Capability | Administrator | Manager | Attendant |
|---|:---:|:---:|:---:|
| Dashboard, yard, history, view pricing | ✓ | ✓ | ✓ |
| Check-in and check-out | ✓ | ✓ | ✓ |
| Add spots, change pricing | ✓ | ✓ | |
| Manage users and roles | ✓ | | |

The UI follows the signed-in role, but the API re-checks every request; hiding a button is not the security boundary.

## API

Everything except `POST /api/auth/login` needs `Authorization: Bearer <token>`.

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| `POST` | `/api/auth/login` | Sign in, receive a JWT | Public |
| `GET` | `/api/auth/me` | Current account | All |
| `POST` | `/api/auth/password` | Change own password | All |
| `GET` `POST` | `/api/users` | List / create accounts | Admin |
| `PUT` | `/api/users/{id}` | Update name, role, status or password | Admin |
| `GET` | `/api/dashboard` | Indicators and recent movements | All |
| `GET` | `/api/spots` | Spots with current vehicle | All |
| `POST` | `/api/spots` | Create a spot | Admin, Manager |
| `POST` | `/api/sessions/check-in` | Register an entry | All |
| `GET` | `/api/sessions/open` | Vehicles currently parked | All |
| `GET` | `/api/sessions/checkout-preview?licensePlate=` | Preview time and charge | All |
| `POST` | `/api/sessions/check-out` | Confirm exit, release the spot | All |
| `GET` | `/api/sessions/history?licensePlate=&from=&to=` | Movements with filters | All |
| `GET` `PUT` | `/api/pricing` | Read / update rates | All / Admin, Manager |

Errors use `{ timestamp, status, error, message, fields }`. Business rule violations (invalid plate, duplicate open session, full lot) return `409`.

Check-in body: `{ "licensePlate": "BRA2E19", "model": "Honda Civic", "color": "Black", "spotId": null }`. Without `spotId`, the first free spot is assigned inside a transaction. Check-out takes only `{ "licensePlate": "BRA2E19" }`; the amount is never sent by the client.

## Pricing rules

- Stays up to the grace period are free.
- Time is rounded up to the configured block, then billed: first hour at the first-hour rate, each additional started hour at the additional rate.
- Each full 24 hours is charged the daily rate, and the final partial day never exceeds it.

Defaults: first hour R$ 12.00, extra hour R$ 6.00, daily R$ 45.00, 10-minute grace, 60-minute rounding.

## Security

- BCrypt (cost 12) password hashes, never returned by the API; password policy of 8–72 characters with a letter and a number.
- Signed JWTs (HS256, 8 h). Each request re-checks that the account is active and reloads its role from MySQL.
- Five failed sign-ins block an email for fifteen minutes (in memory).
- The last active administrator cannot be demoted or deactivated.
- The session lives in `sessionStorage` and is sent as a Bearer token. CORS is limited to the configured origins; CSRF is off because the API is stateless and cookie-free.
- Sign-out is client-side: a copied token stays valid until it expires. See [TODO.md](TODO.md) for the remaining hardening.

## Project structure

```
backend/src/main/java/br/com/patio/
  auth/ config/ dashboard/ pricing/ security/ session/ shared/ spot/ user/ vehicle/
backend/src/main/resources/db/migration/   Flyway schema and seeds
frontend/src/app/
  core/       API client, session, guards, formatting
  features/   login, dashboard, check-in, yard, spots, history, pricing, users
  layout/     shell and change-password dialog
  shared/     modal, toasts, metric cards, empty state, plate and spot components
```

## Tests and build

```bash
cd backend && mvn test        # pricing, plates, login throttling, MockMvc auth flow
cd frontend && npm run build  # production bundle
```

The frontend has no automated tests yet.

## Design

The UI follows a shadcn/Vercel light style (Geist, neutral palette, black primary buttons, 1 px borders). The research behind it is in [UI-UX-REFERENCE.md](UI-UX-REFERENCE.md).

## Scope

Single parking lot. No OCR, barriers, payment gateway, mobile app or refresh tokens. Remaining work and known limitations are in [TODO.md](TODO.md).
