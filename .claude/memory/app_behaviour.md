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

**Staff mode**
- Toggled via PIN sheet (state.staffPin); staffMode is session-only (not persisted)
- Gates: start/stop sessions, rates, add table, add member, cancel booking, start bracket, record winners, earnings/billing visibility, customer phone visibility
