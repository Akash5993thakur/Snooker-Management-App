# Phase 1 — Design Tokens & Component Specs

**Direction:** Modernist structure, light theme (owner-directed 2026-08-28 — white ground, blue accent). Token *names* are carried over from the original Felt & Brass pass so no component signature changed.
**Source of truth for:** `src/theme.ts`, `src/ui.tsx`, `src/screens/*`
**Scope:** visual redesign only. Functional scope is fixed by `design-handoff.md` §4.
**Artboard:** 390 × 844 pt (iPhone). All measurements below are in **points**.
**Mockups:** `design/mockups/*.png` — one file per screen state.

---

## 0. The direction in one paragraph

Modernist structure on a white ground. Everything is flat: **zero corner radius anywhere**, 2 pt rules doing all the dividing, labels flush left (including inside wide buttons), and Archivo throughout. **Blue `#1558D6` is the single accent** — it carries every button label, every money value, every selected fill. **Red `#D7301F` is reserved for IN PLAY and destructive actions only**, which is what makes a live table impossible to miss. Green appears only as the FREE outline and the booking-confirmed banner. No cards, no shadows, no gradients.

The light theme replaced the original dark felt palette on the owner's direction. Structure, type scale, spacing, icons and every component spec below are unchanged — only the hexes in §1 moved, plus the one shape change noted in §5.8 (primary buttons are a soft-tint fill with an accent label rather than a solid accent fill).

---

## 1. Color tokens

Semantic names map 1:1 onto `src/theme.ts`.

| Token | Hex | Use |
| --- | --- | --- |
| `ground` | `#FFFFFF` | App background, tab bar background |
| `surface` | `#F5F7F9` | Bottom sheets, inputs, taken slot fill |
| `surface2` | `#EDF1F4` | In-play table unit, loyalty banner |
| `rule` | `#D9DEE3` | Every 2 pt divider, all control borders |
| `ruleFaint` | `#E9EDF0` | Border of a disabled (taken) slot only |
| `ink` | `#15181B` | Primary text |
| `inkDim` | `#4E5A64` | Secondary text, inactive control labels |
| `inkFaint` | `#7C8790` | Eyebrow labels, meta lines, inactive tabs |
| `inkMute` | `#AEB7BE` | Disabled text (taken slot, bye slot) |
| `brass` | `#1558D6` | **Single accent** (blue). Selected fills, money, points, all button labels |
| `brassInk` | `#FFFFFF` | Text on an accent fill |
| `accentSoft` | `#E7EEFB` | Primary-button fill (label is `brass`) |
| `live` | `#D7301F` | IN PLAY badge + top bar, destructive actions |
| `liveInk` | `#FFFFFF` | Text on a live fill |
| `felt` | `#1E7A4C` | FREE tag border, booking-confirmed banner fill |
| `feltText` | `#177347` | FREE label text on `ground` |
| `scrim` | `rgba(9, 14, 20, 0.45)` | Bottom-sheet backdrop |

**Rules of use**
- The accent appears at most twice per viewport as a solid *fill*; unlimited as text. `accentSoft` is not counted — it is the button ground.
- Red is never used for emphasis, warnings, or badges other than LIVE and Cancel.
- No color outside this table. No gradients. No shadows (`elevation: 0` on every surface).

### `src/theme.ts`

```ts
export const C = {
  ground: '#FFFFFF',
  surface: '#F5F7F9',
  surface2: '#EDF1F4',
  rule: '#D9DEE3',
  ruleFaint: '#E9EDF0',
  ink: '#15181B',
  inkDim: '#4E5A64',
  inkFaint: '#7C8790',
  inkMute: '#AEB7BE',
  brass: '#1558D6',
  brassInk: '#FFFFFF',
  accentSoft: '#E7EEFB',
  live: '#D7301F',
  liveInk: '#FFFFFF',
  felt: '#1E7A4C',
  feltText: '#177347',
  scrim: 'rgba(9, 14, 20, 0.45)',
} as const;
```

---

## 2. Typography

Two families, both Google Fonts, loaded via `expo-font`.

| Family | Weights to load | Role |
| --- | --- | --- |
| **Archivo** | 400, 600, 700, 800 | Everything textual |
| **JetBrains Mono** | 400, 700 | Numerals only: timers, money, points, phone numbers, slot hours, PIN |

