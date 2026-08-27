# Kakul Snooker & Pool Club — App (v1)

A mobile app for the club, built with Expo (React Native + TypeScript). Runs on iPhone and Android.

## What's inside

- **Home** — today's bookings, tables in play, tournaments; staff also see today's earnings and recent bills
- **Tables** — live table status; staff can start/stop sessions with an automatic timer and bill (₹/hour), edit rates, add tables
- **Book** — customers reserve 1-hour slots (today / tomorrow / day after) with double-booking prevention
- **Members** — register members (Regular / Monthly Pass); visits and loyalty points (10 pts per ₹100) update automatically when a member's session is billed
- **Tourney** — create knockout tournaments, open sign-ups, generate brackets, record winners round by round until a champion

**Staff mode:** tap "Staff login" (top-right) and enter PIN `1234`. Staff mode unlocks billing, rates, member registration, cancellations, and tournament controls.

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

**Current state (v1, 2026-08-28)**
- Expo SDK 54 / React Native 0.81 / TypeScript (downgraded from SDK 57 on 2026-08-28 so the app runs in the Expo Go version installed on Akash's phone). No navigation lib — custom tab bar in `App.tsx`. State in `src/store.tsx` (React context + AsyncStorage, key `kakul-club-state-v1`). No backend yet.
- Screens in `src/screens/`: Dashboard, Tables (session timer + ₹/hr billing), Booking (1-hr slots, double-booking prevention), Members (visits + 10 pts per ₹100 auto-credit on billing), Tournaments (knockout brackets with byes).
- Staff mode gated by PIN `1234` (stored in state as `staffPin`); customer view is the default.
- Verified: `npx tsc --noEmit` clean; `npx expo export --platform ios` succeeds.

**Assumptions to confirm with Akash (placeholders)**
- 3 snooker tables @ ₹200/hr, 2 pool @ ₹150/hr, open 10 AM–11 PM (`defaultState()` in `src/store.tsx`).

**Pending / next**
- Push to GitHub (git history is intact in this repo; remote not yet configured).
- Confirm real club details and update defaults.
- v2: shared backend (Supabase/Firebase), WhatsApp/SMS confirmations, UPI/payment reports, changeable staff PIN, settings screen.
- Repo structure now matches Akash's standard (added 2026-08-27): `.claude/agents/` (spec-writer, implementer, reviewer), `.claude/memory/` (MEMORY.md index + context/behaviour/decisions/rates), `.claude/specs/` (phase specs; phase-0 baseline COMPLETE, phase-1 design implementation BLOCKED on Claude Design hand-back, phase-2 club config DRAFT). Start any task by reading `.claude/memory/MEMORY.md`.
