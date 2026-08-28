Status: DONE — implemented 2026-08-28 directly (owner-directed, same-day demo deadline; spec written as record, not pre-approved)

# Phase 1b — Demo Login & Per-User Booking Visibility

## 1. Goal
For today's demo: user-based login (end user + club staff) and booking privacy (end users never see other users' bookings) — with NO backend or db.

## 2. Scope
- IN: local login gate (AsyncStorage-persisted identity), booking visibility filtering, booking-as-identity, logout
- OUT: real authentication, passwords, server accounts, multi-device sync (v2 backend phase)

## 3. What was built
- `src/types.ts`: `UserAccount { name, phone, role: 'customer' | 'staff' }`; `ClubState.currentUser: UserAccount | null`. **Migration:** old AsyncStorage saves merge through `{...defaultState(), ...saved}` → `currentUser: null` → login screen. Safe both directions.
- `src/store.tsx`: `login(user)` (staff role also sets staffMode) and `logout()` (clears user + staffMode).
- `src/screens/Login.tsx` (new): Felt & Brass-styled gate. Customer = name + 10-digit phone (phone is the identity key, stated on-screen). Staff = PIN, silent clear on wrong entry (consistent with §5.17), auto-submits on 4th digit. DEMO PIN 1234 hint.
- `App.tsx`: renders `Login` until `state.currentUser` is set.
- `src/screens/Dashboard.tsx`: "Today's bookings" (list + stat tile count) filtered to `booking.phone === currentUser.phone` unless staffMode; ghost **Logout** header action.
- `src/screens/Booking.tsx`: "Upcoming bookings" filtered the same way; customers book under their logged-in identity ("BOOKING AS …" line replaces the name/phone inputs); staff keeps inputs to book on behalf of customers. Slot rail still shows TAKEN for all bookings (availability without identity).

## 3b. Same-day follow-ups (owner feedback after first demo check)
- Customers no longer see any staff entry point: `StaffControl` returns null unless `currentUser.role === 'staff'`; a customer's only header action is Logout (Home).
- Promo banner: `ClubState.promo: string` (same safe-merge migration, defaults ''); staff-only "Offer" ghost button in the Home header opens a sheet (set / remove); banner shows for everyone at the top of Home when non-empty (surface2 fill, brass OFFER eyebrow).

## 4. Known demo limitations (accepted)
- No passwords; anyone entering the same phone number sees those bookings. Real auth is v2 backend scope.
- Staff identity is a single shared "Staff" account behind the PIN.
- Bookings created before this change (or by staff with a blank phone) are visible only to staff.

## 5. Verification
- `npx tsc --noEmit` clean; `npx expo export --platform ios` succeeds (both run 2026-08-28).
- Staff gating unchanged; billing/loyalty/bracket logic untouched (only `addBooking` call sites changed, not store logic).
