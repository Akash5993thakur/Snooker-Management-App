# Design System — Felt & Brass

**Full spec:** [`.claude/specs/phase-1-design-tokens.md`](../specs/phase-1-design-tokens.md) — tokens, every component spec, icon names, all measurements in points. Build from that file; this is only the summary.

## Direction and why

Modernist structure on a dark felt ground: zero corner radius anywhere, 2 pt rules doing all the dividing, labels flush left including inside wide buttons, Archivo throughout. Flat colors and borders only — no shadows, no gradients, no glassmorphism, which is also what keeps it implementable in React Native as-is.

Why this over the v1 look:
- **Brass is the only accent**, so red is free to mean one thing. A red-topped, filled in-play table unit is now the loudest object on the Tables screen — the v1 problem was that everything was the same card.
- **Rules instead of cards** give hierarchy for free: stat tiles, list rows and table units are all differentiated by fill, rule weight and type size rather than by nesting more boxes.
- **Zero radius plus caps labels** reads as club signage rather than as a generic app, which covers the "no branding, no personality" complaint without inventing a logo.
- Snooker cues stay restrained: green appears only as the FREE outline and the confirmed-booking banner, brass carries money and loyalty. No ball-color decoration.

## Core palette

| Token | Hex | Role |
| --- | --- | --- |
| `ground` | `#0B120F` | Background, tab bar |
| `surface` | `#111C17` | Sheets, inputs |
| `surface2` | `#17251E` | In-play table, loyalty banner |
| `rule` | `#24382E` | Every 2 pt divider and border |
| `ink` / `inkDim` / `inkFaint` | `#F1F5F2` / `#93A89C` / `#62786C` | Text |
| `brass` | `#E3A93B` | **Single accent** — primary actions, money, points, selection |
| `live` | `#EC3013` | IN PLAY and destructive only |
| `felt` | `#1E7A4C` | FREE outline, booking confirmed |

## Fonts

- **Archivo** — 400 / 600 / 700 / 800. All text.
- **JetBrains Mono** — 400 / 700. Numerals only: timers, money, points, phone numbers, slot hours, PIN. Tabular figures stop the running timer and bill from jittering.

Both via `expo-font` (`@expo-google-fonts/archivo`, `@expo-google-fonts/jetbrains-mono`).

## Icons

**Ionicons** from `@expo/vector-icons` — one set, no mixing. Tabs: `home-outline`, `grid-outline`, `calendar-outline`, `people-outline`, `trophy-outline`. Full list in §4 of the spec. No emoji anywhere.

## Things that changed structurally

- The floating staff pill is gone; the staff control now lives in the header on every screen and shows a STAFF ON state.
- The 13-chip slot grid is now an 84 × 84 pt horizontal rail with explicit FREE / SELECTED / TAKEN states.
- The stop-session system alert is now a proper bill-summary bottom sheet, on the same sheet pattern every form uses.
- Empty states are dashed-rule boxes with fixed copy (spec §5.15).
