# BACDA Website — Wave/Ticket Tracker

Source of truth for ticket IDs referenced in commit messages, PR titles, and agent handoff notes. The approved `PLAN.md` carries the full detail; this file is the checklist.

Legend: `⬜ pending` · `🔄 in progress` · `✅ done` · `⚠️ blocked`

---

## Wave 0 — Preflight (orchestrator, serial)

- [x] `W0-T1` Write root `CLAUDE.md` Agent Constitution
- [x] `W0-T2` Write `TASKS.md` (this file)
- [x] `W0-T3` Write `.env.example` scaffold (no YOUTUBE_API_KEY, no GOOGLE_MAPS_API_KEY, no Mailchimp, no Plausible)
- [x] `W0-T4` Write `.claude/settings.local.json` permission allowlist (uncommitted)
- [x] `W0-T5` Create `.agent-handoffs/` dir (gitignored)
- [x] `W0-T6` Initial commit + push

## Wave 1 — Foundation (4 agents)

- [ ] `W1-T1` **scaffolder** — Bootstrap Next.js 14 + TS strict + Tailwind + App Router + shadcn init + install runtime + dev deps + folder structure per PRD Appendix A + next.config.js (output standalone, image remotePatterns).
- [ ] `W1-T2` **db-architect** — Migrations `0001_events.sql` → `0008_instagram_highlights.sql` + `0009_sponsors.sql` (no newsletter) + RLS policies + `seed.sql` (Appendix B content: past events, KoD 2025, team, Dalia bio, 4 testimonials, mission, BACD acronym) + `scripts/seed-storage.ts` (legacy image uploader).
- [ ] `W1-T3` **designer** — `tailwind.config.ts` with color tokens + Fraunces/Instrument Sans/JetBrains Mono via `next/font/google`. 10 logo derived assets from `bacda-2020-logo.png`. shadcn primitives: Button, Input, Card, Dialog, Toast, Tabs, Badge, Skeleton. `components/brand/logo.tsx` per PRD §14.5.
- [ ] `W1-T4` **devops** — `.github/workflows/ci.yml` (lint + typecheck + vitest + build + Lighthouse-on-preview) + `netlify.toml` with legacy URL redirects + `lighthouse-budget.json`.

## Wave 2 — Core Build (5 agents, parallel)

- [ ] `W2-T1` **frontend-dev** — `app/(public)/**`: layout (nav transparent-over-hero + footer with Donate/socials), home, about, events (+year filter), events/[slug], gallery (Videos/Photos tabs), testimonials, contact (form + no-API Google Maps iframe). All RSC by default; `generateMetadata` on every page.
- [ ] `W2-T2` **admin-dev** — `app/(admin)/**`: login, dashboard, home editor, events CRUD (+ editor with markdown / slug-gen / poster upload / photo drag-drop / YouTube URL parse), testimonials, team, sponsors, media, social, instagram-highlights, submissions, settings. `middleware.ts` protects `/admin/*`. Toasts via sonner; confirmation dialogs on destructive actions.
- [ ] `W2-T3` **backend-dev** — Server actions for every admin mutation (auth → Zod → supabase service-role → revalidate). Supabase Edge Function `send-contact-email/index.ts` (validate → rate-limit → insert `contact_submissions` → Resend send). Graceful fallback when `RESEND_API_KEY` not set.
- [ ] `W2-T4` **integrator** — `lib/integrations/{youtube,instagram,facebook,resend}.ts` (NO API keys; manual curation path). lite-youtube-embed wrapper component.
- [ ] `W2-T5` **seo-agent** — `app/sitemap.ts` (dynamic, pulls events from Supabase) + `app/robots.ts` + `lib/seo/json-ld.tsx` (Organization / Event / Person / VideoObject / BreadcrumbList components) + per-page metadata reviewed.

## Wave 3 — Quality Gate (qa + reviewer)

- [ ] `W3-T1` **qa-agent** — Vitest unit tests on lib/actions/validators.
- [ ] `W3-T2` **qa-agent** — Playwright E2E on 5 critical flows (home → CTA → tickets; events year filter; contact submit; admin create event; admin photo upload+reorder).
- [ ] `W3-T3` **qa-agent** — axe-core accessibility scan on every public page.
- [ ] `W3-T4` **qa-agent** — Lighthouse CI (mobile) on home/events/about.
- [ ] `W3-T5` **reviewer** — Code review vs. Constitution non-negotiables.

## Wave 4 — Deploy & Handoff (deployer, serial)

- [ ] `W4-T1` Netlify site link to GitHub repo (user-gated OAuth step).
- [ ] `W4-T2` Smoke test Netlify preview URL.
- [ ] `W4-T3` GoDaddy CNAME `new → bacda-site.netlify.app` (user-gated).
- [ ] `W4-T4` Live Lighthouse + axe audit at `new.bayareacreativedancers.org`.
- [ ] `W4-T5` Dalia admin seeding session.
- [ ] `W4-T6` Write `README.md`, `README_ADMIN.md`, `ARCHITECTURE.md`, `RUNBOOK.md`.
- [ ] `W4-T7` Walkthrough recording + 2-week async support window.

---

## Acceptance (PRD §12.4)

Every item here is a Wave-4-gate checklist item. See `docs/qa-reports/launch-audit.md` (created in W4-T4).
