---
name: kakul-club-project-context
description: "Core business context, tech stack, and current build status — created 2026-08-27"
metadata:
  node_type: memory
  type: project
---

Kakul Snooker & Pool Club is a snooker & pool club in Akash's home town (India). This app manages the club: table booking, session billing, memberships, and tournaments — one app serving both customers (default view) and staff (PIN-gated staff mode).

**Tech Stack:** Expo SDK 54 / React Native 0.81 / TypeScript (downgraded from SDK 57 on 2026-08-28 to match the Expo Go on Akash's phone). No backend yet — all data on-device in AsyncStorage (key `kakul-club-state-v1`). Repo: C:\Users\akash\IdeaProjects\kakul-club (not yet on GitHub).

**Current Stage:** v1 functional (built 2026-08-27), runs via Expo Go. Visual redesign in progress — Claude Design is working from `design-handoff.md`; implementation of the hand-back is the next major phase.

**Key Files:**
- App.tsx — root, custom tab bar (5 tabs), staff PIN gate
- src/store.tsx — ALL state + persistence + business logic (billing, loyalty, brackets)
- src/types.ts — ClubState shape (tables, bookings, members, sales, tournaments)
- src/theme.ts — design tokens; src/ui.tsx — shared components
- src/screens/ — Dashboard, Tables, Booking, Members, Tournaments
- design-handoff.md — fixed functional scope for the redesign

**How to apply:** Frontend-only. Always run `npx tsc --noEmit` and `npx expo export --platform ios` before finishing any change.
