# FrontRow

A mobile-first PWA for live-music fans to log, track, and relive every concert and festival they attend.

> Full product/design spec lives in [`design_handoff/README.md`](design_handoff/README.md).

## Stack
React 18 · TypeScript · Vite · Tailwind CSS v4 · Zustand + TanStack Query · React Hook Form + Zod · Supabase (Auth/Postgres/Storage/Edge) · react-simple-maps · Vite PWA (Workbox).

## Environments
| Branch | Supabase project | Use |
|---|---|---|
| `develop` | `frontrow` (`aznauvbcnisndwitunjb`) | active development |
| `main` | `frontrow-prod` (created at launch) | production |

Database migrations are the source of truth in [`supabase/migrations/`](supabase/migrations); applied to dev first, then replayed to prod from the same files.

## Local setup
```bash
cp .env.example .env.local   # values already filled for dev
npm install
npm run dev
```

## Status
- [x] Database schema + RLS (migrations 0001–0003)
- [ ] Sprint 0 — app foundation
- [ ] Sprint 1 — auth + profile + username selection
