Status: READY — Claude Design hand-back received 2026-08-27 (tokens spec + 14 mockups + canvas source in repo); spec-writer to fill in §4 implementation steps

# Phase 1 — Visual Redesign Implementation

## 1. Goal
Implement the Claude Design hand-back (tokens, components, screens) across the app without changing functional scope.

## 2. Scope
- IN: src/theme.ts tokens, src/ui.tsx components, all 5 screens, tab bar, sheets, icons (@expo/vector-icons), fonts (expo-font + Google Fonts), proper bill-summary sheet replacing the Alert
- OUT: any feature change, state-shape change, backend work

## 3. Prerequisites
- Claude Design deliverables received per design-handoff.md §6 (tokens table, component specs, 390×844 mockups)
- Paste/commit the hand-back into this folder as `phase-1-design-tokens.md` before implementation starts

## 4. Steps
- To be written by spec-writer once the hand-back arrives (map tokens → theme.ts, component specs → ui.tsx, then screen by screen, Tables first).

## 5. Exit criteria
- All colors/type/spacing come from theme tokens (no hardcoded values in screens)
- Icon set + fonts match the hand-back exactly (names documented)
- Functional scope identical to design-handoff.md §4 (reviewer walks every screen/flow)
- `npx tsc --noEmit` and `npx expo export --platform ios` pass
- Touch targets >= 44pt (slot picker and bracket taps explicitly checked)

## 6. Rollback
- Single revert of the phase's commits restores v1 visuals; no data/state impact.

## Open items from the design hand-back (none blocking)
1. Zero radius — CONFIRMED by Akash 2026-08-27 (see memory/design_decisions.md).
2. Club data (rates/hours/PIN) — still placeholders; mockups + tokens spec use ₹200/₹150, 10 AM–11 PM, PIN 1234. Real values are phase-2 scope; do not hardcode anything new that makes them harder to change.
3. Add-table and Add-member sheets — RESOLVED 2026-08-27: mockups delivered in hand-back v2 (tables-add-table-sheet.png, members-add-member-sheet.png).
4. Tourney bracket — Akash chose to skip the horizontal Bracket view capture; Rounds view PNG is the reference (staff tap there).
