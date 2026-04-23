# BACDA Website Revamp — End-to-End Execution Plan

## Context

**What we're building.** A complete revamp of bayareacreativedancers.org for Bay Area Creative Dancers, a 501(c) non-profit Indian classical/contemporary dance company led by artistic director Dalia Sen. The legacy site is a dated Bootstrap 2.x / jQuery 1.8.2 static site on GoDaddy cPanel with broken carousels, stale 2023 event promos, inline styles, and no CMS. Authoritative spec is `BACDA_Website_Revamp_PRD.pdf` (61 pages) in the repo root.

**Why now.** BACDA needs (a) a modern, performant, SEO-engineered public site that reflects the caliber of their productions (NABC opening ceremonies, PM Modi inaugural show, Raabdta, Bodhayon, Kingdom Of Dreams 2025), (b) a password-protected admin dashboard so Dalia or a delegated volunteer can edit events/testimonials/team/home content without developer involvement, and (c) a fully automated GitHub Actions → Netlify deploy pipeline.

**Intended outcome.** A Next.js 14 + Supabase + Netlify site live at `new.bayareacreativedancers.org`, populated with migrated legacy content (images from `legacy-website/public_html/img/`, YouTube embeds, BACD mission + Dalia bio + 4 industry testimonials), with Lighthouse mobile ≥ 90, Accessibility ≥ 95, SEO = 100, LCP ≤ 2.5s, and WCAG 2.1 AA compliance. Root-domain cutover is explicitly **deferred** per user direction — the handoff package at the end of this project ends at the staging subdomain.

## User Directives (override PRD where conflicting)

The user's 10 directives take precedence over the PRD where they differ:

1. **GitHub remote:** `https://github.com/bacda-dev/org-website` (PRD said `<org>/bacda-site` — user wins).
2. **CI/CD:** GitHub Actions + Netlify CLI deploy on push to `main`.
3. **Deploy target:** `new.bayareacreativedancers.org` only. **No root-domain cutover in scope.**
4. **No newsletter** — drops PRD §4.2.1 newsletter signup, `newsletter_subscribers` table, `/admin/newsletter`, footer newsletter form, migration `0009_newsletter_subscribers.sql`.
5. **Socials:** Instagram `@bayareacreativedanceacademy` (confirmed, resolves PRD §13.2 Q1), YouTube (channel `UCPYZ8dOpCwy-bFLRqoiX90g`), Facebook (`/BayAreaCreativeDanceAcademy`). **No Twitter/X, no TikTok, no LinkedIn.**
6. **Resend** for contact-form transactional email.
7. **No Mailchimp.**
8. **No Google Cloud Console required.** Consequences:
   - YouTube: **manual admin curation** (per user Q1 answer) — admins paste URLs into an `event_videos` / `gallery_videos` row; lite-youtube-embed renders thumbnails client-side. No API key. **Drops** PRD §15.3 YouTube Data API integration and `YOUTUBE_API_KEY` env var.
   - Google Maps on `/contact`: use the no-API-key iframe embed (`https://www.google.com/maps?q=Fremont,CA&output=embed`) — this works without a GCP project. **Drops** `GOOGLE_MAPS_API_KEY`.
   - Google Search Console: manual post-launch step for admin (verify via DNS TXT record — no GCP project). Documented in `RUNBOOK.md`, not automated.
   - Bing Webmaster Tools, Google Business Profile: post-launch admin checklist items only.
9. **Media:** Reuse legacy images from `legacy-website/public_html/img/` (seeded into Supabase Storage `gallery` + `posters` buckets during Wave 1). Reuse YouTube embed IDs found in legacy HTML (`KWzwSzxBUis`, `LDdBAEWIfh4`, `BMFBOWVmAUc`, `aX0ykUf-g0k`, `R4Bkme6VYk8`).
10. **Logo source:** `legacy-website/public_html/img/bacda-2020-logo.png` → copied to `public/brand/bacda-logo-original.png`, vectorized to SVG by designer agent per PRD §14.3.