```
Archivo_400Regular, Archivo_600SemiBold, Archivo_700Bold, Archivo_800ExtraBold
JetBrainsMono_400Regular, JetBrainsMono_700Bold
```
(`@expo-google-fonts/archivo`, `@expo-google-fonts/jetbrains-mono`)

Mono is a **functional** choice: tabular figures keep a ticking timer and a running bill from jittering.

### Type scale

| Token | Family / weight | Size / line-height | Letter-spacing | Use |
| --- | --- | --- | --- | --- |
| `display` | Archivo 800 | 34 / 34 | −0.34 | Champion name |
| `h1` | Archivo 800 | 26 / 28 | −0.26 | Screen title |
| `h2` | Archivo 800 | 22 / 24 | −0.22 | In-play table name |
| `h3` | Archivo 700 | 18 / 22 | 0 | Free table name, tournament name |
| `h4` | Archivo 700 | 17 / 22 | 0 | Member name |
| `body` | Archivo 600 | 15 / 20 | 0 | List row primary text |
| `bodySm` | Archivo 600 | 13 / 18 | 0 | Chips, player tags |
| `label` | Archivo 800 | 13 / 16 | +1.8 (caps) | Section headers, primary button labels |
| `micro` | Archivo 800 | 11 / 14 | +1.3 (caps) | Eyebrows, badges, tab labels, meta |
| `nano` | Archivo 800 | 10 / 13 | +1.2 (caps) | Status badges, points caption |
| `monoXl` | JetBrains Mono 700 | 34 / 34 | 0 | Elapsed timer, running bill |
| `monoDisplay` | JetBrains Mono 700 | 44 / 44 | 0 | Bill total on the bill sheet |
| `monoLg` | JetBrains Mono 700 | 26 / 28 | 0 | Points, stat tile values (30 on stat tiles) |
| `monoMd` | JetBrains Mono 700 | 16 / 20 | 0 | Amounts, rate values |
| `monoSm` | JetBrains Mono 700 | 13 / 18 | 0 | Phone numbers, counts |

All caps tokens (`label`, `micro`, `nano`) are `textTransform: 'uppercase'`.
Nothing is below 10 pt; nothing that is not a caps label is below 13 pt.

---

## 3. Spacing, rules, radii

| Token | Value | Notes |
| --- | --- | --- |
| `space1` | 4 | |
| `space2` | 8 | |
| `space3` | 12 | |
| `space4` | 16 | Standard vertical padding inside a unit |
| `space5` | 20 | **Screen gutter — every screen, left and right** |
| `space6` | 26 | Gap between major sections |
| `space7` | 32 | |
| `radius` | **0** | Everywhere. No exceptions, including chips and badges. |
| `rule` | 2 | Every divider and every control border |
| `ruleAccent` | 5 | In-play top bar, sheet top border |
| `tapMin` | 44 | Minimum interactive height |
| `tapPrimary` | 48 | Primary buttons; 52 on sheet CTAs |
| `statusBar` | 44 | |
| `header` | 72 | Below the status bar |
| `tabBar` | 84 | Including the home-indicator area |
| `scrollTop` | 116 | statusBar + header, where the scroll view begins |

```ts
export const S = {
  s1: 4, s2: 8, s3: 12, s4: 16, s5: 20, s6: 26, s7: 32,
  radius: 0, rule: 2, ruleAccent: 5,
  tapMin: 44, tapPrimary: 48,
  statusBar: 44, header: 72, tabBar: 84, scrollTop: 116,
} as const;
```

---

## 4. Icons — Ionicons (`@expo/vector-icons/Ionicons`)

One set only. Tab icons 24 pt; inline icons 18 pt; icons inherit the label color of their control.

| Where | Icon name | Size |
| --- | --- | --- |
| Tab — Home | `home-outline` | 24 |
| Tab — Tables | `grid-outline` | 24 |
| Tab — Book | `calendar-outline` | 24 |
| Tab — Members | `people-outline` | 24 |
| Tab — Tourney | `trophy-outline` | 24 |
| Staff control, locked | `lock-closed-outline` | 16 |
| Staff control, active | `shield-checkmark` | 16 |
| Header `+ Table` / `+ Member` | `add-outline` | 16 |
| Cancel booking | `close-outline` | 16 |
| Sheet close | `chevron-down-outline` | 18 |
| Winner recorded | `checkmark-sharp` | 16 |
| Slot taken | `remove-outline` | 14 |
| Slot rail affordance | `chevron-forward-outline` | 14 |
| Live session dot | *(not an icon — a 7 × 7 pt solid `liveInk` square)* | — |

