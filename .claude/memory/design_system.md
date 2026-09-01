# Design System — Modernist, light theme

**Full spec:** [`.claude/specs/phase-1-design-tokens.md`](../specs/phase-1-design-tokens.md) — tokens, every component spec, icon names, all measurements in points. Build from that file; this is only the summary.

## Direction and why

Modernist structure on a white ground: zero corner radius anywhere, 2 pt rules doing all the dividing, labels flush left including inside wide buttons, Archivo throughout. Flat colors and borders only — no shadows, no gradients, no glassmorphism, which is also what keeps it implementable in React Native as-is.

**Palette history.** The first pass was "Felt & Brass" — dark green ground, brass accent, leaning into the club's dim room. The owner directed a light theme on 2026-08-28: white ground, blue accent. Token *names* were kept (`brass` now holds the blue), so no component signature changed. Structure, type, spacing and icons are identical across both.

Why this over the v1 look:
- **One accent only**, so red is free to mean one thing. A red-topped, filled in-play table unit is now the loudest object on the Tables screen — the v1 problem was that everything was the same card.
- **Rules instead of cards** give hierarchy for free: stat tiles, list rows and table units are all differentiated by fill, rule weight and type size rather than by nesting more boxes.
- **Zero radius plus caps labels** reads as club signage rather than as a generic app, which covers the "no branding, no personality" complaint without inventing a logo.
- Green survives the theme change as the FREE outline and the confirmed-booking banner only. No ball-color decoration.

## Core palette

| Token | Hex | Role |
| --- | --- | --- |
| `ground` | `#FFFFFF` | Background, tab bar |
| `surface` | `#F5F7F9` | Sheets, inputs |
| `surface2` | `#EDF1F4` | In-play table, loyalty banner |
| `rule` | `#D9DEE3` | Every 2 pt divider and border |
| `ink` / `inkDim` / `inkFaint` | `#15181B` / `#4E5A64` / `#7C8790` | Text |
| `brass` | `#1558D6` | **Single accent** (blue) — button labels, money, points, selected fills |
| `accentSoft` | `#E7EEFB` | Primary-button fill |
| `live` | `#D7301F` | IN PLAY and destructive only |
| `felt` | `#1E7A4C` | FREE outline, booking confirmed |

## Fonts

- **Archivo** — 400 / 600 / 700 / 800. All text.
- **JetBrains Mono** — 400 / 700. Numerals only: timers, money, points, phone numbers, slot hours, PIN. Tabular figures stop the running timer and bill from jittering.

Both via `expo-font` (`@expo-google-fonts/archivo`, `@expo-google-fonts/jetbrains-mono`).

## Icons

**Ionicons** from `@expo/vector-icons` — one set, no mixing. Tabs: `home-outline`, `grid-outline`, `calendar-outline`, `people-outline`, `trophy-outline`. Full list in §4 of the spec. No emoji anywhere.

## Things that changed structurally

**STATUS: IMPLEMENTED (phase-1, 2026-08-28)** — the items below now match shipped code in `src/theme.ts`, `src/ui.tsx`, `App.tsx`, and `src/screens/*`, per `.claude/specs/phase-1-design-implementation.md`.

- The floating staff pill is gone; the staff control now lives in the header on every screen (`StaffControl` in `src/ui.tsx`, rendered by `Screen`) and shows a STAFF ON state.
- The 13-chip slot grid is now an 84 × 84 pt horizontal rail with explicit FREE / SELECTED / TAKEN states (`Booking.tsx`).
- The stop-session system alert is now a proper bill-summary bottom sheet, on the same sheet pattern every form uses (`Tables.tsx`).
- The booking-confirmed alert is now a bottom sheet with a felt banner (`Booking.tsx`).
- Empty states are dashed-rule boxes with fixed copy (spec §5.15), via the `Empty` component.
- The wrong-PIN alert is gone; the PIN sheet silently clears the field on a mismatch (`StaffControl`).
- The v1 `✕` sheet-close glyph is gone; sheets close via a `chevron-down-outline` Ionicon.

**Behavior-adjacent detail:** the Tables screen's re-render tick interval moved from 15s to 1s (`Tables.tsx`), so the elapsed timer and running bill visibly tick every second, matching §5.7 ("Timer and bill both tick every second"). This is the one sanctioned behavioral change in phase 1 — it only affects render frequency; `stopSession` in `store.tsx` still computes `minutes`/`amount` from real elapsed `Date.now()` at stop time, unchanged.