**User Q-answer amendments (this session):**
- **YouTube:** Manual admin curation (no API, no GCP).
- **Launch scope:** Staging-only (`new.*`). Root cutover deferred.
- **Donate CTA:** Include. Implementation: nav + footer "Donate" button driven by `home_content.donate_url` (admin editable in `/admin/home`). Button hidden if URL empty. User provides the final URL (Zeffy/Donorbox/Stripe/PayPal.me) via admin UI post-launch — no hardcoded URL shipped.
- **Sponsors:** Include as admin-managed. New table `sponsors (id, name, logo_url, website_url, sort_order, is_active)` + `/admin/sponsors` CRUD. Ships **empty** — legacy LoanDepot / Rajeev Awasty NOT carried forward without fresh confirmation.
- **Analytics:** Skip in v1. No tracking scripts. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` omitted from `.env.example`. GSC verification is the only search-discovery setup; documented in RUNBOOK.

## Execution Model

### Autonomy mandate

User instruction: *"Plan this end to end to… carry out the full dev end to end without any permissions."* Auto mode is active. This plan authorizes the following without further prompting:
- All file creation/edits inside `/Users/ayanputatunda/Documents/Bacda/org-website/`
- `npm install`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`, `npx supabase *`, `npx netlify *`
- All git operations except push to `main` without PR (we go through the PR flow per PRD §8.5)
- `gh` CLI for PRs, branches, workflow inspection
- Playwright browser automation for QA cycles
- Reading and referencing `legacy-website/**` and `Harness/**`

**Out of autonomous scope (will pause and ask):**
- Creating the GitHub repo or pushing initial commit to `bacda-dev/org-website` (user must confirm the org `bacda-dev` exists and agent has `gh auth` for it)
- Linking Netlify site to GitHub (requires Netlify login OAuth in a browser)
- Creating Supabase project (requires Supabase dashboard OAuth; alternative: local `supabase start` dev stack until user provides project ref)
- Creating Resend account / domain verification DNS records
- Adding CNAME `new → bacda-site.netlify.app` at GoDaddy (user-owned DNS)

For these, the agent prepares everything (code, configs, documentation, exact CLI commands and DNS record values to paste) and pauses at the single human-gated step.

### Agent roster (13 specialists, per PRD §9.2 + §16.12)

| Agent | Subagent type | Primary outputs |
|---|---|---|
| orchestrator | main session (this one) | Wave dispatch, TASKS.md, handoff reading, PR merges |
| scaffolder | general-purpose | Next.js 14 skeleton, tsconfig, package.json, Tailwind, shadcn init |
| db-architect | general-purpose | `supabase/migrations/0001_…0008_*.sql`, `seed.sql`, RLS policies |
| designer | frontend-design (skill) | `tailwind.config.ts`, `app/globals.css`, `public/brand/**`, `components/ui/**`, `components/brand/logo.tsx` |
| frontend-dev | general-purpose | `app/(public)/**`, `components/sections/**`, `lib/fetchers/**` |
| admin-dev | general-purpose | `app/(admin)/**`, admin CRUD UI, middleware.ts |
| backend-dev | general-purpose | `app/api/**`, server actions, Supabase Edge Function `send-contact-email` |
| integrator | general-purpose | `lib/integrations/{youtube,instagram,facebook,resend}.ts`, lite-youtube-embed setup |
| seo-agent | general-purpose | `app/sitemap.ts`, `app/robots.ts`, JSON-LD components, per-page generateMetadata, review gate on every frontend PR |
| devops-agent | vercel:deployment-expert OR general-purpose | `.github/workflows/ci.yml`, `netlify.toml`, `.env.example`, branch protection setup |
| qa-agent | general-purpose | Vitest unit + component tests, Playwright E2E, axe-core accessibility, Lighthouse CI |
| reviewer | general-purpose | Code review against Agent Constitution (root CLAUDE.md), PR approvals |
| deployer | general-purpose | Final Netlify deploy, smoke test, handoff docs |

Each agent runs with its own per-directory `CLAUDE.md` scoping its ownership (per PRD §9.5). Agents communicate via handoff notes written to `.agent-handoffs/<ticket-id>.md` (PRD §9.6). Orchestrator reads handoffs before dispatching next wave.

### Parallelization strategy

