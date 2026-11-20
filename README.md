# Patio — Parking Management MVP

**Author:** Rodrigo Kuerten · [rodrigokuerten31@gmail.com](mailto:rodrigokuerten31@gmail.com)

A functional full-stack parking management system for small parking lots. It tracks parking spots, vehicle check-ins and check-outs, calculates charges from configurable pricing rules, and reports live operational metrics from MySQL.

## Stack

- **Backend:** Java 21, Spring Boot 3.5, Spring Data JPA / Hibernate, Bean Validation, Spring Security
- **Authentication:** JWT (HS256), BCrypt password hashing, role-based authorization
- **Database:** MySQL 8.4 with Flyway migrations
- **Frontend:** Angular 22, Tailwind CSS 4, Lucide icons
- **API:** REST + JSON, CORS configured for local development

## Features

- Dashboard with live occupancy, available spots, parked vehicles, daily revenue, occupancy rate and recent movements
- Parking spot management and capacity growth
- Vehicle check-in with license plate validation, duplicate protection, availability checks and automatic spot assignment
- Vehicle check-out with backend-calculated parking time and amount, preview before confirmation, and automatic spot release
- Pricing configuration: first hour, additional hour, daily cap, grace period and rounding block
- Movement history with license plate and date-range filters
- Transactional check-in/check-out operations, centralized exception handling and DTO-only API contracts
- MySQL constraints that prevent a spot or vehicle from having two open sessions
- Sign-in with three roles (Administrator, Manager, Attendant), guarded routes and protected API endpoints
- Self-service password change for the signed-in user
- Admin user management: create accounts, change roles, activate/deactivate and reset passwords
- Login throttling, active-account checks, password policy and protection against removing the last administrator
- Seeded demo users and movements on first run

## Project structure

```
backend/
  src/main/java/br/com/patio/
    auth/         login, token issuance and throttling
    config/       application, bootstrap accounts and demo data
    dashboard/    operational indicators
    pricing/      pricing rules and calculator
    security/     Spring Security, JWT filter and handlers
    session/      check-in, check-out and history
    shared/       validation, license plate and error handling
    spot/         parking spot management
    user/         accounts and role management
    vehicle/      vehicle registry
  src/main/resources/db/migration/   Flyway schema and seeds
frontend/
  src/app/
    core/         API client, auth/session, guards and formatting helpers
    features/     login, dashboard, spots, check-in, yard, history, pricing, users
    layout/       application shell
    shared/       reusable UI components
```

## Running locally

### Prerequisites

- JDK 21+
- Maven 3.9+
- Node.js 22.22+ or 24.15+
- MySQL 8.4 (Docker or a local installation)

### 1. Start MySQL

With Docker (MySQL is published on host port **3307** to coexist with a local MySQL on 3306):

```bash
docker compose up -d
```

Without Docker, create the database and user manually:

```sql
CREATE DATABASE estacionamento CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'parking'@'localhost' IDENTIFIED BY 'parking123';
GRANT ALL PRIVILEGES ON estacionamento.* TO 'parking'@'localhost';
```

The defaults match `backend/src/main/resources/application.yml`:

| Variable | Default |
|---|---|
| `DB_URL` | `jdbc:mysql://127.0.0.1:3307/estacionamento` |
| `DB_USER` | `parking` |
| `DB_PASSWORD` | `parking123` |
| `SERVER_PORT` | `8080` |
| `DEMO_DATA` | `true` |
| `CORS_ORIGINS` | `http://localhost:4200,http://127.0.0.1:4200` |
| `JWT_SECRET` | local development secret (minimum 32 bytes) |
| `JWT_EXPIRATION_HOURS` | `8` |
| `ADMIN_NAME` | `Patio Admin` |
| `ADMIN_EMAIL` | `admin@patio.local` |
| `ADMIN_PASSWORD` | `Admin@123` |

