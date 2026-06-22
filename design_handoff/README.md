# FrontRow — Developer Handoff
**Version:** 1.0 · **Date:** June 2026  
**Type:** Progressive Web App (PWA)  
**Stack target:** React + TypeScript + Supabase (recommended — see notes below)

---

## Table of Contents
1. [Product Overview](#1-product-overview)
2. [Design Files](#2-design-files)
3. [Design Tokens](#3-design-tokens)
4. [Typography](#4-typography)
5. [Component Library](#5-component-library)
6. [Screen Inventory](#6-screen-inventory)
7. [Data Model](#7-data-model)
8. [Authentication](#8-authentication)
9. [Key Interactions & Animations](#9-key-interactions--animations)
10. [API Integrations](#10-api-integrations)
11. [PWA Requirements](#11-pwa-requirements)
12. [State Management](#12-state-management)
13. [Accessibility](#13-accessibility)
14. [Recommended Tech Stack](#14-recommended-tech-stack)

---

## 1. Product Overview

FrontRow is a mobile-first PWA for live music fans to log, track, and relive every concert and festival they attend. It combines personal journaling, social sharing, statistics/analytics, and gamification.

### Core Value Propositions
- **Log every show** — Rich concert profiles (artist, venue, date, setlist, photos, ticket, notes, buddies)
- **Track your history** — Year Wrapped, World Map, Artist pages, Tour Tracker
- **Social layer** — Concert buddies, mutual shows, friend tagging, public profiles
- **Achievements** — 42 badges, gamified milestones
- **Press/accreditation mode** — For photographers, videographers, journalists

### User Types
| Type | Description |
|---|---|
| **Fan** | Standard user logging personal concerts |
| **Power fan** | 10+ shows/year, heavy stats user, Premium candidate |
| **Press/Media** | Accreditation mode, photo pit, publication linking |
| **Photographer/Videographer** | Same as Press but media-focused |

---

## 2. Design Files

All design files are in this handoff folder and the project root.

| File | Description |
|---|---|
| `FrontRow.dc.html` | 37-screen hi-fi prototype — open in browser |
| `FrontRow-Logo.dc.html` | Logo system — 3 variants, all lockups, size scale |
| `Style Guide.dc.html` | Complete brand system — colors, type, tokens |
| `FrontRow Pitch.dc.html` | 13-slide investor/pitch deck |

**To view:** open any `.dc.html` file directly in a modern browser (Chrome/Safari/Firefox). No build step needed.

---

## 3. Design Tokens

### Colors

```css
/* Backgrounds */
--color-bg-app:       #0d0c16;   /* Primary app background */
--color-bg-page:      #0f0e17;   /* Canvas / page background */
--color-bg-card:      #111118;   /* Card / elevated surface */
--color-bg-raised:    rgba(255, 255, 255, 0.03);
--color-bg-overlay:   rgba(8, 8, 13, 0.70);

/* Accent */
--color-orange:       #e8752a;
--color-orange-dim:   rgba(232, 117, 42, 0.12);
--color-orange-mid:   rgba(232, 117, 42, 0.25);
--color-orange-glow:  rgba(232, 117, 42, 0.40);

/* Text */
--color-text-primary:   #f0eeeb;
--color-text-secondary: #c0bece;
--color-text-tertiary:  #8a88a0;
--color-text-muted:     #6a6882;
--color-text-disabled:  #45445a;
--color-text-faint:     #3a3a50;

/* Borders */
--color-border:         rgba(255, 255, 255, 0.07);
--color-border-strong:  rgba(255, 255, 255, 0.12);
--color-border-accent:  rgba(232, 117, 42, 0.25);

/* Semantic */
--color-success:        #1ed760;
--color-success-dim:    rgba(30, 215, 96, 0.12);
--color-error:          #ef4444;
--color-error-dim:      rgba(239, 68, 68, 0.10);
--color-warning:        #f59e0b;
--color-warning-dim:    rgba(245, 158, 11, 0.10);
```

### Spacing Scale

```css
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
```

### Border Radius

```css
--radius-sm:   8px    /* Chips, small tags */
--radius-md:   12px   /* Inputs, small cards */
--radius-lg:   14px   /* Most cards */
--radius-xl:   16px   /* Large cards */
--radius-2xl:  20px   /* Section cards */
--radius-3xl:  24px   /* Modals */
--radius-full: 9999px /* Pills */
--radius-icon: 11-14px (per size — see icons section)
```

### Shadows

```css
--shadow-card:    0 1px 3px rgba(0,0,0,0.3);
--shadow-elevated: 0 8px 32px rgba(0,0,0,0.5);
--shadow-modal:   0 20px 60px rgba(0,0,0,0.6);
--shadow-orange:  0 4px 20px rgba(232,117,42,0.40);
--shadow-phone:   0 0 0 8px #1c1b2a, 0 0 0 9.5px rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.8);
```

---

## 4. Typography

### Font Families

```css
/* Headlines, titles, bold numbers */
--font-display: 'Syne', sans-serif;
/* Weights used: 600, 700, 800 */

/* Body, labels, UI text */
--font-body: 'DM Sans', sans-serif;
/* Weights used: 300, 400, 500, 600 */
```

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

### Type Scale

| Role | Font | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Display / H1 | Syne | 32px | 800 | -0.6px |
| Title / H2 | Syne | 22px | 800 | -0.5px |
| Subtitle / H3 | Syne | 16–18px | 700–800 | -0.3px |
| Stat number | Syne | 20–52px | 800 | -0.5px to -1.5px |
| Body | DM Sans | 14px | 400 | 0 |
| UI label | DM Sans | 13px | 500 | 0 |
| Small label | DM Sans | 12px | 500–600 | 0 |
| Cap label | DM Sans | 11px | 600 | 0.08em |
| Tiny meta | DM Sans | 10px | 400–600 | 0.04–0.06em |

---

## 5. Component Library

### Buttons

```
Primary CTA:
  background: #e8752a
  height: 54px (full-width) / 44px (standard)
  border-radius: 16px
  font: Syne 700 16px
  box-shadow: 0 4px 20px rgba(232,117,42,0.35)

Secondary:
  background: rgba(255,255,255,0.06)
  border: 1px solid rgba(255,255,255,0.10)
  color: #c0bece
  font: DM Sans 500 15px

Destructive:
  background: #ef4444
  color: white

Disabled:
  background: rgba(232,117,42,0.25)
  color: rgba(255,255,255,0.40)
  cursor: not-allowed
```

### Form Inputs

```
Default state:
  height: 50px
  background: rgba(255,255,255,0.04)
  border: 1.5px solid rgba(255,255,255,0.12)
  border-radius: 14px
  padding: 0 16px
  font: DM Sans 400 14px color #f0eeeb

Focus state:
  border-color: #e8752a

Valid state:
  border-color: rgba(30,215,96,0.40)

Error state:
  border-color: #ef4444
  background: rgba(239,68,68,0.05)

Warning state:
  border-color: rgba(245,158,11,0.40)

Label:
  font: DM Sans 600 12px #c0bece
  text-transform: uppercase
  letter-spacing: 0.08em
  margin-bottom: 8px

Error message:
  font: DM Sans 400 12px #f87171
  display: flex + icon, gap: 6px
  margin-top: 7px
```

### Cards (Concert Card)

```
Background: rgba(255,255,255,0.03) or rgba(255,255,255,0.04)
Border: 1px solid rgba(255,255,255,0.07)
Border-radius: 16px (list) / 20px (featured)
Padding: 14–18px

Tap state: border-color → rgba(232,117,42,0.25), slight scale(0.99)
```

### Bottom Navigation (5-tab)

```
Height: 80px
Background: #0d0c16
Border-top: 1px solid rgba(255,255,255,0.06)
Padding-bottom: 10px (safe area)

Tabs: Home · My Shows · + (FAB) · Stats · Profile

Active tab: color #e8752a, icon filled/stroked orange
Inactive tab: color #3a3a50

FAB (+):
  width/height: 50px
  background: #e8752a
  border-radius: 15px
  box-shadow: 0 4px 20px rgba(232,117,42,0.4)
  margin-top: -18px (lifts above nav bar)
```

### Chips / Filter Pills

```
Active: background #e8752a, color #fff, font-weight 600
Inactive: background rgba(255,255,255,0.05), border 1px solid rgba(255,255,255,0.08), color #45445a
Height: 28–32px, border-radius: 8–10px, padding: 0 12px
```

### Toast Notifications

```
Position: top of screen, 16px inset
Width: calc(100% - 32px)
Background: #16151f
Border-radius: 14px
Padding: 14px 16px
Box-shadow: 0 10px 30px rgba(0,0,0,0.5)

Variants:
  success  → border: 1px solid rgba(30,215,96,0.30)  · icon bg: rgba(30,215,96,0.12)
  error    → border: 1px solid rgba(239,68,68,0.30)  · icon bg: rgba(239,68,68,0.12)
  info     → border: 1px solid rgba(232,117,42,0.30) · icon bg: rgba(232,117,42,0.12)
  neutral  → border: 1px solid rgba(255,255,255,0.12)
  loading  → spinner instead of icon

Duration: 3s auto-dismiss (except loading)
Swipe-up to dismiss
```

### Confirmation Modal

```
Scrim: rgba(8,8,13,0.70) + blur(2px) on content beneath
Modal: background #16151f, border 1px solid rgba(255,255,255,0.10)
Border-radius: 24px, padding: 28px 24px
Max-width: calc(100% - 48px), centered vertically

Icon container: 56px, border-radius 16px
Title: Syne 800 20px
Body: DM Sans 400 14px color #8a88a0 text-align center
Buttons: stacked, primary first
```

### Skeleton Loading

```
Base: rgba(255,255,255,0.06) for shapes
Shimmer: gradient animation translateX(-100% → 100%)
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)
  animation: shimmer 1.5s infinite, staggered 0.1s per item

Spinner:
  SVG arc on circle, color #e8752a
  animation: spin 0.8s linear infinite
```

### Badges / Achievement Tiles

```
Unlocked: background rgba(255,255,255,0.04), border 1px solid rgba(232,117,42,0.20)
Locked: opacity 0.5, border rgba(255,255,255,0.06)
In-progress: border rgba(255,255,255,0.06) + 3px progress bar at bottom

Icon container: 44px, border-radius 14px
  Unlocked bg: rgba(232,117,42,0.10)
  Locked bg: rgba(255,255,255,0.04)
  Icon color: #e8752a (unlocked) / #6a6882 (locked)

Grid: 3 columns, gap 10px
```

---

## 6. Screen Inventory

All 37 screens are fully designed in `FrontRow.dc.html`. Navigate with keyboard (← →) or thumbnail rail at the bottom.

### Row 1 — Core Flow
| # | Screen | Notes |
|---|---|---|
| 01 | Onboarding Splash | Dark hero, dot grid, tagline, CTA |
| 02 | Sign Up | Username + email/password + Google auth |
| 03 | Dashboard / Home | Stats strip, upcoming, recent shows, On This Day widget |
| 04 | Log a Show | Full form — artist, venue, date, ticket, buddies, type, notes |
| 05 | Concert Detail | Hero, stats bar, tabs (Info / Setlist / Photos / Notes) |

### Row 2 — Browse & Manage
| # | Screen | Notes |
|---|---|---|
| 06 | My Shows | Year-grouped list, type filter chips |
| 07 | Festival Detail | Festival → Day → Stage → Band hierarchy |
| 08 | Setlist View | Song list, setlist.fm sync, edit mode |
| 09 | Year Wrapped | Spotify-style annual stats card |
| 10 | My Profile | Avatar, bio, stats, shows grid |

### Row 3 — Social & Extended
| # | Screen | Notes |
|---|---|---|
| 11 | Stats Dashboard | Charts — shows/year bar, genre, top artists |
| 12 | Search & Discover | Artist/venue/concert search, trending |
| 13 | Add Friends | @username search, friend requests, mutual shows |
| 14 | Wishlist | Want-to-see artists, tour alerts |
| 15 | Notifications | Tour alerts, friend tags, concert buddy activity |
| 16 | Press / Media Form | Accreditation accordion open in Log a Show |
| 17 | Photos Tab | Upload grid, ticket scan attachment |

### Row 4 — Discovery & Delight
| # | Screen | Notes |
|---|---|---|
| 18 | World Map | SVG globe, dots per country, year filter, stats strip |
| 19 | Artist Page | All times seen, tour-grouped timeline, setlists tab |
| 20 | On This Day | Home widget + full screen, memory stack |
| 21 | Achievements | 18/42 progress, unlocked highlight, badge grid |
| 22 | Tour Tracker | Tour completion %, dots per show, missed/seen |

### Row 5 — Essential UI
| # | Screen | Notes |
|---|---|---|
| 23 | Public Profile | Other user's profile, mutual shows, follow |
| 24 | Edit Concert | Pre-filled form, same fields as Log |
| 25 | Empty States | First-run — no shows logged yet |
| 26 | Settings | Account, notifications, privacy, data export |
| 27 | Shareable Card | Instagram-ready concert memory card |
| 28 | Venue Page | All shows at this venue, map pin, upcoming |

### Row 6 — Feature Detail
| # | Screen | Notes |
|---|---|---|
| 29 | Stats Extended | Venue breakdown, genre chart, spending over time |
| 30 | Festival Schedule | Stage timetable grid by day |
| 31 | Artist Role Picker | Headliner / Support / Special Guest selector |
| 32 | PWA Install Prompt | Add to Home Screen flow |
| 33 | Offline Mode | Cached data state, graceful degradation |

### Row 7 — System States
| # | Screen | Notes |
|---|---|---|
| 34 | Form Validation | Error/valid/warning states, disabled submit |
| 35 | Skeleton Loading | Shimmer cards, spinner |
| 36 | Confirmation Modal | Destructive delete dialog |
| 37 | Toast Feedback | Success / error / info / undo / loading |

---

## 7. Data Model

### Concert Object
```typescript
interface Concert {
  id: string;                    // UUID
  user_id: string;               // FK → User
  type: 'concert' | 'festival';

  // Core fields
  artist_ids: string[];          // FK[] → Artist (support acts included)
  headliner_id: string;          // FK → Artist (primary)
  venue_id: string;              // FK → Venue
  date: string;                  // ISO 8601
  tour_name?: string;
  tour_id?: string;              // FK → Tour (auto-matched if 3+ same tour)

  // Festival fields (type === 'festival')
  festival_name?: string;
  festival_days?: FestivalDay[];

  // Ticket
  ticket_type?: 'GA' | 'Seated' | 'VIP' | 'Free' | 'Press';
  ticket_price?: number;
  ticket_price_paid?: number;
  ticket_currency?: string;      // ISO 4217
  ticket_scan_url?: string;      // Storage URL

  // Media
  photos?: string[];             // Storage URLs
  setlist?: SetlistSong[];
  setlist_fm_id?: string;        // external ID for sync

  // Social
  buddy_ids?: string[];          // FK[] → User (tagged friends)
  buddy_confirmed?: string[];    // Users who confirmed attendance

  // Notes
  personal_note?: string;        // Diary entry
  rating?: null;                 // Intentionally absent (by design)

  // Accreditation
  accreditation?: Accreditation;

  // Metadata
  status: 'attended' | 'planned' | 'wishlist';
  created_at: string;
  updated_at: string;
}
```

### Festival Day
```typescript
interface FestivalDay {
  date: string;                  // ISO 8601
  stages: FestivalStage[];
}

interface FestivalStage {
  stage_name: string;            // e.g. "Pyramid Stage", "Other Stage"
  performances: Performance[];
}

interface Performance {
  artist_id: string;
  role: 'headliner' | 'support' | 'special_guest' | 'opener';
  start_time?: string;           // HH:MM
  end_time?: string;
  attended: boolean;
  setlist?: SetlistSong[];
}
```

### Artist
```typescript
interface Artist {
  id: string;
  name: string;
  genres: string[];
  origin_city?: string;
  origin_country?: string;
  spotify_id?: string;           // For artwork fetch
  image_url?: string;
  formed_year?: number;
  bio?: string;
}
```

### Venue
```typescript
interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;               // ISO 3166-1 alpha-2
  country_name: string;
  lat?: number;
  lng?: number;
  capacity?: number;
  type?: 'arena' | 'club' | 'festival_site' | 'theatre' | 'outdoor' | 'other';
}
```

### User Profile
```typescript
interface UserProfile {
  id: string;                    // matches Supabase auth UID
  username: string;              // unique, @handle
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  is_press?: boolean;
  press_type?: 'photo' | 'video' | 'press' | 'all_access';
  is_public: boolean;
  joined_at: string;
}
```

### Accreditation
```typescript
interface Accreditation {
  type: 'photo' | 'video' | 'press' | 'all_access';
  client?: string;               // Publication / client name
  publication_url?: string;      // Link to published piece
  photo_pit_access: boolean;
  first_3_songs_rule: boolean;
}
```

### SetlistSong
```typescript
interface SetlistSong {
  position: number;
  title: string;
  is_encore: boolean;
  note?: string;                 // e.g. "acoustic version", "debut"
}
```

### Tour
```typescript
interface Tour {
  id: string;
  artist_id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  total_shows?: number;          // From setlist.fm or manual
}
```

### Achievement
```typescript
interface Achievement {
  id: string;
  slug: string;                  // e.g. 'century_club', 'globe_trotter'
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  criteria: AchievementCriteria;
}

interface UserAchievement {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress?: number;             // 0–1 for in-progress
}
```

---

## 8. Authentication

### Methods
- **Email + Password** (Supabase Auth)
- **Google OAuth** (Supabase Auth provider)
- NO Apple Sign In (by design)
- NO full name on signup — username only

### Auth Flow
1. Onboarding splash → Sign Up / Sign In
2. Google auth → one-tap, redirects back to dashboard
3. Email/password → standard form with validation
4. Post-auth → onboarding wizard (first-time users only)
5. Session persistence → refresh tokens, auto-renew

### Username Rules
- 3–20 characters
- Letters, numbers, underscores only
- Must be unique
- Displayed as @username throughout

---

## 9. Key Interactions & Animations

### Global
- **Page transitions:** slide-in from right (push), slide-out to left (pop) — 300ms ease-out
- **Bottom sheet:** slide-up from bottom — 280ms cubic-bezier(0.32, 0.72, 0, 1)
- **Modal:** fade-in scrim + scale-up modal from 0.96 → 1.0 — 220ms
- **Tap feedback:** scale(0.97) on touchstart, back on touchend — 150ms

### Specific
- **FAB (+):** pulse glow on first session, scale(1.05) on hover
- **Concert cards:** translate-x swipe-right to reveal quick-delete
- **Skeleton shimmer:** 1.5s infinite, staggered 0.1s per item
- **Toast:** slide-down from top, auto-dismiss 3s, swipe-up to dismiss
- **Achievement unlock:** scale + glow burst + haptic (vibration API)
- **Year Wrapped:** sequential reveal — stat by stat, 400ms apart
- **Map dots:** scale-in with stagger on load
- **Spinner:** 0.8s linear infinite rotation

### Gesture support
- Swipe-back on iOS (browser native)
- Swipe-down to dismiss bottom sheets
- Swipe-left on concert list items → delete action
- Pull-to-refresh on My Shows and Home

---

## 10. API Integrations

### Setlist.fm
- **Purpose:** Import setlists for past concerts
- **Endpoint:** `https://api.setlist.fm/rest/1.0/`
- **Key calls:** `GET /artist/{mbid}/setlists`, `GET /setlist/{setlistId}`
- **Auth:** API key header `x-api-key`
- **Notes:** Rate limited; cache results in DB. User can override/edit imported setlists.

### Spotify (optional, Phase 2)
- **Purpose:** Artist artwork, genre data, concert alerts for wishlist artists
- **Auth:** OAuth PKCE flow
- **Key calls:** `GET /artists/{id}`, search endpoint
- **Notes:** Primarily for enriching artist profiles with images.

### Geocoding (for World Map)
- **Purpose:** Lat/lng from venue city/country for map plotting
- **Recommended:** OpenStreetMap Nominatim (free) or Google Maps Geocoding API

---

## 11. PWA Requirements

### Manifest (`manifest.json`)
```json
{
  "name": "FrontRow",
  "short_name": "FrontRow",
  "description": "Every show. Every moment.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0d0c16",
  "theme_color": "#0d0c16",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Icon specs
- Source: the wristband SVG mark in `FrontRow-Logo.dc.html` (Option B — dark bg + orange band)
- Export at 192×192 and 512×512 PNG
- Maskable: use 80px safe area (icon fills the safe zone, bg extends to edges)

### Service Worker
- Cache strategy: **Cache-first** for static assets, **Network-first** for API calls
- Offline fallback: serve cached last-seen shows list (My Shows screen) with offline indicator banner
- Push notifications: Workbox + Web Push API

### Push Notifications (requires VAPID keys)
- Wishlist artist announces tour
- Friend tagged you in a concert
- Concert buddy going to same show
- "On This Day" morning notification (8am local)

### Install Prompt (screen 32)
- Intercept `beforeinstallprompt`, defer it
- Show custom prompt UI when user has logged 3+ shows
- Re-trigger from Settings → "Add to Home Screen"

---

## 12. State Management

### Recommended approach: Zustand + React Query

```typescript
// Global stores (Zustand)
useAuthStore        // user, session, profile
useUIStore          // toasts, modals, loading states

// Server state (React Query / TanStack Query)
useConcerts()       // user's concert list
useConcert(id)      // single concert detail
useArtist(id)       // artist page data
useVenue(id)        // venue page data
useFriends()        // friend list + requests
useStats(year?)     // statistics dashboard
useAchievements()   // badge progress
```

### What lives where
| Data | Store | Notes |
|---|---|---|
| Auth session | Zustand (persist) | Supabase handles refresh |
| Concert list | React Query | Paginated, invalidate on mutate |
| Active concert | React Query | Single item |
| Toast queue | Zustand (ephemeral) | Array of toast objects |
| Modal state | Zustand (ephemeral) | `{ type, props }` |
| Form state | React Hook Form | Local to form component |
| Map viewport | Local state | Component-level |
| Setlist edit | Local state | Component-level, save on confirm |

---

## 13. Accessibility

### Color Contrast (WCAG AA)
- `#f0eeeb` on `#0d0c16` → **14.2:1** ✅
- `#c0bece` on `#0d0c16` → **8.6:1** ✅
- `#8a88a0` on `#0d0c16` → **4.7:1** ✅ (body text minimum)
- `#45445a` on `#0d0c16` → **2.5:1** ⚠️ decorative/disabled only
- `#e8752a` on `#0d0c16` → **4.8:1** ✅ (large text / icons)
- `#fff` on `#e8752a` → **3.1:1** ⚠️ use for large text/buttons only

### Focus Management
- All interactive elements must have visible focus ring: `outline: 2px solid #e8752a; outline-offset: 2px`
- Bottom sheet / modal opening → trap focus within, return on close
- Toast → not focusable (non-blocking), dismiss button accessible

### ARIA patterns
- Bottom nav: `role="navigation"` + `aria-label="Main navigation"`
- Active tab: `aria-current="page"`
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Toast: `role="status"` (success/info) or `role="alert"` (error)
- Form errors: `aria-describedby` linking input to error message
- Skeleton loaders: `aria-busy="true"` on container

### Touch targets
- Minimum tap target: **44×44px** (iOS HIG)
- All nav items, buttons, cards meet this requirement
- FAB: 50×50px ✅

---

## 14. Recommended Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| **Framework** | React 18 + TypeScript | Ecosystem, team familiarity |
| **Build** | Vite | Fast dev, PWA plugin support |
| **Routing** | React Router v6 | File-based routing, nested layouts |
| **Styling** | Tailwind CSS v4 | Utility-first, design tokens via CSS vars |
| **State** | Zustand + TanStack Query | Minimal boilerplate, great DX |
| **Forms** | React Hook Form + Zod | Validation, minimal re-renders |
| **Backend** | Supabase | Auth, Postgres, Storage, Realtime, Edge Functions |
| **Storage** | Supabase Storage | Photos, ticket scans |
| **Push** | Web Push API + Supabase Edge | VAPID notifications |
| **Maps** | Leaflet + OpenStreetMap | Free, customisable |
| **PWA** | Vite PWA plugin (Workbox) | Service worker, manifest |
| **Testing** | Vitest + Playwright | Unit + E2E |
| **Deployment** | Vercel | Edge, fast deploys |

### Database (Supabase / Postgres)
Key tables: `profiles`, `concerts`, `artists`, `venues`, `tours`, `setlists`, `festival_days`, `festival_stages`, `performances`, `friendships`, `friend_requests`, `achievements`, `user_achievements`, `notifications`

RLS (Row Level Security) on all tables — users can only read/write their own data, with explicit sharing for public profiles and mutual concert checks.

---

## Appendix: Logo Usage

### Primary (Option B) — Use by default
Dark bg (`#111118`) + orange wristband (`#e8752a`)  
Text stub "FR" in white, perforation line, check icon

### Alternative (Option C) — Use on darker surfaces
Muted orange bg (`#e8752a` @ 92% opacity) + dark wristband (`#2a2420`)  
Use when Option B blends into a very dark page background

### Never
- Don't recolor the wristband band to anything other than `#e8752a` / `#2a2420`
- Don't remove the perforation line
- Don't stretch or distort the mark
- Minimum usage size: 24px