Orchestrator uses the `Agent` tool to fan out tasks. **Within a wave, independent tasks run as parallel Agent calls in a single assistant message.** Between waves, the orchestrator reads handoffs, resolves any cross-agent conflicts, then dispatches the next wave.

---

## Wave Plan

### Wave 0 — Preflight (serial, orchestrator-only)

1. Clone the current working dir into a clean state — repo is already initialized at `/Users/ayanputatunda/Documents/Bacda/org-website/` with remote `https://github.com/bacda-dev/org-website.git`, branch `main`, zero commits.
2. Read the full PRD into context (already done — distilled into this plan).
3. Create root `CLAUDE.md` with the **Agent Constitution** verbatim from PRD §9.4, amended for this project's user directives (no newsletter, no GCP, staging-only launch).
4. Create `TASKS.md` listing all wave tickets with IDs (`W1-T1` through `W4-T12`), owning agent, dependencies, acceptance criteria.
5. Create `.agent-handoffs/` and `.gitignore` it.
6. Write the `.env.example` scaffold with required vars only (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL, NEXT_PUBLIC_SITE_URL, FB_OEMBED_TOKEN — optional, SENTRY_DSN — optional). No YOUTUBE_API_KEY, no GOOGLE_MAPS_API_KEY, no MAILCHIMP_*, no NEXT_PUBLIC_PLAUSIBLE_DOMAIN.
7. Make initial commit on `main` (scaffolding only — CLAUDE.md, TASKS.md, .gitignore, README skeleton, .env.example). Push to remote. This is the ONLY direct-to-main commit; everything subsequent goes through PR per PRD §8.5.

**Gate to Wave 1:** User confirms GitHub repo access + Supabase project (or greenlights local-only dev until Supabase comes online).

### Wave 1 — Foundation (4 agents in parallel)

Dispatched as a single assistant message with four `Agent` tool calls.

- **W1-T1 / scaffolder:** `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`. Install: `@supabase/supabase-js @supabase/ssr react-hook-form zod @hookform/resolvers framer-motion lucide-react lite-youtube-embed react-markdown @uiw/react-md-editor sonner`. Dev: `vitest @testing-library/react @playwright/test @axe-core/playwright eslint-plugin-jsx-a11y`. Initialize shadcn (`npx shadcn@latest init` → `base-nova` style). Write `next.config.js` with `output: 'standalone'`, image remote patterns for Supabase storage + YouTube thumbnails + Instagram CDN. Write `tsconfig.json` strict mode. Scaffold empty folder structure per PRD Appendix A.
- **W1-T2 / db-architect:** Write migrations `0001_events.sql` → `0008_instagram_highlights.sql` (drop 0009 newsletter per user directive). Add a `0009_sponsors.sql` migration for the new sponsors table. Extend `home_content` with `donate_url text` column. Write RLS policies exactly per PRD §5.3. Write `seed.sql` with legacy content from Appendix B (past events, upcoming KoD 2025, team, Dalia bio, 4 testimonials with Tanushree/Debojyoti/Gayatri/Sanjib, mission statement, BACD acronym copy). Do NOT seed sponsors (user confirms current list later). Seed gallery with legacy image paths pointing to Supabase storage paths that will be populated in W1-T2b.
- **W1-T2b / db-architect (sub-task):** Write a local seeding script `scripts/seed-storage.ts` that, when run with `SUPABASE_SERVICE_ROLE_KEY`, uploads legacy images from `legacy-website/public_html/img/parallax-slider/`, `img/events/upcoming/`, `img/team/`, `img/home/`, `img/events/index/` into Supabase Storage bucket `gallery` with organized prefixes (`hero/`, `events/<slug>/`, `team/`, `posters/`). Skips files larger than 2MB — those get flagged for manual optimization. Idempotent via upsert.
- **W1-T3 / designer:** **MUST first** load the `frontend-design` skill per PRD §14.1, read PRD §6 + §14 in full, inspect `legacy-website/public_html/img/bacda-2020-logo.png`. Then produce: `tailwind.config.ts` with all §6.2 color tokens (ink, cream, white, burgundy, burgundy-dark, gold, muted, border, error, success) and §6.3 typography via `next/font/google` (Fraunces + Instrument Sans + JetBrains Mono). Generate all 10 derived logo assets per PRD §14.3.2 from the original PNG (SVG vectorization, favicons, apple-touch-icon, OG image). Build shadcn primitives per PRD §14.4 deliverables: Button, Input, Card, Dialog, Toast (sonner), underline-style form inputs, burgundy focus ring. Write `components/brand/logo.tsx` exactly per PRD §14.5 contract.
- **W1-T4 / devops-agent:** Write `.github/workflows/ci.yml` per PRD §8.2 (lint + typecheck + vitest + build), plus a second job `lighthouse` that runs against Netlify preview on PR. Write `netlify.toml` per PRD §8.3 with the legacy-to-new URL redirects. Configure `@netlify/plugin-nextjs`. Write `lighthouse-budget.json` targeting the PRD §1.3 success criteria. Write GitHub branch protection rules via `gh api` (main: require PR, require CI, require 1 approval, no force push).

