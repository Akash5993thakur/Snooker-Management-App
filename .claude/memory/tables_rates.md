---
name: kakul-club-tables-rates
description: "Table inventory, rates, hours, PIN — ALL PLACEHOLDERS, real values not yet confirmed by Akash"
metadata:
  node_type: memory
  type: data
---

**STATUS: PLACEHOLDERS.** These defaults were assumed at v1 build time and must be confirmed with Akash before being treated as real. Defined in `defaultState()` in src/store.tsx.

| Table | Type | Rate |
|---|---|---|
| Snooker 1–3 | snooker | ₹200/hr |
| Pool 1–2 | pool | ₹150/hr |

- Club hours: 10 AM – 11 PM (openHour 10, closeHour 23); booking slots run 10 AM–10 PM starts
- Staff PIN: 1234 (hardcoded default in state; changeable-PIN settings screen is a planned phase)
- Currency: ₹ throughout

When Akash confirms real values, update this file, update defaultState(), and plan a migration for devices already holding old defaults in AsyncStorage.
