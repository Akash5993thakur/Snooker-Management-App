Status: COMPLETE — implemented 2026-08-27 (built in Cowork cloud session, transferred to this repo)

# Phase 0 — v1 Baseline

## 1. Goal
A working first version of the club app: booking, table billing, members, tournaments, staff mode.

## 2. What was built
- 5 tabs (custom tab bar, no nav lib): Dashboard, Tables, Book, Members, Tourney
- Tables: start/stop sessions, live timer, auto bill (₹/hr), editable rates, add tables
- Book: 1-hr slots (today/tomorrow/day-after), double-booking prevention, staff cancel
- Members: register (Regular / Monthly Pass), auto visits + loyalty points at billing
- Tournaments: sign-ups, knockout bracket with byes, round-by-round winners, champion
- Staff mode via PIN (default 1234); customer view default
- State: React context + AsyncStorage (`kakul-club-state-v1`) in src/store.tsx

## 3. Exit criteria (verified at build time)
- [PASS] `npx tsc --noEmit` clean
- [PASS] `npx expo export --platform ios` succeeds
- [PASS] Runs in Expo Go

## 4. Known placeholders / debt
- Table counts, rates, hours, PIN are unconfirmed defaults (memory/tables_rates.md)
- Bill summary uses a system Alert (proper bill sheet is part of the redesign)
- No settings screen; PIN not changeable; no backend
