# FrontRow — Claude Code Starting Prompt

Copy and paste this prompt into Claude Code to begin development planning.

---

## PROMPT TO PASTE INTO CLAUDE CODE

```
I want to build FrontRow — a PWA for concert fans to log, track, and relive every show they attend. I have a complete design handoff package. Please help me plan and build this.

## Design Reference
The full design is in `design_handoff/README.md` in this repo. It contains:
- All design tokens (colors, typography, spacing, shadows, border-radius)
- Complete component library specs (buttons, inputs, cards, toasts, modals, skeletons, badges)
- 37-screen inventory with descriptions
- Full TypeScript data model (Concert, Artist, Venue, User, Festival, Setlist, Tour, Achievement)
- Authentication requirements
- API integrations (setlist.fm, Spotify)
- PWA requirements (manifest, service worker, push notifications)
- State management architecture (Zustand + TanStack Query)
- Accessibility requirements (WCAG AA contrast, ARIA, focus management)
- Recommended tech stack (React 18, TypeScript, Vite, Tailwind CSS v4, Supabase, React Router v6)

Open `design_handoff/FrontRow.dc.html` in a browser to see all 37 screens visually.

## What I want from you first

1. **Confirm the tech stack** — Review the recommended stack in README.md and tell me if you'd change anything, and why.

2. **Project structure** — Propose the full folder/file structure for this project before writing any code.

3. **Database schema** — Write the full Supabase (Postgres) schema with all tables, columns, types, indexes, and RLS policies. Base it exactly on the data model in README.md section 7.

4. **Development phases** — Break the 37 screens into development sprints (MVP first, then growth features). Map each screen to a sprint with estimated complexity.

5. **Start with auth** — Once we've agreed on structure, begin with Supabase Auth setup (email/password + Google OAuth), the user profile creation flow, and the username-selection screen.

## Key design decisions to carry through
- Dark mode only — background #0d0c16, accent #e8752a (orange)
- Fonts: Syne (headings, 600/700/800) + DM Sans (body, 300/400/500/600)
- Mobile-first, 390px design width
- No Apple Sign In — Google + email/password only
- No concert ratings (by design — we don't rate shows)
- Username-based (not full name) — displayed as @username
- Concerts and festivals are separate types with different data structures
- Support acts/openers are full artist objects, same as headliners
- Press/accreditation is an optional mode per concert, not a user-level toggle

## Questions I need you to answer before writing any code
1. What's the best way to handle the festival day → stage → performance hierarchy in Postgres?
2. Should setlist.fm API calls be server-side (Edge Functions) or client-side to protect the API key?
3. How do we handle the "concert buddy auto-log" feature — when I tag a friend, it appears in their shows too. What's the safest UX and data model for this?
4. For the World Map, what's the best approach — store lat/lng on venues, or geocode on the fly?
5. What's the PWA offline strategy for a user who hasn't synced recently?

Please start by reading README.md in full, then answer these questions, propose the project structure, and write the database schema.
```

---

## Additional context for Claude Code

### Files to reference
- `design_handoff/README.md` — Full spec (start here)
- `design_handoff/FrontRow.dc.html` — Visual prototype (open in browser)
- `design_handoff/Style Guide.dc.html` — Brand system
- `design_handoff/FrontRow-Logo.dc.html` — Logo variants

### Priority order for development
1. **Auth** — sign up, login, Google OAuth, profile creation
2. **Concert logging** — the core form (Log a Show)
3. **Concert detail** — view a logged show
4. **My Shows** — list view with year grouping
5. **Home / Dashboard** — stats strip, recent shows
6. **Festival support** — festival day/stage/performance model
7. **Social** — friends, buddy tagging, mutual shows
8. **Setlist** — manual entry + setlist.fm sync
9. **Stats** — dashboard charts, Year Wrapped
10. **World Map** — SVG globe with concert dots
11. **Achievements** — badge system
12. **Tour Tracker** — completion % per tour
13. **Notifications + alerts** — push notification setup
14. **Press/accreditation** — optional mode in concert form
15. **PWA** — manifest, service worker, install prompt

### Non-negotiables
- All user data must be protected by Supabase RLS
- Username must be unique and validated on creation
- No rating field on concerts — this is a deliberate product decision
- Photos stored in Supabase Storage, not inline base64
- The app must work offline for reading cached data (PWA requirement)