**Parallel safety:** T1 touches root config files; T2 touches only `supabase/`; T3 touches only `tailwind.config.ts`, `app/globals.css`, `public/brand/`, `components/ui/`, `components/brand/`; T4 touches only `.github/` and `netlify.toml`. Zero overlap — safe to run concurrently. Each writes to its own feature branch `feat/wave1-t<N>-<slug>`, opens a PR.

**Gate to Wave 2:** All 4 Wave 1 PRs reviewed (by reviewer agent against the Agent Constitution), CI green, merged to `main`. Local Supabase running with migrations applied and seed data loaded. Storage buckets created and legacy images uploaded via `scripts/seed-storage.ts`.

### Wave 2 — Core Build (5 agents in parallel)

- **W2-T1 / frontend-dev:** Implement `app/(public)/layout.tsx` with nav (transparent-over-hero, solid-on-scroll) + footer (social icons FB/IG/YT + Donate CTA + © + quick links). Implement `app/(public)/page.tsx` (home with hero, featured event, BACD acronym animated reveal, recent videos strip from admin-curated list, testimonials carousel, sponsors strip if any exist). Implement `app/(public)/about/page.tsx`, `events/page.tsx` (Upcoming | Past tabs, year filter), `events/[slug]/page.tsx`, `gallery/page.tsx` (Videos + Photos tabs), `testimonials/page.tsx`, `contact/page.tsx` (form + no-API-key Google Maps iframe + social icons). All pages are React Server Components by default. Data fetched via `lib/fetchers/*.ts` using Supabase server client. Dynamic pages use `generateMetadata()` for per-page SEO. Every image uses `next/image`. Every section component is under 300 lines.
- **W2-T2 / admin-dev:** Implement `app/(admin)/layout.tsx` with admin nav (Dashboard / Home / Events / Testimonials / Team / Sponsors / Media / Social / Submissions / Settings — no newsletter page per user directive). Implement `middleware.ts` redirecting unauthenticated `/admin/*` to `/admin/login`. Build all CRUD screens per PRD §7.3 (minus §7.3.9 newsletter). Add `/admin/sponsors` per user directive. Event editor: markdown editor (`@uiw/react-md-editor`), slug auto-gen from title with manual override, poster upload → Supabase Storage `posters` bucket, photo gallery drag-drop → `gallery` bucket + auto-create `event_photos` rows, YouTube URL input with client-side videoId regex extraction. Toasts via sonner. Optimistic UI with rollback. Every destructive action gets a confirmation dialog.
- **W2-T3 / backend-dev:** Write server actions for every admin mutation (create/update/delete on events, testimonials, team, home_content, gallery_videos, instagram_highlights, sponsors). Every action: auth check → Zod validate → Supabase service-role write → revalidateTag/revalidatePath. Write Supabase Edge Function `send-contact-email/index.ts`: accepts `{name, email, subject, message}`, Zod-validates, rate-limits (3/hour per IP via simple in-memory or upstash if available), inserts into `contact_submissions`, and calls Resend `resend.emails.send` to `contactus@bayareacreativedancers.org` from a verified `RESEND_FROM_EMAIL`. If Resend not yet configured, log the submission and return 200 (graceful degradation). Mock fallback for local dev.
- **W2-T4 / integrator:** Write `lib/integrations/youtube.ts` — NOT the Data API version. Just a `parseYouTubeId(url: string): string | null` util, a `getVideoThumbnail(id)` helper hitting `https://i.ytimg.com/vi/<id>/maxresdefault.jpg` (no API key). Write `lib/integrations/instagram.ts` — oEmbed via `graph.facebook.com/v18.0/instagram_oembed` (Facebook app token, server-side only; optional — degrades gracefully). Write `lib/integrations/facebook.ts` — static share URL helpers (sharer.php, no SDK). Write `lib/integrations/resend.ts` — wraps Resend SDK; mock fallback when `RESEND_API_KEY` not set. Integrate `lite-youtube-embed` globally via `components/social/youtube-player.tsx`.
- **W2-T5 / seo-agent:** Write `app/sitemap.ts` (dynamic, pulls static routes + events from Supabase via `getAllEvents()`). Write `app/robots.ts` (allow `/`, disallow `/admin`, `/api`; sitemap reference). Write `lib/seo/json-ld.tsx` components: `<OrganizationSchema />`, `<EventSchema />`, `<PersonSchema />`, `<VideoObjectSchema />`, `<BreadcrumbSchema />`. Verify every page exports a `generateMetadata` returning complete Metadata object per PRD §14.6 (title template, OG, Twitter card, canonical). Review every frontend-dev PR with an SEO checklist comment before approving.