Flyway creates the schema and seeds 20 parking spots plus the initial pricing configuration on the first run. The backend creates the bootstrap administrator when the users table is empty. With `DEMO_DATA=true` it also creates the Manager and Attendant demo accounts and sample movements. Set `DEMO_DATA=false`, a strong `JWT_SECRET` and a custom `ADMIN_PASSWORD` for any non-demo environment.

The Docker container publishes MySQL on **host port 3307** so it can coexist with a local MySQL already using 3306. To point the API at a local MySQL instead, set `DB_URL=jdbc:mysql://127.0.0.1:3306/estacionamento` and create the database/user above.

### 2. Run the API

```bash
cd backend
mvn spring-boot:run
```

The API is available at `http://localhost:8080`.

### 3. Run the web app

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`. The Angular development server proxies `/api` to `http://localhost:8080` through `proxy.conf.json`.

If ports `8080`/`4200` are already taken by another local app, run the API on `8081` and the web app on `4201`:

```bash
# terminal 1
cd backend
SERVER_PORT=8081 CORS_ORIGINS=http://localhost:4201,http://127.0.0.1:4201 mvn spring-boot:run

# terminal 2
cd frontend
npm start -- --port 4201 --proxy-config proxy.8081.json
```

On PowerShell, set the two variables before `mvn spring-boot:run` with `$env:SERVER_PORT='8081'` and `$env:CORS_ORIGINS='http://localhost:4201,http://127.0.0.1:4201'`.

### Production profile

Start the API with `SPRING_PROFILES_ACTIVE=prod` and provide every secret through the environment:

```bash
SPRING_PROFILES_ACTIVE=prod \
JWT_SECRET="<at least 32 random bytes>" \
ADMIN_PASSWORD="<strong bootstrap password>" \
DB_URL="jdbc:mysql://<host>:3306/estacionamento" \
DB_USER="<user>" \
DB_PASSWORD="<password>" \
CORS_ORIGINS="https://<frontend-host>" \
java -jar parking-api.jar
```

`application-prod.yml` disables demo data and the demo accounts, and refuses to start when `JWT_SECRET` or `ADMIN_PASSWORD` is missing. Serve the app over HTTPS (terminate TLS in a reverse proxy or load balancer); `server.forward-headers-strategy=framework` makes the API honor forwarded headers.

## Accounts and roles

Demo accounts (created only when `DEMO_DATA=true`; never in the production profile):

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@patio.local` | `Admin@123` |
| Manager | `manager@patio.local` | `Manager@123` |
| Attendant | `attendant@patio.local` | `Attendant@123` |

| Capability | Administrator | Manager | Attendant |
|---|:---:|:---:|:---:|
| Dashboard, yard, history, pricing view | Yes | Yes | Yes |
| Check-in and check-out | Yes | Yes | Yes |
| Add parking spots | Yes | Yes | No |
| Change pricing | Yes | Yes | No |
| Manage users and roles | Yes | No | No |

The sidebar and actions follow the signed-in role. The API re-checks every request, so hiding a button is not the security boundary.

## Security notes

- Passwords are hashed with BCrypt (cost 12) and never returned by the API.
- Tokens are signed JWTs with an 8-hour expiry, issued only after a valid, active account signs in.
- Five failed attempts block an email for fifteen minutes (in-memory).
- Every authenticated request checks the account status and reloads its current role from MySQL.
- Administrators cannot remove their own administrator access, and the system always keeps at least one active administrator.
- The frontend stores the session in `sessionStorage` (tab-scoped) and sends it as a Bearer token.
- CORS is restricted to the configured frontend origins; CSRF is disabled because the API is stateless and does not use cookies.
- The production profile requires an explicit `JWT_SECRET` and `ADMIN_PASSWORD`, and disables demo data. The login page no longer exposes demo credentials.
- Sign-out is client-side; copied tokens remain valid until expiry. See `TODO.md` for the remaining production hardening items.

## Testing and build

```bash
cd backend
mvn test