The active tab does **not** use a filled icon variant; it changes color to `brass` and gains the 24 × 3 pt mark above it.

---

## 5. Component specs

### 5.1 Tab bar
84 pt tall, pinned to the bottom, `ground` fill, 2 pt `rule` top border. Five equal-width cells (`flex: 1`), the entire cell is the touch target. Cell contents stacked and centered horizontally, `paddingTop: 12`, 5 pt gaps: a **24 × 3 pt mark**, the 24 pt Ionicon, then the `micro` label.
- Active: mark `brass`, icon and label `brass`.
- Inactive: mark transparent (space reserved, so nothing shifts), icon and label `inkFaint`.
- Pressed: label and icon `brass` at 60% opacity.

### 5.2 Header
72 pt, `paddingHorizontal: 20`, `paddingTop: 8`, `paddingBottom: 14`, closed by a 2 pt `rule` bottom border. Two children in a row, `alignItems: flex-start`:
- **Left (`flex: 1`, `minWidth: 0`):** `h1` title in `ink`, 3 pt gap, `micro` subtitle in `inkFaint`, `numberOfLines={1}` with tail ellipsis.
- **Right (`flexShrink: 0`, `paddingTop: 4`, 8 pt gap):** optional header action, then the staff control. Both `minHeight: 36`, `nowrap`.

Titles / subtitles:

| Screen | Title | Subtitle |
| --- | --- | --- |
| Home | Kakul | OPEN 10 AM – 11 PM · {weekday date} |
| Tables | Tables | {n} OF {m} IN PLAY |
| Book | Book a slot | ONE-HOUR SLOTS · 10 AM – 10 PM |
| Members | Members | {n} MEMBERS · 10 PTS PER ₹100 |
| Tourney | Tourney | KNOCKOUT · SINGLE ELIMINATION |

### 5.3 Staff control
**Replaces the v1 floating pill.** It lives in the header on every screen, so it is reachable everywhere and never overlaps content.
- Off: 2 pt `rule` border, transparent fill, `lock-closed-outline` + `micro` label "STAFF" in `inkDim`. Tap → PIN sheet.
- On: 2 pt `brass` border, transparent fill, `shield-checkmark` + `micro` label "STAFF ON" in `brass`. Tap → exits staff mode immediately, no confirm.
- 36 pt tall, `paddingHorizontal: 10`, `nowrap`.

### 5.4 Stat tile
Two-column grid, no outer card. Each cell: `padding: 18` vertical / `20` horizontal, 2 pt `rule` on the right and bottom edges so the grid lines read as structure. `micro` label in `inkFaint`, 6 pt gap, value in **JetBrains Mono 700 / 30**.
- Money values → `brass`. In-play count → `live` when non-zero, `ink` when zero. Everything else → `ink`.
- Customer sees 2 tiles (In play, Bookings today). Staff sees 4 (+ Earnings today, Members).

### 5.5 List row
No card. `paddingVertical: 13`, `paddingHorizontal: 20`, separated by a 2 pt `rule` **top** border. Row is a flex row, 12–14 pt gap.
- Leading fixed-width mono value where the row is time-led (62 pt column, `brass`).
- Middle block `flex: 1`: `body` primary in `ink`, 3 pt gap, `micro` meta in `inkFaint`.
- Trailing: `monoMd` amount in `brass`, or a 44 pt action button.

### 5.6 Table unit — FREE
`padding: 16` vertical / `20` horizontal, 2 pt `rule` bottom border, `ground` fill.
Row 1: `h3` name in `ink` over `micro` "SNOOKER · ₹200/HR" in `inkFaint`; right-aligned **FREE tag** — 2 pt `felt` border, transparent fill, `nano` label in `feltText`, `padding: 5 / 8`.
Row 2 (staff only, 12 pt above): **Start** — `flex: 1`, 44 pt, `brass` fill, `brassInk` label, flush left at 14 pt; **Rate** — 44 pt, 2 pt `rule` border, `inkDim` label, `paddingHorizontal: 16`.