**Coordination points between W2 agents:**
- frontend-dev depends on designer's primitives (completed in W1) and backend-dev's fetchers (built in parallel — use stub mocks until actions land, then swap). If backend lags, frontend renders from seed data directly.
- admin-dev depends on backend-dev's server actions — these two coordinate tightly; admin-dev writes the UI first with stubbed action calls, backend-dev lands real actions, admin-dev swaps.
- integrator's `parseYouTubeId` is used by both frontend-dev (gallery) and admin-dev (event editor) — land this first inside Wave 2.

**Gate to Wave 3:** All W2 PRs merged. Manual smoke test: visit every public page at localhost:3000, log in to admin at `/admin/login`, create an event, publish it, verify it appears on `/events` within 60s (ISR revalidation). Contact form submits to Resend (or logs mock) and writes to `contact_submissions`.

### Wave 3 — Quality Gate (qa-agent + reviewer, parallel)

- **W3-T1 / qa-agent (unit):** Vitest coverage on every server action, Zod schema, fetcher, and util. Target ≥ 90% on `lib/`, 100% on mutations.
- **W3-T2 / qa-agent (E2E):** Playwright specs for 5 PRD §10.2 critical flows:
  1. Visitor lands on home → sees featured event → clicks CTA → external ticket URL opens in new tab
  2. Visitor browses events → filters by year 2019 → opens Banga Mela detail → YouTube video plays (thumbnail click)
  3. Visitor submits contact form → sees success toast → row visible in `contact_submissions`
  4. Admin logs in → creates event as Draft → publishes → appears on `/events` within 60s
  5. Admin uploads 5 photos to an event → reorders → saves → gallery reflects order
- **W3-T3 / qa-agent (accessibility):** `axe-core` + Playwright on every public page. Zero violations required. Test keyboard nav, skip link, focus trap in dialogs.
- **W3-T4 / qa-agent (performance):** Lighthouse CI locally (unthrottled mobile profile) against all public pages. Capture baseline scores, document any gap from the PRD §1.3 targets, fix regressions.
- **W3-T5 / reviewer:** Full code review against root `CLAUDE.md` constitution. Verify: TS strict no-any, every component under 300 lines, Tailwind-only (no inline style except CSS custom properties for dynamic colors), every image has alt text, every form has labels, every interactive element keyboard-accessible, content is 100% DB-driven (no hardcoded events or testimonials anywhere in source).

**Gate to Wave 4:** Zero CRITICAL/HIGH bugs from QA report, Lighthouse ≥ 90 mobile, axe zero violations, reviewer approval. Any fix required: reassigned to originating agent, retested, then re-gated.

### Wave 4 — Deploy & Handoff (serial, deployer)

