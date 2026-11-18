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
- Frontend production build passes.

The database was cleaned back to the seeded demo state: 20 spots, 3 parked vehicles, 4 completed sessions and 3 users.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@patio.local` | `Admin@123` |
| Manager | `manager@patio.local` | `Manager@123` |
| Attendant | `attendant@patio.local` | `Attendant@123` |

## What remains before delivery

1. **Manual responsive review on real devices.** The layouts were checked at 1440 px and 390 px, but the final pass should include 320 px, 768 px, 1024 px and a real phone.
2. **Automated frontend tests.** The frontend has no unit or end-to-end test suite; only the production build and headless browser checks were run.
3. **Backend integration tests for auth.** Current auth tests are unit tests. Add MockMvc or Testcontainers coverage for login, token expiry, 401/403 responses and role changes.
4. **Production security hardening.**
   - Set a strong `JWT_SECRET` and change the bootstrap `ADMIN_PASSWORD`.
   - Disable demo data and demo accounts before any real deployment.
   - Remove or hide the demo-account panel on the login page.
   - Serve over HTTPS.
   - Move login throttling to a shared store if the API runs on multiple instances.
   - Consider a token denylist or short-lived access tokens plus refresh tokens.
5. **Logout semantics.** Sign-out clears the browser session, but stateless JWTs remain valid until their 8-hour expiry if copied elsewhere.
6. **Session storage choice.** Tokens are kept in `sessionStorage` (tab-scoped). For higher-security deployments, evaluate HttpOnly secure cookies with CSRF protection.
7. **Password change for the signed-in user.** Users can have their password reset by an administrator, but there is no self-service password change screen.
8. **Production operations.** Add database backups, a migration/rollback runbook, structured logs and monitoring.
9. **Polish (optional).** Add CSV export for history, keyboard shortcut for check-in, and a printable checkout receipt.

## Known limitations

- Single parking lot only.
- No OCR, physical barriers, payment gateway or mobile app.
- No refresh tokens or server-side logout revocation.
- Login throttling is in-memory (five failures per email, fifteen-minute block).
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
