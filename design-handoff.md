# Design Handoff — Kakul Snooker & Pool Club App

**For:** Claude Design
**From:** v1 implementation (Expo / React Native, repo `kakul-club`)
**Date:** 2026-08-27
**Ask:** Redesign the app's visual system and all 5 screens. v1 is functional but visually rough — treat this as a full visual redesign with the functionality below as fixed scope. Propose 2–3 visual directions first if useful, then a full spec for the chosen one.

---

## 1. Product context

- A mobile app for a snooker & pool club in a small Indian town. Currency is ₹.
- Two audiences in one app:
  - **Customers** (default view): check live table availability, book a 1-hour slot, see members list, follow tournaments.
  - **Staff/owner** (unlocked by PIN via a "Staff login" control): start/stop table sessions with a running timer and auto-computed bill, edit rates, add tables, register members, cancel bookings, run tournament brackets, see earnings.
- Platform: iPhone-first (390×844 target artboard), Android later. Single dark theme is fine (club is a dim, green-felt environment — leaning into that is welcome), but it must stay readable in a bright room.
- Tone wanted: feels like a proper club — confident, a bit premium, sporty. Not corporate, not childish. Snooker culture cues (felt green, brass/gold, ball colors) are welcome if used tastefully, not literally everywhere.

## 2. What's wrong with v1 (why we're redesigning)

- Emoji used as tab icons and status markers (⌂ 🎱 📅 👥 🏆) — looks cheap.
- A floating "Staff login" pill overlaps the header area; header hierarchy is weak.
- Everything is the same card — no visual hierarchy between stats, lists, and live/active states.
- The booking time-slot picker is 13 identical chips wrapping into a messy grid.
- Live table sessions (the most important thing on screen for staff) don't stand out enough.
- No branding: no logo/wordmark, no personality, generic empty states (plain text in a box).
- Spacing and type are uniform; nothing guides the eye.

## 3. Current design tokens (starting point — free to replace entirely)

- Background `#0c1b14`, surface `#132921`, surface-2 `#1b3a2d`, border `#28503f`
- Accent green `#2fbf71`, gold `#e8b84b`, red/danger `#e0574f`, blue `#4f9de0`
- Text `#eef7f1`, dim `#9db8ab`, faint `#6d8a7c`
- Radius 14 (cards) / 10 (buttons, inputs) / pill chips; system font, weights 700–800 for emphasis

## 4. Screens and their fixed content (design these, don't change scope)

Global elements on every screen: bottom tab bar with 5 tabs (Home, Tables, Book, Members, Tourney) and a staff-mode entry point (currently a pill top-right; feel free to relocate — e.g. into Home or a profile corner — as long as it's reachable from anywhere and shows an active "staff mode on" state).

### 4.1 Home (dashboard)
- Club name + open hours + today's date.
- Stat tiles: tables in play (x/y), bookings today; staff also see: earnings today (₹), member count.
- "Today's bookings" list: time, customer name, table name.
- "Tournaments" list: name, date, players, entry fee, status (sign-ups open / live).
- Staff only: "Recent billing" list: customer, table, minutes, amount.
- Empty states needed for bookings, tournaments, billing.

### 4.2 Tables (the money screen — prioritize this one)
- One unit per table (card/row/tile — your call): table name, type (Snooker/Pool), rate (₹/hr), status **FREE** vs **IN PLAY**.
- When in play: customer name, elapsed time (e.g. "1h 25m"), and for staff a live estimated bill. This active state should be impossible to miss.
- Staff actions: per free table "Start" and "Rate"; per busy table "Stop & bill"; header action "+ Table".
- Modals/sheets: Start session (customer name input + member quick-pick chips), Edit rate, Add table (name, type toggle, rate). Design the sheet pattern once, reused everywhere.
- After "Stop & bill": a bill summary moment (currently a system alert — design a proper bill card/sheet: table, customer, minutes, amount).

### 4.3 Book
- Pickers: day (Today / Tomorrow / day-after), table, and time slot — 13 one-hour slots from 10 AM to 10 PM where some are disabled (already booked). **Redesign the slot picker properly** (grid, timeline, or wheel — your call; must show free vs taken vs selected clearly).
- Inputs: name, phone. Primary CTA "Confirm booking". Success confirmation moment.
- "Upcoming bookings" list: customer, table, date, time; staff additionally see phone + a cancel action.

### 4.4 Members
- Header: count + loyalty rule ("10 points per ₹100 played").
- Member rows: name, plan (Regular / Monthly Pass), joined date, points (prominent), visits; staff also see phone.
- Staff: "+ Member" action → sheet (name, phone, plan toggle).
- A membership-card visual treatment for rows (or a featured card) would fit the loyalty angle.

### 4.5 Tourney (tournaments)
- Tournament cards: name, date, entry fee, player count, status badge (SIGN-UPS OPEN / LIVE / FINISHED), champion banner when finished.
- Sign-up phase: player list, add-player input, staff "Start bracket" CTA.
- Running phase: knockout bracket by rounds (Round 1, 2, …), each match "A vs B" with winner marked; staff tap to record winner; byes shown as auto-advanced. Design a bracket that works on a phone width (vertical rounds list is fine; a visual bracket is a bonus).

### 4.6 Overlays
- Staff PIN sheet (numeric entry), and the shared bottom-sheet pattern used by all forms above.

## 5. Constraints (so the design is implementable as-is)

- React Native (Expo). Everything must be expressible as flat colors, borders, radii, spacing, and font sizes/weights. Gradients possible (expo-linear-gradient) but use sparingly; no blurs/shadows-heavy glassmorphism.
- Icons: pick from a single set available in `@expo/vector-icons` (Ionicons / MaterialCommunityIcons / Feather) — name each icon you use.
- Fonts: max 2 families, must exist on Google Fonts (loaded via expo-font). Name exact family + weights.
- Touch targets ≥ 44pt; slot picker and bracket taps are the risky ones.
- One theme (dark) is enough for now.

## 6. Deliverables wanted back (hand-back format for Claude Code)

1. **Design tokens** as a single table/JSON: colors (semantic names), type scale (size/weight/line-height), spacing scale, radii, icon set + names.
2. **Component specs**: tab bar, header, stat tile, list row, table unit (free + in-play + staff variants), chip/segmented control, slot picker, buttons (primary/secondary/danger/disabled), input, bottom sheet, status badges, empty state, bill summary.
3. **Screen mockups**: all 5 screens ×(customer, staff) where they differ, plus Start-session sheet, bill summary, PIN sheet — at 390×844.
4. Every measurement in points; every color as hex referencing token names — so implementation is mechanical.

Claude Code will implement from this against `src/theme.ts`, `src/ui.tsx`, and `src/screens/*` — the current structure maps 1:1 onto the component list above.