### 5.7 Table unit — IN PLAY
The loudest thing on the screen. Always sorted above free tables.
- `surface2` fill with a **5 pt solid `live` bar across the top edge**.
- `padding: 16` top / `18` bottom / `20` horizontal, 14 pt gaps.
- Row 1: `h2` name in `ink` over `micro` meta in `inkFaint`; right — **IN PLAY badge**: solid `live` fill, `liveInk` `nano` label, preceded by a 7 × 7 pt `liveInk` square, `padding: 6 / 9`.
- Row 2, above a 2 pt `rule` top border with 14 pt padding: left column — `micro` "ELAPSED" in `inkFaint`, `monoXl` timer in `ink`, then the customer name at `body` 14 in `inkDim`. Right column (staff only) — `micro` "RUNNING BILL" in `inkFaint`, `monoXl` amount in `brass`. Timer and bill both tick every second.
- Row 3 (staff only): **Stop & bill** — full width, 48 pt, `brass` fill, `brassInk` `label`, flush left at 16 pt.

Customers see the badge, timer and customer name but **not** the running bill.

### 5.8 Buttons

| Variant | Height | Fill | Border | Label |
| --- | --- | --- | --- | --- |
| Primary | 48 (52 in sheets) | `accentSoft` | none | `brass`, `label` 13 |
| Secondary | 44 | transparent | 2 pt `rule` | `brass`, 12 |
| Danger | 44 | transparent | 2 pt `live` | `live`, 11 |
| Ghost / header action | 36 | transparent | 2 pt `brass` | `brass`, 11 |
| Disabled | as variant | as variant | as variant | `opacity: 0.45`, not pressable |

**All labels are flush left** (`textAlign: 'left'`, `paddingHorizontal: 14–16`), never centered, even when the button is full width. Pressed state: `opacity: 0.82` — no color change, no scale.

### 5.9 Chip
44 pt min height, 2 pt `rule` border, `paddingHorizontal: 12–14`, `bodySm` label.
- Unselected: transparent fill, `inkDim` label.
- Selected: `brass` fill, `brassInk` label, `brass` border.
Used for: table picker, member quick-pick, tournament player tags (player tags are display-only and 7/10 pt padding).

### 5.10 Segmented control
One 2 pt `rule` bordered strip; cells split by 2 pt `rule` right borders; 44 pt tall (40 pt for the in-card bracket switch). Selected cell: `brass` fill, `brassInk` label. Unselected: transparent, `inkDim`. Labels `micro`. Used for: day picker (Today / Tomorrow / {weekday}), Rounds ⇄ Bracket, plan toggle in the Add-member sheet, type toggle in the Add-table sheet.

### 5.11 Slot picker  ← redesigned from the v1 wrapping chip grid
A **horizontal rail**, not a grid. One row, `overflowX: scroll`, `paddingHorizontal: 20`, 8 pt gaps, hidden scroll indicator. 13 cells (10 AM → 10 PM).
- Cell: **84 × 84 pt**, 2 pt border, `padding: 10`, contents `space-between` in a column, both lines flush left.
- Top line: hour in **JetBrains Mono 700 / 18** (`10AM`, `1PM`, no space).
- Bottom line: state in `nano` — FREE / SELECTED / TAKEN.

| State | Fill | Border | Text |
| --- | --- | --- | --- |
| Free | transparent | `rule` | `inkDim` |
| Selected | `brass` | `brass` | `brassInk` |
| Taken | `surface` | `ruleFaint` | `inkMute`, not pressable |

84 pt cells clear the 44 pt target by a wide margin, which is the point — this was the riskiest tap in v1. A `micro` "SWIPE →" hint sits right-aligned above the rail. The rail auto-scrolls to the first free slot on mount.

### 5.12 Input
48 pt tall, `surface` fill, 2 pt `rule` border, `paddingHorizontal: 14`, text at `body` 16 in `ink`, placeholder `inkFaint`. `micro` label in `inkFaint` sits 7 pt above. Focus: border becomes `brass`. Phone and numeric fields use JetBrains Mono 700 / 16. `selectionColor` = `brass`.

### 5.13 Bottom sheet — **one pattern, reused by every form**
Anchored to the bottom edge, `surface` fill, **5 pt `brass` top border**, no radius, full width.
- **Title row:** 72 pt, `padding: 16 / 20`, closed by a 2 pt `rule` bottom border. `label` 15 caps in `ink` flush left; a 36 pt secondary **Close** button (or `chevron-down-outline`) right.
- **Body:** `padding: 18` top / `26` bottom / `20` horizontal, 16 pt gaps.
- **Backdrop:** `scrim`, tap to dismiss.
- Used by: Start session, Edit rate, Add table, Add member, Staff PIN, Bill summary, Booking confirmed.

