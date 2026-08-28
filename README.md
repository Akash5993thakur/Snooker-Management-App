# Kakul Snooker & Pool Club — App (v1)

A mobile app for the club, built with Expo (React Native + TypeScript). Runs on iPhone and Android.

## What's inside

- **Home** — today's bookings, tables in play, tournaments; staff also see today's earnings and recent bills
- **Tables** — live table status; staff can start/stop sessions with an automatic timer and bill (₹/hour), edit rates, add tables
- **Book** — customers reserve 1-hour slots (today / tomorrow / day after) with double-booking prevention
- **Members** — register members (Regular / Monthly Pass); visits and loyalty points (10 pts per ₹100) update automatically when a member's session is billed
- **Tourney** — create knockout tournaments, open sign-ups, generate brackets, record winners round by round until a champion

**Login (demo, on-device):** the app opens on a sign-in screen — customers enter name + 10-digit phone (the phone identifies their bookings; no password in the demo), staff enter PIN `1234`. Customers only ever see their own bookings; staff sees everything. Logout is in the Home header.

**Staff mode:** log in as Staff (or tap the STAFF control in any header) with PIN `1234`. Staff mode unlocks billing, rates, member registration, cancellations, and tournament controls.

Data is saved on the device (AsyncStorage) — it survives app restarts. No server needed for v1.

## Run it on your iPhone (no Mac needed)

1. Install **Node.js** (LTS) on your computer if you don't have it: https://nodejs.org
2. Install the **Expo Go** app on your iPhone from the App Store.
3. Unzip this folder, then in a terminal:
   ```
   cd kakul-club
   npm install
   npx expo start
   ```
4. A QR code appears. Make sure your iPhone and computer are on the **same Wi-Fi**, then scan the QR with the iPhone Camera app — it opens in Expo Go.
   - If the same-Wi-Fi connection fails, run `npx expo start --tunnel` instead.

Works the same on Android with the Expo Go app from the Play Store.

## Publishing to the App Store later

When you're ready for a real installable app:

1. Get an Apple Developer account (₹~8,000/year).
2. `npm install -g eas-cli`, then `eas build --platform ios` — Expo builds it in the cloud, no Mac required.
3. `eas submit` uploads it to App Store Connect.

## Sensible next steps (v2)

- A shared backend (e.g. Supabase/Firebase) so customer phones and the counter device see the same live data
- WhatsApp/SMS booking confirmations
- UPI payment tracking, daily/monthly reports
- Changeable staff PIN and club settings screen

## Project handoff & sync (for Claude Code)

This repo is the **single source of truth**. It was scaffolded and v1 was built in a Claude Cowork cloud session on 2026-08-27, then transferred here (`C:\Users\akash\IdeaProjects\kakul-club`). The cloud copy is retired — all code changes happen in this repo from now on.

**Division of labor**
- **Claude chat / Cowork (project "Kakul Snooker & Pool Club")**: specs, feature planning, research, design, status doc. It learns current state by checking out this repo.
- **Claude Code (VS Code)**: implementation and review, working directly on this repo. Update `progress.md` and this section as part of finishing any task.

**Current state (phase-1 "Felt & Brass" redesign, 2026-08-28)**
- Expo SDK 54 / React Native 0.81 / TypeScript (downgraded from SDK 57 on 2026-08-28 so the app runs in the Expo Go version installed on Akash's phone). No navigation lib — custom tab bar in `App.tsx`. State in `src/store.tsx` (React context + AsyncStorage, key `kakul-club-state-v1`). No backend yet.
- Visual system implemented per `.claude/specs/phase-1-design-implementation.md`: dark felt ground, zero corner radius, brass (`#E3A93B`) as the single accent, red reserved for IN PLAY/Cancel, Archivo for text + JetBrains Mono for all numerals (timers, money, points, phone numbers, PIN). Tokens live in `src/theme.ts` (`C`, `S`, `T`); shared components in `src/ui.tsx` (`Screen`, `Btn`, `Chip`, `SegmentedControl`, `StaffControl`, `Sheet`, `Input`, `Badge`, `Empty`, `StatTile`, `ListRow`).
- New deps: `expo-font`, `@expo-google-fonts/archivo`, `@expo-google-fonts/jetbrains-mono`, and `@expo/vector-icons` (added as a direct dependency — it ships nested inside `expo`'s own `node_modules` and wasn't resolvable from the project root without installing it directly; see `expo-font` plugin added to `app.json`).
- The floating staff pill is gone; staff PIN entry + STAFF/STAFF ON now live in the header on every screen (`StaffControl`), PIN `1234` still works, wrong PIN just clears the field silently (no alert).
- The Tables screen's re-render tick moved from 15s to 1s so the elapsed timer/running bill visibly tick every second — the only sanctioned behavior change; billing math (`stopSession` in `store.tsx`) is untouched.
- The stop-session and booking-confirmed system alerts are now bottom sheets (Bill summary, Booking confirmed); other validation alerts (empty name, slot taken, etc.) are unchanged native alerts.
- Screens in `src/screens/`: Dashboard, Tables (session timer + ₹/hr billing), Booking (1-hr slots, double-booking prevention, 84×84pt slot rail), Members (visits + 10 pts per ₹100 auto-credit on billing), Tournaments (knockout brackets with byes, Rounds/Bracket views).
- Verified: `npx tsc --noEmit` clean; `npx expo export --platform ios` succeeds.

**Assumptions to confirm with Akash (placeholders)**
- 3 snooker tables @ ₹200/hr, 2 pool @ ₹150/hr, open 10 AM–11 PM (`defaultState()` in `src/store.tsx`).

**Pending / next**
- Akash's review of the phase-1 redesign (visual QA against `design/mockups/*.png`, especially on a real notched iPhone — see the header safe-area note in the implementation spec §C).
- Push to GitHub (git history is intact in this repo; remote not yet configured).
- Confirm real club details and update defaults.
- v2: shared backend (Supabase/Firebase), WhatsApp/SMS confirmations, UPI/payment reports, changeable staff PIN, settings screen.
- Repo structure now matches Akash's standard (added 2026-08-27): `.claude/agents/` (spec-writer, implementer, reviewer), `.claude/memory/` (MEMORY.md index + context/behaviour/decisions/rates), `.claude/specs/` (phase specs; phase-0 baseline COMPLETE, phase-1 design implementation IMPLEMENTED pending review, phase-2 club config DRAFT). Start any task by reading `.claude/memory/MEMORY.md`.
