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