### 5.14 Status badges
`nano`, `padding: 5 / 8`, no radius.

| Badge | Style |
| --- | --- |
| IN PLAY | `live` fill, `liveInk` label, 7 pt square dot |
| FREE | 2 pt `felt` border, `feltText` label |
| LIVE (tournament) | `live` fill, `liveInk` label |
| SIGN-UPS OPEN | 2 pt `brass` border, `brass` label |
| FINISHED | `rule` fill, `inkDim` label |
| MONTHLY PASS | `brass` fill, `brassInk` label |
| REGULAR | 2 pt `rule` border, `inkDim` label |

### 5.15 Empty state
A 2 pt **dashed** `rule` box inset to the 20 pt gutter, `padding: 22 / 18`, 6 pt gap. `label` 13 caps in `inkDim` naming the absence, then one line of `body` 13 in `inkFaint` naming the action that fills it. Never a bare sentence in a card.

| Where | Line 1 | Line 2 |
| --- | --- | --- |
| Bookings | NO BOOKINGS YET | Slots open from 10 AM. Book one from the Book tab. |
| Tournaments | NO TOURNAMENTS | Staff can add one from this screen. |
| Billing | NOTHING BILLED TODAY | Sessions you stop will show up here. |
| Members | NO MEMBERS YET | Add the first one with + Member. |
| Upcoming | NO UPCOMING BOOKINGS | Pick a day, table and slot above. |

### 5.16 Bill summary  ← replaces the v1 system alert
A bottom sheet titled BILL SUMMARY. Four rows, each `paddingVertical: 13` with a 2 pt `rule` bottom border: `micro` caps label in `inkFaint` left, `monoMd` value in `ink` right — **Table, Customer, Minutes, Rate**. Then the total block: `padding: 20` top / `22` bottom, `label` 12 caps "TOTAL" in `ink` left, **JetBrains Mono 700 / 44** amount in `brass` right, baseline-aligned. Closes with a full-width 52 pt brass **Mark paid**.

### 5.17 Staff PIN sheet
Titled STAFF LOGIN. Four cells in a row, `flex: 1`, 56 pt tall, 10 pt gaps, 2 pt `rule` border; filled cells show a `•` in JetBrains Mono 700 / 24 in `ink`; the next empty cell has a `brass` border. Numeric pad: 3 × 4 grid, 8 pt gaps, each key 56 pt, 2 pt `rule` border, transparent fill, JetBrains Mono 700 / 22 in `ink`. Keys `1–9`, `⌫`, `0`, `OK`. A wrong PIN clears the field (no error color flash). `micro` hint line beneath.

### 5.18 Start-session sheet
Titled START SESSION. Customer input; then a MEMBERS block of quick-pick chips (first names) that fills the input and links the member id; then a summary row above a 2 pt rule — `micro` "{table} · {type}" left, `monoMd` "₹200/HR" in `brass` right; then a 52 pt brass **Start session**. Empty customer defaults to "Walk-in".

### 5.19 Member row
`padding: 16 / 20`, 2 pt `rule` bottom border. A **3 pt `brass` vertical bar** on the leading edge, full row height — the membership-card cue, at the cost of no radius and no fill.
- Line 1: `h4` name in `ink`; right — plan badge.
- Line 2: left — `micro` "JOINED {month year} · {n} VISITS" in `inkFaint`, and for staff the phone in `monoSm` `inkDim` beneath. Right — points in **JetBrains Mono 700 / 26** in `brass` with a `nano` "POINTS" caption under it, right-aligned.
A `surface2` banner above the list carries the loyalty rule: `monoMd` "10 PTS" in `brass` + `micro` "PER ₹100 PLAYED" in `inkDim`.

### 5.20 Tournament card
2 pt `rule` bottom border, no fill. Header block `padding: 16 / 20`: `h3` 20 name in `ink` + status badge right; below, a `micro` meta row with 16 pt gaps — date, "{n} PLAYERS", "₹500 ENTRY".
- **Finished:** a full-bleed `brass` banner under the header — `micro` "CHAMPION" over `display` 24 name, both in `brassInk`.
- **Sign-up:** wrapped player tags, then an add-player input + 44 pt secondary **Add**, then (staff) a 48 pt brass **Start bracket**.
- **Running:** the bracket, behind the Rounds ⇄ Bracket segmented control.