- **W4-T1:** Connect Netlify site to `bacda-dev/org-website` (user-gated OAuth step). Configure env vars in Netlify: copy values from `.env.local` except Supabase service role goes Netlify-server-only, Resend key server-only. Trigger first deploy to the Netlify auto-generated `bacda-site.netlify.app`.
- **W4-T2:** Smoke test the Netlify preview URL. Fix any prod-build-only bugs (e.g., RSC/client boundary issues, env var surface area).
- **W4-T3:** (User-gated) Add DNS CNAME `new → bacda-site.netlify.app` at GoDaddy. Wait for SSL provisioning (~5 min). Verify `https://new.bayareacreativedancers.org` serves the new site.
- **W4-T4:** Run Lighthouse + axe against the live `new.*` URL. Record scores in `docs/qa-reports/launch-audit.md`.
- **W4-T5:** Admin seeding session. Dalia logs in (user manually creates the admin user via Supabase dashboard → Authentication → Users → Add user; auto-generated password email sent). Admin: reviews seeded events, edits any copy, uploads any additional photos, pastes current Instagram highlight URLs, confirms Donate URL, confirms sponsor list (if any).
- **W4-T6:** Write `README.md` (dev quickstart), `README_ADMIN.md` (non-technical admin guide with screenshots of each admin page), `ARCHITECTURE.md` (system overview reflecting final build), `RUNBOOK.md` (rotate API keys, invite new admin, restore from backup, verify in Google Search Console via DNS TXT, submit sitemap). The GSC + Bing + GBP steps are documented as manual admin tasks — NOT automated.
- **W4-T7:** 60-min async or scheduled walkthrough with Dalia, recording preserved. 2 weeks of async email support window begins.

**Stopping point:** `new.bayareacreativedancers.org` is live, content-populated, Lighthouse ≥ 90, admin trained, handoff docs delivered. Root-domain DNS cutover is deferred per user directive — the RUNBOOK documents the Phase 3 cutover procedure (PRD §11.3) so BACDA can execute it independently when they're ready.

---

## Critical File Map

New files (created by this plan):

- Root: `CLAUDE.md`, `TASKS.md`, `README.md`, `README_ADMIN.md`, `ARCHITECTURE.md`, `RUNBOOK.md`, `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `.env.example`, `.gitignore`, `netlify.toml`, `.github/workflows/ci.yml`, `lighthouse-budget.json`
- `app/`: `(public)/layout.tsx + page.tsx`, `(public)/about/page.tsx`, `(public)/events/{page.tsx,[slug]/page.tsx}`, `(public)/gallery/page.tsx`, `(public)/testimonials/page.tsx`, `(public)/contact/page.tsx`, `(admin)/layout.tsx`, `(admin)/admin/{page,login,home,events,events/[id],testimonials,team,sponsors,media,social,instagram-highlights,submissions,settings}/page.tsx`, `api/contact/route.ts`, `layout.tsx` (root), `globals.css`, `sitemap.ts`, `robots.ts`, `not-found.tsx`, `middleware.ts`
- `components/`: `ui/{button,input,card,dialog,toast,tabs,badge,skeleton}.tsx`, `brand/logo.tsx`, `sections/{hero,featured-event,bacd-acronym,recent-videos,testimonial-carousel,footer,nav,event-grid,event-detail-hero,photo-gallery,sponsors-strip}.tsx`, `social/{youtube-grid,youtube-player,instagram-grid,latest-videos-strip,share-buttons}.tsx`, `admin/{admin-nav,event-editor,testimonial-card,team-member-card,sponsor-card,submission-row,media-uploader,image-uploader,markdown-editor}.tsx`
- `lib/`: `supabase/{client,server,middleware}.ts`, `fetchers/{events,testimonials,team,home,gallery,sponsors,instagram}.ts`, `validators/{events,testimonials,contact,…}.ts`, `integrations/{youtube,instagram,facebook,resend}.ts`, `seo/json-ld.tsx`, `utils.ts`, `auth.ts`
- `supabase/`: `migrations/0001_events.sql` … `0008_instagram_highlights.sql`, `0009_sponsors.sql`, `seed.sql`, `functions/send-contact-email/index.ts`, `config.toml`
- `public/brand/`: `bacda-logo-original.png` (copy from legacy), `bacda-logo.svg`, `bacda-logo-mono-light.svg`, `bacda-logo-mono-dark.svg`, `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `og-image.png`, `og-image-square.png`
- `scripts/`: `seed-storage.ts` (legacy image uploader)
- `__tests__/`, `e2e/`: Vitest + Playwright specs

