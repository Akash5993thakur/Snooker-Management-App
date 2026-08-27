Status: DRAFT — needs real club details from Akash before spec-writer completes it

# Phase 2 — Real Club Configuration + Settings

## 1. Goal
Replace placeholder defaults with the club's real tables, rates, and hours, and make them editable in-app.

## 2. Scope (proposed)
- Confirm with Akash: table count & names, snooker/pool split, ₹/hr rates, open/close hours, staff PIN
- Settings screen (staff-only): edit club name, hours, staff PIN
- Migration: devices holding old defaults in AsyncStorage must pick up corrected values without losing bookings/members/sales

## 3. Open questions for Akash
- Real table inventory and rates?
- Club hours (weekday vs weekend different?)
- Half-hour slots needed, or 1-hour ok?
- Member pricing: does Monthly Pass change the hourly rate?