### 5.21 Bracket — two views
**Rounds (default).** Vertical list. Each round: a `micro` caps header in `inkFaint` above a 2 pt `rule`, then match blocks. A match block is a 2 pt `rule` bordered box containing two **46 pt** rows split by a 2 pt rule; each row is the player name at `body` 15 flush left with a `nano` mark right.
- Undecided: both rows transparent, `ink`. Staff tap either row to record the winner; customers see the same rows, not pressable.
- Decided: winner row `brass` fill + `brassInk` name + "WON"; loser row transparent + `inkFaint`.
- Bye: second row reads "Bye" in `inkMute` with the mark "AUTO"; the first row is already the winner.

**Bracket.** Horizontal rail of round columns, 168 pt wide, 14 pt gaps, each column a `micro` header over match boxes distributed with `justify-content: space-around` so later rounds sit centered against earlier ones. Rows are 34 pt, `body` 13, same win/loss colors. Read-only — recording winners happens in Rounds view, which keeps every tap at 46 pt.

---

## 6. Screen composition

Every screen: 44 pt status bar → 72 pt header → scroll view (`top: 116`, `bottom: 84`) → 84 pt tab bar. 20 pt gutter throughout.

| Screen | Order of blocks |
| --- | --- |
| **Home** | Stat grid (2 or 4 tiles) → TODAY'S BOOKINGS list → TOURNAMENTS list → *(staff)* RECENT BILLING list |
| **Tables** | In-play units first, then free units. Staff: `+ Table` header action |
| **Book** | Day segmented → table chip rail → slot rail → name → phone → Confirm booking (label carries "{table} · {hour}") → UPCOMING BOOKINGS (staff: + phone in the meta line and a Cancel button) |
| **Members** | Loyalty banner → member rows. Staff: `+ Member` header action, phone visible in rows |
| **Tourney** | Tournament cards in status order: running, sign-up, finished |

**Staff-only surfaces:** earnings and member stat tiles, recent billing, running bill, all Start/Stop/Rate/+Table/+Member actions, booking phone numbers and Cancel, Start bracket, winner recording.

---

## 7. Mockups

`design/mockups/` — 16 PNGs, re-rendered on the light theme 2026-08-28.

| File | State |
| --- | --- |
| `home-customer.png` | Home, customer |
| `home-staff.png` | Home, staff |
| `tables-customer.png` | Tables, customer |
| `tables-staff.png` | Tables, staff |
| `tables-start-session-sheet.png` | Start-session sheet |
| `tables-bill-summary.png` | Bill summary sheet |
| `tables-edit-rate-sheet.png` | Edit-rate sheet |
| `tables-add-table-sheet.png` | Add-table sheet |
| `book-customer.png` | Book, slot rail |
| `book-confirmed.png` | Booking-confirmed sheet |
| `members-customer.png` | Members, customer |
| `members-staff.png` | Members, staff |
| `members-add-member-sheet.png` | Add-member sheet |
| `tourney-customer.png` | Tourney, sign-up + finished |
| `tourney-staff-bracket.png` | Tourney, running bracket |
| `staff-pin-sheet.png` | Staff PIN sheet |

---

## 8. Checklist for the implementer

- [ ] No `borderRadius` anywhere. Search the diff for it.
- [ ] No emoji in any string. Every glyph is an Ionicon named in §4.
- [ ] No `shadowColor` / `elevation`. Depth comes from rules and fills only.
- [ ] Every divider is exactly 2 pt in `rule`; the in-play bar and sheet top are 5 pt.
- [ ] Every button label is `textAlign: 'left'`.
- [ ] Every touch target ≥ 44 pt; slot cells are 84 pt; bracket rows 46 pt.
- [ ] Blue is the only accent; red only for IN PLAY and Cancel. Primary buttons use `accentSoft` + `brass` label.
- [ ] Timers and money render in JetBrains Mono, never Archivo.
- [ ] The staff control sits in the header on all five screens and shows the STAFF ON state.
- [ ] All five empty states use the dashed box, with the copy in §5.15.
