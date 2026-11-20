# Remaining work and handoff

## Current state

The MVP is functional end to end:

- Spring Boot API connected to MySQL, with Flyway schema migrations and demo data.
- JWT authentication with BCrypt password hashing and three roles: Administrator, Manager, Attendant.
- Role-based authorization enforced on the API and reflected in the Angular UI.
- Admin-only user management with account activation, role changes and password resets.
- Check-in, check-out, backend pricing, history, dashboard, spots and pricing screens.
- Verified in a headless browser: admin and attendant login, check-in, checkout with backend-calculated amount, history update, read-only pricing for attendants, blocked `/users` route for attendants.
- Backend unit tests for pricing, license plates and login throttling.
- MockMvc integration tests for the auth flow: login, 401/403, token expiry, role changes and account deactivation.
- Frontend production build passes (no automated frontend tests yet).
- Responsive pass at 320, 768 and 1024 px across all screens (plus 1280 and 1440 px on the dashboard) in headless Chromium, with no horizontal page overflow.
- Self-service password change for the signed-in account.
- A `prod` profile that requires `JWT_SECRET` and `ADMIN_PASSWORD` and disables demo data; the login page no longer exposes demo credentials.

The database was cleaned back to the seeded demo state: 20 spots, 3 parked vehicles, 4 completed sessions and 3 users.

## Demo accounts

Seeded only when `DEMO_DATA=true`. The login page no longer displays them.

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@patio.local` | `Admin@123` |
| Manager | `manager@patio.local` | `Manager@123` |
| Attendant | `attendant@patio.local` | `Attendant@123` |

## What remains before delivery

1. **Manual responsive review on real devices.** 320, 768 and 1024 px now pass across all screens (dashboard also at 1280 and 1440) in headless Chromium; a final pass on a real phone is still pending.
2. **Automated frontend tests.** None yet: add a test runner (Vitest) with coverage for plate/format helpers, session storage and route guards, plus one end-to-end happy path (check-in to checkout).
3. **Backend integration tests for auth.** Done with MockMvc web-slice tests. Add Testcontainers coverage if persistence-level behavior (Flyway, unique keys, locks) needs a real MySQL in CI.
4. **Production security hardening.**
   - Done: `prod` profile requires `JWT_SECRET` and `ADMIN_PASSWORD`, demo data/accounts are disabled, and the login page has no demo panel.
   - Remaining: serve behind HTTPS, move login throttling to a shared store if the API runs on multiple instances, and consider a token denylist or short-lived access tokens plus refresh tokens.
5. **Logout semantics.** Sign-out clears the browser session, but stateless JWTs remain valid until their 8-hour expiry if copied elsewhere.
6. **Session storage choice.** Tokens are kept in `sessionStorage` (tab-scoped). For higher-security deployments, evaluate HttpOnly secure cookies with CSRF protection.
7. **Password change for the signed-in user.** Done: `POST /api/auth/password` plus a sidebar dialog. Administrators can still reset passwords from the users screen.
8. **Production operations.** Add database backups, a migration/rollback runbook, structured logs and monitoring.
9. **Polish (optional).** Add CSV export for history, keyboard shortcut for check-in, and a printable checkout receipt.

## Known limitations

- Single parking lot only.
- No OCR, physical barriers, payment gateway or mobile app.
- No refresh tokens or server-side logout revocation.
- Login throttling is in-memory (five failures per email, fifteen-minute block and failure window).
- History and users lists are not paginated.
- Dates and currency use the browser/`Intl` `en-US` formatting while the currency is BRL.
- History filters follow the browser's native date input locale.
- Pricing is applied at checkout using the active configuration; there is no price snapshot per session.
- Demo seeder only creates movements when the database has no parking sessions.

## How to run

```bash
docker compose up -d
cd backend
mvn spring-boot:run

cd ../frontend
npm install
npm start
```

Open `http://localhost:4200` and sign in with one of the demo accounts.

Environment overrides:

- `DB_URL`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (minimum 32 bytes), `JWT_EXPIRATION_HOURS`
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `DEMO_DATA=false` to skip demo users and movements
- `CORS_ORIGINS` for the deployed frontend origin
