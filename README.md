# BACDA Website (org-website)

Next.js 14 rebuild of [bayareacreativedancers.org](https://bayareacreativedancers.org) for Bay Area Creative Dancers — a Bay Area 501(c) non-profit Indian classical & contemporary dance company led by artistic director Dalia Sen. Replaces the legacy Bootstrap 2 / jQuery static site with a performant, accessible, admin-editable platform. Staging deploy: `new.bayareacreativedancers.org`.

## Tech stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui + Framer Motion
- **Data / Auth:** Supabase (Postgres + RLS + Storage + Auth)
- **Email:** Resend (contact form)
- **Testing:** Vitest + @testing-library (unit), Playwright (E2E), axe-core (a11y)
- **Deploy:** Netlify via GitHub Actions on push to `main`

## Prerequisites

- Node.js 20+ and npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- Docker (required by the Supabase local stack)
- git + a clone of this repo

## Local setup

```bash
# 1. Install deps
npm install

# 2. Env file — copy and fill in secrets (see .env.example for guidance)
cp .env.example .env.local

# 3. Start the local Supabase stack — prints the anon key + URL you need
supabase start

# 4. Paste the printed NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY and
#    SUPABASE_SERVICE_ROLE_KEY into .env.local

# 5. Run the dev server
npm run dev
# → http://localhost:3000
```

Optional: `npm run seed:storage` uploads the legacy image library into Supabase Storage.

## Project structure

```
app/          Next.js App Router — (public) site, (admin) dashboard, /api routes
components/   Reusable React components (ui/, brand/, sections/, forms/)
lib/          Supabase clients, fetchers, integrations, utilities
supabase/     SQL migrations + seed.sql + RLS policies
public/       Static assets (brand/, favicon, og-image)
scripts/      One-off dev scripts (seed-storage, etc.)
e2e/          Playwright end-to-end specs
__tests__/    Vitest unit + component tests
```

## Key scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js dev server with HMR |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint (`next lint`) |
| `npm run lint:fix` | ESLint with autofix |
| `npm run typecheck` | TypeScript strict check (`tsc --noEmit`) |
| `npm run test` | Vitest unit + component tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright E2E suite |
| `npm run seed:storage` | Upload legacy images into Supabase Storage |

## Deployment

Deployed to Netlify on push to `main`. See `netlify.toml` and `.github/workflows/ci.yml` for pipeline configuration. Pull requests produce a Netlify Deploy Preview; the `lighthouse` CI job runs against the preview URL using `lighthouse-budget.json`.

Root-domain cutover (`bayareacreativedancers.org`) is explicitly **out of scope** for this build — staging only.

## Context & docs

- `PLAN.md` — end-to-end execution plan, wave/ticket breakdown, user directives
- `CLAUDE.md` — Agent Constitution (conventions every contributor + agent follows)
- `BACDA_Website_Revamp_PRD.pdf` — authoritative product spec (61 pages)
- `.agent-handoffs/` — per-ticket handoff notes from specialist agents (gitignored)