cd ../frontend
npm test
npm run build
```

Backend tests cover the pricing calculation, license plate validation, login throttling and the HTTP auth flow (login, 401/403, token expiry, role changes and account deactivation) through MockMvc. Frontend tests cover plate/format helpers, session storage and route guards with Vitest.

## API

Except for `POST /api/auth/login`, every endpoint requires `Authorization: Bearer <token>`.

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| `POST` | `/api/auth/login` | Sign in and receive a JWT | Public |
| `GET` | `/api/auth/me` | Current account | All |
| `POST` | `/api/auth/password` | Change the signed-in user's password | All |
| `GET` | `/api/users` | List accounts | Admin |
| `POST` | `/api/users` | Create an account | Admin |
| `PUT` | `/api/users/{id}` | Update name, role, status or password | Admin |
| `GET` | `/api/dashboard` | Operational indicators and recent movements | All |
| `GET` | `/api/spots` | List spots with current vehicle | All |
| `POST` | `/api/spots` | Create a parking spot | Admin, Manager |
| `POST` | `/api/sessions/check-in` | Register a vehicle entry | All |
| `GET` | `/api/sessions/open` | List vehicles currently parked | All |
| `GET` | `/api/sessions/checkout-preview?licensePlate=` | Preview time and charge | All |
| `POST` | `/api/sessions/check-out` | Confirm exit and release the spot | All |
| `GET` | `/api/sessions/history?licensePlate=&from=&to=` | Closed movements with filters | All |
| `GET` | `/api/pricing` | Read pricing configuration | All |
| `PUT` | `/api/pricing` | Update pricing configuration | Admin, Manager |

### Check-in request

```json
{
  "licensePlate": "BRA2E19",
  "model": "Honda Civic",
  "color": "Black",
  "spotId": null
}
```

When `spotId` is omitted, the first available spot is assigned inside a database transaction. The API rejects invalid plates, duplicate open sessions and full lots with a `409 Conflict` and an explanatory message.

### Check-out request

```json
{
  "licensePlate": "BRA2E19"
}
```

The amount is always calculated on the server from the stored entry time, the current server time and the pricing configuration. The frontend never sends a value.

## Pricing rules

- Sessions up to the configured grace period are free.
- Parking time is rounded up to the configured block (default 60 minutes).
- The first hour uses the first-hour rate.
- Each additional started hour uses the additional-hour rate.
- Every 24-hour block is capped at the daily rate.
- The daily rate also caps the final partial day.

Default configuration: first hour R$ 12.00, additional hour R$ 6.00, daily rate R$ 45.00, 10-minute grace period, 60-minute rounding.

## Business integrity

- One open session per vehicle, enforced in the service and by a unique generated column in MySQL.
- One open session per parking spot, enforced in the service and by a unique generated column in MySQL.
- Check-in and check-out run in database transactions and lock the spot/session rows.
- Check-out is rejected when the vehicle is not parked.
- Plate validation accepts both legacy (`ABC1234`) and Mercosul (`ABC1D23`) formats.
- DTO validation protects every write endpoint.

## Demo flow

1. Sign in, then open the dashboard and review available spots.
2. Go to **Check in**, enter a plate, model and color, and submit.
3. The assigned spot appears occupied on the dashboard and in **Spots**.
4. Open **Yard** to see all parked vehicles and their current estimates.
5. Choose **Check out**, review the server-calculated charge, and confirm.
6. The spot is released and the movement appears in **History**.
7. The daily revenue on the dashboard updates immediately.

## Handoff

Open `TODO.md` for the remaining production tasks, known limitations and demo credentials. The UI/UX research repertoire lives in `UI-UX-REFERENCE.md`, with a visual index at `docs/ui-references/gallery.html`. The redesigned screens are captured in `docs/redesign-screenshots/`.
