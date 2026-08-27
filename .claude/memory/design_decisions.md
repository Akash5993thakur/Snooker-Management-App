---
name: kakul-club-design-decisions
description: "Why key v1 technical and product decisions were made — do not re-litigate without Akash"
metadata:
  node_type: memory
  type: decisions
---

**Expo (React Native) over native Swift** — Akash asked for an Apple app; Swift needs a Mac + Xcode which he doesn't have. Expo runs on his iPhone via Expo Go with no Mac, publishes to the App Store later via EAS cloud builds, and covers Android (most local customers) from the same codebase.

**No navigation library** — custom tab bar in App.tsx with useState. Deliberate: minimal deps, trivial to reason about. Revisit only when a real navigation need appears (nested stacks, deep links).

**AsyncStorage, no backend (v1)** — single-device data is fine for launch; club runs from a counter device. v2 plan is Supabase/Firebase for live sync between customer phones and the counter. This is why every state-shape change needs a migration path.

**One app, PIN-gated staff mode** — instead of separate customer/staff apps. Same screens serve both audiences; staffMode reveals management actions. Default PIN 1234, changeable-PIN settings screen planned.

**Billing rounds to nearest minute, minimum 1 minute** — keeps bills fair for the customer and trivially explainable at the counter.

**Visual redesign (2026-08-27)** — v1 look judged rough by Akash. Redesign contract in design-handoff.md: functional scope frozen, priority screen is Tables, slot picker and bracket flagged as the hard design problems. Icons must come from @expo/vector-icons, fonts from Google Fonts (max 2 families), flat styles only.

**Zero corner radius confirmed (2026-08-27)** — Akash accepted the Felt & Brass zero-radius rule over v1's 14/10 rounding. It is one token change in theme.ts if the on-device feel ever disappoints, but as of now zero radius is the decision; the implementer checklist ("no borderRadius anywhere") stands.
