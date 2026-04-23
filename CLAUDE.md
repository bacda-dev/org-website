# Axiomic-ai Template — Foundation Stack

This is the organizational template repo for all Axiomic-ai products. All child repos inherit from this repo and get the full skill set, standards, and agent configurations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Framework | Next.js (App Router) + React |
| Language | TypeScript 5.0+ (strict mode) |
| Styling | Tailwind CSS 4 + shadcn/ui (base-nova) |
| State (client) | Zustand with persist middleware |
| State (server) | TanStack Query v5 |
| Database | Supabase (PostgreSQL + Realtime + Auth) |
| Caching | Upstash Redis (serverless) |
| AI | Claude via @anthropic-ai/sdk — structured outputs with Zod |
| Auth | Supabase Auth + httpOnly cookies + middleware session refresh |
| Testing | Jest + @testing-library (unit), Playwright (E2E) |
| Container | Docker Compose (dev + CI), multi-stage Dockerfile |
| Deployment | Vercel (web), Supabase (DB), Upstash (cache) |
| Icons | lucide-react |
| Charts | Recharts |
| Animations | Motion (Framer Motion) |
| Fonts | Plus Jakarta Sans (body), JetBrains Mono (mono) |

## Architecture Principles

1. **No separate backend** — All API logic lives in Next.js Route Handlers (`web/app/api/`), deployed as Vercel serverless functions
2. **Container-native** — Docker Compose for local dev, CI runs in containers
3. **Supabase-first** — PostgreSQL + RLS + Realtime + Auth, no ORM
4. **AI as structured output** — Claude returns Zod-validated JSON, never free text parsing
5. **Graceful degradation** — Mock clients for Supabase/Redis/Claude when env vars not set (demo mode)
6. **Cost discipline** — Target <$0.50/user/month for AI calls

## Project Structure

```
web/
├── app/
│   ├── (auth)/          # Login, register pages
│   ├── (app)/           # Authenticated app pages
│   │   └── layout.tsx   # AppShell wrapper
│   ├── api/             # Route Handlers (serverless)
│   ├── layout.tsx       # Root layout (providers)
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── layout/          # AppShell, Sidebar, Header
│   └── [feature]/       # Feature-specific components
├── lib/
│   ├── stores/          # Zustand stores
│   ├── hooks/           # TanStack Query hooks
│   ├── ai/
│   │   ├── prompts/     # System + user prompt builders
│   │   └── schemas/     # Zod schemas for AI output
│   ├── supabase.ts      # Server + browser clients
│   ├── claude.ts        # generateStructuredOutput(), streamConversationResponse()
│   ├── redis.ts         # getCache(), setCache(), checkRateLimit()
│   ├── auth.ts          # verifyJWT(), token helpers
│   └── utils.ts         # cn(), shared utilities
├── types/
│   └── database.ts      # Supabase-generated types
└── middleware.ts         # Session refresh, route protection
supabase/
└── migrations/          # SQL migration files
ios/                     # Swift/SwiftUI (when needed)
android/                 # Kotlin/Compose (when needed)
```

## Key Patterns

### API Route Pattern
```
Auth check → Zod validation → Business logic → JSON response
```

### State Management
- Zustand stores for UI state + persistence (auth, theme, feature-specific)
- TanStack Query for server data fetching with staleTime caching
- Supabase Realtime + RealtimeBus for cross-device + in-app sync

### Auth Flow
- Supabase Auth (email/password, OAuth)
- Middleware refreshes session on every request
- Protected routes redirect to /login
- Demo mode fallback when Supabase not configured

### AI Integration
- `generateStructuredOutput<T>(schema, systemPrompt, userPrompt)` for JSON
- `streamConversationResponse(systemPrompt, messages)` for chat/streaming
- Zod schemas with `.describe()` for AI-readable field docs
- Redis-cached conversation history for multi-turn

## Slash Commands Available

Use `/scaffold-*` commands to generate boilerplate:
- `/scaffold-api-route` — New API route with auth, validation, caching
- `/scaffold-feature` — Full feature: API + page + store + hook + component
- `/scaffold-migration` — New Supabase migration with RLS
- `/scaffold-ai-feature` — AI-powered feature with Claude structured output
- `/scaffold-component` — New React component with proper patterns
- `/scaffold-landing` — Marketing landing page section

Use `/setup-*` commands for infrastructure:
- `/setup-project` — Initialize new project from template
- `/setup-auth` — Configure Supabase Auth + middleware
- `/setup-devops` — Docker + CI/CD + Vercel
- `/setup-testing` — Jest + Playwright configuration
- `/setup-realtime` — Supabase Realtime + event bus
- `/setup-caching` — Upstash Redis caching layer

Use `/run-*` commands for workflows:
- `/run-qa` — QA cycle with Playwright
- `/run-deploy` — Deploy to Vercel + verify

## Standards

See `docs/standards/` for detailed implementation standards:
- `backend-standards.md` — API routes, auth, Supabase, Redis, error handling
- `frontend-standards.md` — Components, state, styling, SSE streaming
- `ai-standards.md` — Prompts, schemas, cost optimization, testing
- `devops-standards.md` — Docker, CI/CD, deployment, monitoring
- `ios-standards.md` — Swift/SwiftUI patterns
- `android-standards.md` — Kotlin/Compose patterns

## Agent Contexts

See `.claude-agents/` for multi-agent orchestration:
- `orchestrator.md` — Engineering manager, delegates to specialists
- `backend.md` — API routes, database, auth, caching
- `frontend.md` — React components, state management, UI
- `ai.md` — Prompts, schemas, AI integration
- `design.md` — UI/UX, design system, landing pages
- `devops.md` — Infrastructure, CI/CD, deployment
- `qa.md` — Testing, QA cycles, bug tracking

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
ANTHROPIC_API_KEY=

# Auth
JWT_SECRET=              # min 32 chars
JWT_REFRESH_SECRET=      # min 32 chars

# Cache
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
