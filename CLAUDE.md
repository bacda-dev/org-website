# BACDA Website — Agent Constitution

## Project
Revamp of bayareacreativedancers.org as a Next.js 14 + Supabase + Netlify site. Spec is `BACDA_Website_Revamp_PRD.pdf` (61 pages); approved execution plan is `PLAN.md`. Both are in the repo root and are the source of truth.

## User Directive Overrides (supersede PRD)
1. No newsletter — drops `newsletter_subscribers` table, `/admin/newsletter`, footer signup, migration 0009 newsletter.
2. No Google Cloud Console — YouTube content is **manual admin curation** (no YouTube Data API). Contact-page map uses the no-API-key Google Maps iframe. No `YOUTUBE_API_KEY`, no `GOOGLE_MAPS_API_KEY` env vars.
3. Socials = Facebook, Instagram (`@bayareacreativedanceacademy`), YouTube only. No Twitter/X, TikTok, or LinkedIn.
4. Resend for contact-form transactional email.
5. No Mailchimp.
6. Launch scope = staging-only at `new.bayareacreativedancers.org`. Root-domain cutover deferred.
7. Donate CTA = admin-configured URL via `home_content.donate_url`. Button hidden if empty.
8. Sponsors = admin-managed via new `sponsors` table + `/admin/sponsors`. Ships empty.
9. Analytics = skipped in v1. No tracking scripts.
10. Media = reuse legacy images from `legacy-website/public_html/img/` (seeded to Supabase Storage); YouTube IDs reused from legacy HTML.
11. Logo = `legacy-website/public_html/img/bacda-2020-logo.png` → `public/brand/bacda-logo-original.png`, vectorized to SVG.

## Non-Negotiables (from PRD §9.4)
1. TypeScript strict mode ON. No `any` except where unavoidable (must be commented with justification).
2. Every database mutation goes through a server action with Zod validation.
3. Every public page must pass Lighthouse ≥ 90 (mobile) and axe with zero violations.
4. No client-side secrets. Service role key is server-only.
5. Every component ≤ 300 lines. Split if larger.
6. Tailwind classes only — no inline `style={}` except for dynamic CSS custom properties.
7. Every image has alt text. Every form has labels. Every interactive element is keyboard-accessible.
8. Content is DB-driven. Never hardcode events, testimonials, team members, or home copy in source.
9. Typography = Fraunces (display) + Instrument Sans (body) + JetBrains Mono (code). NEVER use Inter, Roboto, Poppins, Montserrat, or Arial.
10. Light mode only in v1 (dark mode out of scope).

## Coding Style
- File naming: kebab-case for components (`event-card.tsx`), camelCase for utilities (`parseYouTubeId.ts`).
- Component pattern: React Server Component by default; `'use client'` only when needed (event handlers, useState, useEffect, Zustand, Realtime).
- Error handling: wrap server actions in try/catch with structured `{ok: true, data}` / `{ok: false, error}` returns.
- Imports order: React → third-party → `@/lib` → `@/components` → relative.
- Form state: React Hook Form + Zod resolvers (no bare `useState` for form fields).
- Data fetching: server components call `lib/fetchers/*.ts`; client components call server actions or TanStack Query hooks where reactive.
- Dates: `date-fns`, never raw Date manipulation.
- IDs: UUIDv7 via Supabase `gen_random_uuid()`; never client-generated.

## Git Workflow (fast mode)
This project is built by one human + Claude agents. To keep velocity up we commit **directly to `main` from feature branches when the work is vertical-sliced and low-conflict**. Reviewer agent still runs against every logical unit of work via post-commit review. For any cross-cutting change, use a feature branch + PR.

- Branch naming: `feat/<wave>-<ticket>-<slug>` (e.g. `feat/wave1-t3-design-system`).
- Commit messages: conventional (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
- PR title: `[Wave N] <ticket-id>: <title>` when PRs are used.
- Never: `--no-verify`, `--force` push, or `reset --hard` on main.

## Verification Before Considering a Wave Done
- [ ] `npm run build` succeeds
- [ ] `npm run lint` clean (warnings allowed but tracked)
- [ ] `npm run typecheck` (or `tsc --noEmit`) clean
- [ ] `npm run test` unit/component green (when tests exist)
- [ ] Manual smoke: every public page loads at `localhost:3000` with no console errors
- [ ] Lighthouse mobile ≥ 90 (Performance/Accessibility/SEO/Best Practices) after Wave 2 lands

## Agent Roster (see PLAN.md for full detail)
orchestrator · scaffolder · db-architect · designer · frontend-dev · admin-dev · backend-dev · integrator · seo-agent · devops-agent · qa-agent · reviewer · deployer.

Each agent reads:
1. This root `CLAUDE.md` (the constitution)
2. `PLAN.md` (the execution plan)
3. `BACDA_Website_Revamp_PRD.pdf` sections relevant to their ownership
4. `TASKS.md` for their specific ticket
5. Their own per-directory `CLAUDE.md` (scope + ownership)

Handoffs → `.agent-handoffs/<ticket-id>.md` (gitignored). Orchestrator reads handoffs between waves to resolve cross-agent conflicts.

## Out-of-Scope Pending User Actions
These steps require user involvement and won't be completed by agents autonomously:
- Supabase cloud project creation (local `supabase start` works for dev)
- Netlify site creation + linking to GitHub (for staging deploy)
- Resend account + domain verification (DNS records at GoDaddy)
- GoDaddy DNS CNAME `new → bacda-site.netlify.app`
- Admin user seed (manual via Supabase dashboard → Authentication → Users → Add user)

Every such step is documented in `RUNBOOK.md` with exact values and commands.
