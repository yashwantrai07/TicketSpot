# TicketSpot Test Cases (TC01-TC12)

Use API client (Postman/Thunder Client) and UI to verify.

## Authentication
- **TC01** Valid registration -> account created successfully.
- **TC02** Invalid email format during registration -> validation error.
- **TC03** Missing required registration fields -> request rejected.
- **TC04** Valid login credentials -> role dashboard access works.
- **TC05** Incorrect password -> login denied.
- **TC06** Unauthorized role route access -> blocked with `403`.

## Event Management
- **TC07** Organizer submits valid event details -> event saved as `pending`.
- **TC08** Invalid event date/time format -> validation error.
- **TC09** Missing required event fields -> creation rejected.

## Booking
- **TC10** Valid booking with available ticket count -> booking confirmed.
- **TC11** Booking quantity exceeds available tickets -> booking rejected.
- **TC12** Rapid duplicate booking request attempt -> duplicate blocked.

## Evidence Checklist
- Save screenshot for each TC in `docs/evidence/` (create folder locally).
- Save request/response logs for failed validation scenarios.
