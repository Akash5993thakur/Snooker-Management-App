---
name: kakul-club-app-behaviour
description: "Billing formula, booking rules, loyalty points, tournament bracket logic — as implemented in v1"
metadata:
  node_type: memory
  type: behaviour
---

All logic lives in `src/store.tsx`.

**Session billing (Tables screen, staff)**
- Session starts at Date.now(); stop computes minutes = max(1, round(elapsed/60000))
- Bill = round(minutes × hourlyRate / 60). Example: 85 min @ ₹200/hr = ₹283
- Sale recorded in state.sales with table, customer, memberId, start/end, minutes, amount
- Staff see a live estimated bill while the session runs (updates every 15s tick)

**Loyalty (Members)**
- If the billed session was linked to a member: visits +1, points += floor(amount/100) × 10 (i.e. 10 pts per full ₹100). ₹283 → 20 points
- Points/visits update ONLY at billing time, automatically — no manual credit

**Booking**
- 1-hour slots, start hours openHour..closeHour-1 (10 AM–10 PM default)
- Day choices: today / tomorrow / day-after only (offsets 0–2)
- Double-booking prevented per (tableId, dateISO, hour); addBooking returns an error string on clash, null on success
- Cancellation is staff-only in UI

**Tournaments**
- Single-elimination knockout. Sign-up phase → staff "Start bracket" (needs >= 2 players)
- Odd player count: last player gets a bye — match with p2 null, winner auto-set
- Recording the last winner of a round auto-generates the next round; a 1-winner round finishes the tournament and sets champion
- Anyone can add players during sign-up; only staff record winners

**Login & booking visibility (added 2026-08-28, demo-grade, local only)**
- App gates on a login screen (src/screens/Login.tsx) until `state.currentUser` is set: Customer path = name + 10-digit phone (no password — phone is the identity key); Staff path = PIN (sets staffMode on). Persisted in AsyncStorage with the rest of state; Logout button in the Home header clears it.
- Customers see ONLY their own bookings (rows where `booking.phone === currentUser.phone`) on Home "Today's bookings" and Book "Upcoming bookings"; staff sees all. Slot availability (TAKEN cells) still reflects all bookings — availability without identity.
- Customers book under their logged-in identity (no name/phone inputs); staff keeps the inputs to book on behalf of customers.
- No backend/db — this is device-local demo auth, to be replaced by real auth in the v2 backend phase.
- The header STAFF control renders ONLY for staff-role logins (customers see no staff entry point at all — StaffControl returns null for them; their only header action is Logout on Home).

**Promo banner (added 2026-08-28)**
- `state.promo` (string, '' = hidden). Staff-only "Offer" ghost button in the Home header opens a sheet to set/remove the text; everyone sees the banner (surface2 fill, brass OFFER eyebrow) at the top of Home when non-empty.

**Staff mode**
- Toggled via PIN sheet (state.staffPin); staffMode is session-only (not persisted)
- Gates: start/stop sessions, rates, add table, add member, cancel booking, start bracket, record winners, earnings/billing visibility, customer phone visibility