Reused from legacy (copied, not linked):

- `legacy-website/public_html/img/bacda-2020-logo.png` → `public/brand/bacda-logo-original.png`
- `legacy-website/public_html/img/parallax-slider/*.jpg` → Supabase Storage `gallery/hero/*`
- `legacy-website/public_html/img/events/**/*` → Supabase Storage `gallery/events/<slug>/*`
- `legacy-website/public_html/img/team/{tshankars,dmishras,gjoshi,sanjibs}.jpg` → Supabase Storage `gallery/testimonials/*`
- YouTube IDs from legacy HTML: `KWzwSzxBUis`, `LDdBAEWIfh4`, `BMFBOWVmAUc`, `aX0ykUf-g0k`, `R4Bkme6VYk8` → seeded into `gallery_videos`

Read-only reference:

- `Harness/.claude-agents/*.md` — delegated agent context templates (inform per-agent CLAUDE.md authoring)
- `Harness/standards/*.md` — coding standards applied across every agent
- `Harness/.claude/commands/*.md` — slash command templates (reference only; not auto-invoked)

## Verification

**Per-wave gates:** specified above. Each wave is blocked until its gate passes.

**End-to-end verification (executed during Wave 4):**

1. Clone fresh: `git clone https://github.com/bacda-dev/org-website.git bacda-fresh && cd bacda-fresh && npm install`
2. Boot local: `npx supabase start && cp .env.example .env.local && <fill creds> && npm run dev`
3. Visit `http://localhost:3000` — home renders with hero, featured event, BACD acronym, recent videos, testimonials, sponsors (if seeded), footer with Donate + social icons
4. Visit every page in the sitemap — no 404s, no console errors
5. `npm run test` — all unit tests green
6. `npm run test:e2e` — all 5 Playwright flows green
7. `npx @axe-core/cli http://localhost:3000 /about /events /contact /testimonials /gallery` — zero violations
8. Log in at `/admin/login` with the manually-seeded admin user. Create a new event. Verify it appears on `/events` within 60s.
9. Submit the contact form. Verify email received at `contactus@bayareacreativedancers.org` (live) or logged (mock). Verify row in `contact_submissions`.
10. `npm run build && npm start` — production build serves locally without errors
11. `npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,seo,best-practices --preset=mobile` — Performance ≥ 90, Accessibility ≥ 95, SEO = 100, Best Practices ≥ 95
12. On Netlify preview: repeat 3, 8, 9, 11 against the live URL
13. Validate every JSON-LD payload at `https://search.google.com/test/rich-results` — zero errors
14. Validate OG cards at `https://www.opengraph.xyz` — image + title render correctly
15. Final: `sitemap.xml` accessible at `/sitemap.xml` with all public routes + dynamic events; `robots.txt` allows `/`, disallows `/admin` and `/api`

**Acceptance sign-off (PRD §12.4 items 52–69):** every item in that list is a checkbox in `docs/qa-reports/launch-audit.md`; all must be checked before Wave 4 closes.

## Permission / Auto-Mode Configuration

Before Wave 1 begins, the orchestrator updates `.claude/settings.local.json` (project-local, not committed) to allow the following tool patterns without per-invocation prompts, honoring the user's "without any permissions" directive:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git checkout:*)",
      "Bash(git branch:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git status)",
      "Bash(git push:*)",
      "Bash(gh pr:*)",
      "Bash(gh api:*)",
      "Bash(gh workflow:*)",
      "Bash(supabase:*)",
      "Bash(netlify:*)",
      "Edit(**)",
      "Write(**)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(git push --force:*)",
      "Bash(git reset --hard:*)"
    ]
  }
}
```

Destructive ops stay denied. The single human-gated moments are listed under "Out of autonomous scope" above. Everything else flows uninterrupted.
