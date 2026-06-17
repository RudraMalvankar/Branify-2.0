# Brainify v2 — Production-Grade Architecture

> **Document Version:** 1.0.0  
> **Date:** June 17, 2026  
> **Status:** Draft — Ready for Implementation  
> **Architect:** Senior Staff Engineer

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Backend Architecture](#3-backend-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Database Architecture](#5-database-architecture)
6. [Authentication Architecture](#6-authentication-architecture)
7. [API Design](#7-api-design)
8. [Security Architecture](#8-security-architecture)
9. [AI Architecture](#9-ai-architecture)
10. [Redis Architecture](#10-redis-architecture)
11. [Docker Architecture](#11-docker-architecture)
12. [CI/CD Architecture](#12-cicd-architecture)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Monitoring Architecture](#14-monitoring-architecture)
15. [Logging Architecture](#15-logging-architecture)
16. [Developer Experience](#16-developer-experience)
17. [Migration Strategy from V1](#17-migration-strategy-from-v1)

---

## 1. System Architecture

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER DEVICES                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐                 │
│  │   Web    │  │  Mobile  │  │   PWA     │  │   Tablet   │                 │
│  │ Browser  │  │  (iOS)   │  │ (Android) │  │   (Web)    │                 │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └─────┬──────┘                 │
│       │             │              │              │                         │
└───────┼─────────────┼──────────────┼──────────────┼─────────────────────────┘
        │             │              │              │
        │             │              │              │
        │     ┌───────┴──────────────┴──────────────┴───────┐
        │     │              VERCEL (CDN)                    │
        │     │   ┌────────────────────────────────────┐     │
        │     │   │       Next.js 15 App Router        │     │
        │     │   │  SSR · ISR · SSG · API Routes      │     │
        │     │   └────────────────────────────────────┘     │
        │     └───────────────────┬──────────────────────────┘
        │                         │
        │                         │ HTTPS
        │                         │
        │              ┌──────────▼──────────┐
        │              │   RAILWAY (Backend)  │
        │              │  ┌────────────────┐  │
        │              │  │  Express v5     │  │
        │              │  │  TypeScript    │  │
        │              │  │  ESM Modules   │  │
        │              │  └───────┬────────┘  │
        │              └──────────┼───────────┘
        │                         │
        │                         │
        ├─────────────────────────┼──────────────────────────────┐
        │                         │                              │
        │              ┌──────────▼──────────┐      ┌───────────▼──────────┐
        │              │   NEON POSTGRESQL    │      │    UPSTASH REDIS     │
        │              │   Serverless SQL     │      │    Serverless Cache  │
        │              │   + Drizzle ORM      │      │    + Rate Limiting   │
        │              │   + Migrations       │      │    + Job Queue       │
        │              └─────────────────────┘      └──────────────────────┘
        │
        │                         ┌──────────────────────────────────┐
        │                         │       AI PROVIDER LAYER          │
        │                         │  ┌─────────┐  ┌──────────────┐  │
        │                         │  │ Gemini  │  │   OpenAI     │  │
        │                         │  │ 2.0     │  │   GPT-4o     │  │
        │                         │  │ Flash   │  │              │  │
        │                         │  └─────────┘  └──────────────┘  │
        │                         │  ┌─────────┐  ┌──────────────┐  │
        │                         │  │ Claude  │  │  OpenRouter  │  │
        │                         │  │ (Future)│  │  (Future)    │  │
        │                         │  └─────────┘  └──────────────┘  │
        │                         └──────────────────────────────────┘
        │
        │                         ┌──────────────────────────────────┐
        │                         │      EXTERNAL SERVICES           │
        │                         │  ┌─────────┐  ┌──────────────┐  │
        │                         │  │Wikipedia│  │   Arcjet     │  │
        │                         │  │   API   │  │   Security   │  │
        │                         │  └─────────┘  └──────────────┘  │
        │                         │  ┌─────────┐  ┌──────────────┐  │
        │                         │  │ Sentry  │  │   (Future)   │  │
        │                         │  │ Errors  │  │              │  │
        │                         │  └─────────┘  └──────────────┘  │
        │                         └──────────────────────────────────┘
```

### 1.2 Request Lifecycle

```
CLIENT
  │
  ▼
VERCEL EDGE NETWORK (CDN + static assets)
  │
  ├── Public pages → SSR at Edge (Landing, Impact, Login)
  │
  └── API requests → Next.js API Route (BFF) or direct to Railway
       │
       ▼
RAILWAY (Express v5 Backend)
  │
  ├── Arcjet Middleware (bot detection, SQLi/XSS prevention)
  ├── Helmet Middleware (security headers)
  ├── Rate Limiter (Redis-backed, distributed)
  ├── Auth Middleware (JWT verification from HTTP-only cookie)
  │
  ▼
ROUTE → CONTROLLER (Zod validation)
  │
  ▼
SERVICE (business logic)
  │
  ├── Redis (cache check → if hit, return)
  │
  ▼
REPOSITORY (database queries via Drizzle ORM)
  │
  ▼
DATABASE (Neon PostgreSQL)
  │
  ├── Audit log (async)
  ├── Response → cache in Redis (if applicable)
  │
  ▼
RESPONSE ← structured JSON ← error handling middleware
```

### 1.3 Architecture Principles

| Principle | Implementation |
|-----------|---------------|
| **Separation of Concerns** | Route → Controller → Service → Repository — no shortcuts |
| **Type Safety** | TypeScript strict mode everywhere. Shared types between frontend/backend. |
| **Validation First** | Every public endpoint validates input via Zod before processing |
| **Defense in Depth** | Arcjet + Helmet + CORS + Rate Limiting + Input Validation |
| **Observability** | Winston structured logging + Morgan HTTP logging + Sentry error tracking |
| **Caching by Default** | Cache expensive queries (AI responses, analytics aggregations) in Redis |
| **Idempotency** | POST endpoints are idempotent where possible (assessments, session logging) |
| **Fail Fast** | Validate configuration at startup. Crash if critical env vars missing. |

---

## 2. Monorepo Structure

### 2.1 Root Structure

```
brainify/
│
├── apps/
│   ├── backend/                 # Express v5 + TypeScript API
│   └── web/                     # Next.js 15 frontend
│
├── packages/
│   ├── shared/                  # Shared types, Zod schemas, constants
│   ├── config-eslint/          # Shared ESLint configuration
│   └── config-typescript/      # Shared TS configs
│
├── docker/                      # Dockerfiles & compose files
│   ├── Dockerfile
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   └── .dockerignore
│
├── scripts/
│   ├── dev.sh
│   └── prod.sh
│
├── .github/
│   └── workflows/
│       ├── lint.yml
│       ├── type-check.yml
│       ├── test.yml
│       ├── build.yml
│       ├── docker-build.yml
│       ├── security-scan.yml
│       └── deploy.yml
│
├── docs/
│   ├── architecture/
│   │   ├── project-analysis.md  # V1 analysis
│   │   └── v2-architecture.md   # This document
│   ├── api/
│   │   └── openapi.yaml         # OpenAPI 3.1 specification
│   └── adr/                     # Architecture Decision Records
│
├── package.json                 # Workspace root
├── turbo.json                   # Turborepo configuration
├── .gitignore
├── .env.example
├── .prettierrc
├── .eslintrc.cjs
├── tsconfig.base.json
└── README.md
```

### 2.2 Backend Folder Structure (`apps/backend/src/`)

```
src/
│
├── config/
│   ├── env.ts                   # Zod-validated environment variables
│   ├── database.ts              # Drizzle connection + Neon config
│   ├── redis.ts                 # Upstash Redis client
│   ├── logger.ts               # Winston logger configuration
│   ├── cors.ts                  # CORS configuration
│   ├── helmet.ts               # Helmet security headers config
│   └── arcjet.ts               # Arcjet security configuration
│
├── controllers/
│   ├── auth.controller.ts       # Sign-up, sign-in, sign-out, refresh
│   ├── profile.controller.ts    # Get/update profile
│   ├── assessment.controller.ts # VARK, Brain, retake
│   ├── ai.controller.ts         # Study Buddy chat
│   ├── search.controller.ts     # Smart Search, All-styles
│   ├── analytics.controller.ts  # Dashboard analytics
│   ├── sessions.controller.ts   # Study sessions management
│   ├── content.controller.ts    # VARK questions, resources
│   └── admin.controller.ts      # Admin-only endpoints
│
├── services/
│   ├── auth/
│   │   ├── auth.service.ts      # Auth business logic
│   │   ├── token.service.ts     # JWT generation, verification, rotation
│   │   └── password.service.ts  # Hashing, validation
│   ├── assessment/
│   │   ├── vark.service.ts      # VARK scoring logic
│   │   └── brain.service.ts     # Brain dominance scoring
│   ├── ai/
│   │   ├── ai.service.ts        # AI orchestration (factory)
│   │   ├── gemini.service.ts    # Gemini provider implementation
│   │   ├── openai.service.ts    # OpenAI provider implementation
│   │   ├── prompt.service.ts    # Prompt template management
│   │   └── token-counter.ts     # Token estimation
│   ├── search.service.ts        # Wikipedia + AI hybrid search
│   ├── profile.service.ts       # Profile management
│   ├── analytics.service.ts     # Analytics aggregation
│   ├── sessions.service.ts      # Study session tracking
│   └── cache.service.ts         # Redis caching logic
│
├── repositories/
│   ├── user.repository.ts       # Users table queries
│   ├── assessment.repository.ts # Assessments table queries
│   ├── session.repository.ts    # Study sessions queries
│   ├── activity.repository.ts   # Daily activity queries
│   ├── content.repository.ts    # Content/resources queries
│   └── token.repository.ts      # Refresh token queries
│
├── routes/
│   ├── index.ts                 # Route aggregator
│   ├── auth.routes.ts           # /api/auth/*
│   ├── profile.routes.ts        # /api/profile/*
│   ├── assessment.routes.ts     # /api/assessment/*
│   ├── ai.routes.ts             # /api/ai/*
│   ├── search.routes.ts         # /api/search/*
│   ├── analytics.routes.ts      # /api/analytics/*
│   ├── sessions.routes.ts       # /api/sessions/*
│   ├── content.routes.ts        # /api/content/*
│   └── admin.routes.ts          # /api/admin/*
│
├── middleware/
│   ├── auth.middleware.ts        # JWT verification, role check
│   ├── error.middleware.ts       # Global error handler
│   ├── validate.middleware.ts    # Zod validation middleware
│   ├── rate-limit.middleware.ts  # Redis-backed rate limiting
│   ├── arcjet.middleware.ts      # Arcjet security middleware
│   └── not-found.middleware.ts   # 404 handler
│
├── validations/
│   ├── auth.validation.ts        # Sign-up, sign-in schemas
│   ├── profile.validation.ts     # Profile update schemas
│   ├── assessment.validation.ts  # VARK, brain answer schemas
│   ├── search.validation.ts      # Search query schemas
│   ├── ai.validation.ts          # Chat message schemas
│   └── common.validation.ts      # Pagination, ID params
│
├── models/
│   ├── schema/
│   │   ├── users.ts              # Users table definition
│   │   ├── profiles.ts           # Profiles table definition
│   │   ├── assessments.ts        # Assessments table definition
│   │   ├── sessions.ts           # Study sessions definition
│   │   ├── activities.ts         # Daily activities definition
│   │   ├── conversations.ts      # AI conversations definition
│   │   ├── refresh-tokens.ts     # Refresh tokens definition
│   │   ├── vark-questions.ts     # VARK questions definition
│   │   ├── brain-questions.ts    # Brain questions definition
│   │   ├── resources.ts          # Learning resources definition
│   │   ├── life-skills.ts        # Life skills content definition
│   │   └── audit-logs.ts         # Audit logs definition
│   └── relations.ts              # Drizzle table relations
│
├── utils/
│   ├── response.ts               # Standardized response helpers
│   ├── sanitize.ts               # XSS sanitization
│   ├── date.ts                   # Date manipulation utilities
│   ├── constants.ts              # App-wide constants
│   └── helpers.ts                # General helpers
│
├── jobs/
│   ├── queue.ts                  # Bull/BullMQ queue setup
│   ├── processors/
│   │   ├── audit-log.processor.ts
│   │   ├── cache-warm.processor.ts
│   │   └── notification.processor.ts
│   └── schedules/
│       └── streak-calc.schedule.ts
│
├── types/
│   ├── express.d.ts              # Express Request augmentation
│   ├── ai.types.ts               # AI provider interfaces
│   ├── api.types.ts              # API response types
│   └── enums.ts                  # Shared enums
│
├── constants/
│   ├── vark-scoring.ts           # VARK scoring constants
│   ├── brain-scoring.ts          # Brain scoring thresholds
│   └── style-prompts.ts          # AI style prompt templates
│
├── app.ts                        # Express app setup (middleware, routes)
└── server.ts                     # Server entry point (listen, graceful shutdown)
```

### 2.3 Frontend Folder Structure (`apps/web/src/`)

```
src/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Landing page (SSR)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── impact/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard layout (sidebar + topbar)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── recommendations/
│   │   │   └── page.tsx
│   │   ├── learn/
│   │   │   └── [style]/
│   │   │       └── page.tsx
│   │   ├── study-buddy/
│   │   │   └── page.tsx
│   │   ├── smart-search/
│   │   │   └── page.tsx
│   │   └── life-skills/
│   │       └── page.tsx
│   ├── (quiz)/
│   │   ├── questions/
│   │   │   └── page.tsx          # VARK quiz
│   │   ├── brain-quiz/
│   │   │   └── page.tsx
│   │   └── results/
│   │       └── page.tsx
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx             # 404 page
│   └── error.tsx                 # Global error boundary
│
├── components/
│   ├── ui/                       # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── mobile-nav.tsx
│   │   └── footer.tsx
│   ├── quiz/
│   │   ├── vark-question.tsx
│   │   ├── brain-question.tsx
│   │   ├── progress-bar.tsx
│   │   └── results-chart.tsx
│   ├── dashboard/
│   │   ├── welcome-banner.tsx
│   │   ├── stat-card.tsx
│   │   ├── engagement-chart.tsx
│   │   ├── vark-radar.tsx
│   │   └── quick-actions.tsx
│   ├── ai/
│   │   ├── chat-widget.tsx
│   │   ├── chat-message.tsx
│   │   ├── chat-input.tsx
│   │   ├── style-badge.tsx
│   │   └── search-results.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── oauth-buttons.tsx
│   └── shared/
│       ├── loading-spinner.tsx
│       ├── error-state.tsx
│       ├── empty-state.tsx
│       └── confirm-dialog.tsx
│
├── hooks/
│   ├── use-auth.ts               # Auth state hook
│   ├── use-theme.ts              # Theme toggle hook
│   ├── use-notifications.ts      # Notification hook
│   ├── use-debounce.ts           # Debounce utility
│   ├── use-media-query.ts        # Responsive breakpoints
│   ├── use-intersection-observer.ts
│   └── use-local-storage.ts
│
├── lib/
│   ├── api-client.ts             # Axios/fetch wrapper with interceptors
│   ├── utils.ts                  # cn() utility, formatters
│   ├── constants.ts              # App constants
│   └── sanitize.ts               # XSS sanitization
│
├── providers/
│   ├── auth-provider.tsx
│   ├── theme-provider.tsx
│   └── query-provider.tsx        # TanStack Query provider
│
├── services/
│   ├── auth.service.ts           # Auth API calls
│   ├── profile.service.ts        # Profile API calls
│   ├── assessment.service.ts     # Assessment API calls
│   ├── ai.service.ts             # AI chat API calls
│   ├── search.service.ts         # Search API calls
│   └── analytics.service.ts      # Analytics API calls
│
├── store/
│   ├── auth.store.ts             # Zustand auth store
│   ├── ui.store.ts               # UI state (sidebar, modals)
│   └── notifications.store.ts    # Notification state
│
├── types/
│   ├── api.ts                    # API response types
│   ├── auth.ts                   # Auth types
│   ├── assessment.ts             # Assessment types
│   ├── ai.ts                     # AI types
│   └── user.ts                   # User types
│
└── styles/
    ├── globals.css               # Tailwind + global styles
    └── shadcn.css                # Shadcn UI overrides
```

### 2.4 Shared Package (`packages/shared/`)

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── user.ts
│   │   ├── assessment.ts
│   │   ├── api.ts
│   │   └── ai.ts
│   ├── validations/
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── assessment.ts
│   │   ├── search.ts
│   │   └── ai.ts
│   ├── constants/
│   │   ├── vark.ts
│   │   ├── brain.ts
│   │   ├── roles.ts
│   │   └── styles.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

## 3. Backend Architecture

### 3.1 Request Flow (Detailed)

```
HTTP Request
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                  MIDDLEWARE STACK                     │
│                                                       │
│  1. Helmet        → Security headers                 │
│  2. CORS          → Cross-origin handling             │
│  3. CookieParser  → Parse HTTP-only cookies          │
│  4. Morgan        → HTTP request logging (Winston)   │
│  5. Express JSON  → Body parsing                      │
│  6. Arcjet        → Bot detection, SQLi/XSS shield   │
│  7. Rate Limiter  → Redis-backed rate limits         │
│                                                       │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                   ROUTE LAYER                        │
│                                                       │
│  Routes ONLY define:                                  │
│  - HTTP method + path                                 │
│  - Middleware to apply (auth, validation)              │
│  - Controller function to call                        │
│                                                       │
│  Example:                                             │
│  router.post('/sign-up', validate(signUpSchema),      │
│              authController.signUp)                   │
│                                                       │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                   CONTROLLER LAYER                    │
│                                                       │
│  Controllers ONLY:                                    │
│  - Extract data from req (body, params, query, user)   │
│  - Call service methods                                │
│  - Send standardized response                          │
│                                                       │
│  NO business logic                                     │
│  NO database queries                                   │
│                                                       │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                    SERVICE LAYER                      │
│                                                       │
│  Services ONLY:                                       │
│  - Business logic implementation                      │
│  - Orchestration of multiple repositories             │
│  - Cache management (Redis read/write)               │
│  - External API calls (Wikipedia, AI providers)      │
│                                                       │
│  Throw domain-specific errors (AppError)             │
│                                                       │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                    │
│                                                       │
│  Repositories ONLY:                                   │
│  - Database queries via Drizzle ORM                   │
│  - Type-safe SQL generation                           │
│  - No business logic                                  │
│  - Return typed results                               │
│                                                       │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                 ERROR HANDLING                        │
│                                                       │
│  Custom AppError class with:                          │
│  - statusCode (HTTP status)                           │
│  - message (user-facing)                              │
│  - code (internal error code)                         │
│  - details (validation errors)                        │
│                                                       │
│  Global error handler catches all errors:             │
│  - Logs via Winston + Sentry                          │
│  - Returns standardized error response                │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 3.2 Dependency Injection & Module Structure

```typescript
// Modules are structured for testability:
//
// Each service receives its dependencies via constructor:
//
// class AuthService {
//   constructor(
//     private readonly userRepo: UserRepository,
//     private readonly tokenRepo: TokenRepository,
//     private readonly tokenService: TokenService,
//     private readonly passwordService: PasswordService,
//   ) {}
// }
//
// This allows:
// - Unit testing with mocked repositories
// - Easy dependency swapping
// - Clear dependency graph

// App module wiring (app.ts):
//
// const userRepo = new UserRepository(db);
// const tokenRepo = new TokenRepository(db);
// const passwordService = new PasswordService();
// const tokenService = new TokenService(config);
// const authService = new AuthService(userRepo, tokenRepo, tokenService, passwordService);
// const authController = new AuthController(authService);
```

### 3.3 Error Handling Strategy

```typescript
// Custom error class hierarchy:
//
// AppError (base)
//   ├── ValidationError    (400) — Zod validation failures
//   ├── AuthenticationError (401) — Invalid/missing credentials
//   ├── AuthorizationError  (403) — Insufficient permissions
//   ├── NotFoundError       (404) — Resource not found
//   ├── ConflictError       (409) — Duplicate resource
//   ├── RateLimitError      (429) — Too many requests
//   └── InternalError       (500) — Unexpected errors
//
// Global error handler:
// - Catches all errors
// - Logs via Winston + Morgan
// - Reports to Sentry (for 5xx errors)
// - Returns standardized JSON response
```

### 3.4 Server Configuration (`server.ts`)

```typescript
// Server entry point responsibilities:
//
// 1. Validate environment variables (Zod schema)
// 2. Initialize PostgreSQL connection (Drizzle)
// 3. Initialize Redis connection (Upstash)
// 4. Create Express app with all middleware
// 5. Register all routes
// 6. Start HTTP server
// 7. Register graceful shutdown handlers:
//    - SIGTERM → close server, disconnect DB, quit Redis
//    - SIGINT  → same as SIGTERM
//    - uncaughtException → log, Sentry, exit(1)
//    - unhandledRejection → log, Sentry, exit(1)
//
// Port: Environment variable PORT || 8080
```

---

## 4. Frontend Architecture

### 4.1 Next.js App Router Structure

```
app/
├── (public)/          → Route group without auth layout
│   ├── page.tsx       → Landing page (SSR)
│   ├── login/page     → Login (unauthenticated redirect)
│   └── register/page  → Register (unauthenticated redirect)
│
├── (dashboard)/       → Route group with dashboard layout
│   ├── layout.tsx     → Sidebar + Topbar + AuthGuard
│   ├── dashboard/page → Analytics dashboard
│   ├── profile/page   → User profile settings
│   └── ...
│
├── (quiz)/            → Route group with quiz layout
│   ├── layout.tsx     → Minimal layout, no sidebar
│   └── questions/page → VARK quiz flow
│
├── layout.tsx         → Root layout (fonts, metadata, providers)
└── error.tsx          → Global error boundary
```

### 4.2 Authentication Flow (Frontend)

```
1. User visits protected route
    │
2. AuthGuard component checks auth state
    │
    ├── NOT authenticated → redirect to /login
    │
    └── Authenticated → render page
         │
3. API calls made via api-client.ts
    │
4. api-client.ts reads access token from HTTP-only cookie
    │   (via server-side cookie parsing or BFF)
    │
    ├── Token valid → proceed with request
    │
    └── Token expired
         │
         ├── Call /api/auth/refresh
         │   (HTTP-only cookie includes refresh token)
         │
         ├── Success → new access token, retry original request
         │
         └── Failed → redirect to /login
```

### 4.3 State Management Strategy

| State Type | Technology | Examples |
|-----------|-----------|----------|
| **Server State** | TanStack Query (React Query) | User profile, assessments, analytics data |
| **Auth State** | Zustand + Auth Context | Current user, login/logout actions |
| **UI State** | Zustand | Sidebar open/closed, theme mode, modals |
| **Form State** | React Hook Form + Zod | Login form, register form, profile edit |
| **AI Chat State** | Zustand | Chat messages, streaming responses |

### 4.4 API Client Architecture

```typescript
// services/api-client.ts
//
// Responsibilities:
// - Base URL configuration (from NEXT_PUBLIC_API_URL)
// - Request/response interceptors
// - Automatic token refresh on 401 responses
// - Error normalization (transform API errors to AppError)
// - Request deduplication (debounce identical requests)
// - Retry logic for transient failures (exponential backoff)
// - Abort controller support for cancellation
//
// Key features:
// - Type-safe request/response using shared types
// - Automatic Content-Type header
// - Authorization header from cookie (handled server-side)
```

### 4.5 Protected Routes

```typescript
// Components/auth-guard.tsx
//
// - Wraps protected pages
// - Checks authentication state from Zustand store
// - Shows loading skeleton while checking auth
// - Redirects to /login if unauthenticated
// - Checks role-based access (user vs admin)
// - Renders 403 page if insufficient permissions
```

---

## 5. Database Architecture

### 5.1 Entity Relationship Diagram

```
┌───────────────────────────┐
│          USERS            │
├───────────────────────────┤
│ id              UUID  PK  │
│ name            VARCHAR   │
│ email           VARCHAR   │←┐ UNIQUE
│ password_hash   VARCHAR   │ │
│ role            ENUM      │ │ (user, admin)
│ is_active       BOOLEAN   │ │
│ created_at      TIMESTAMP │ │
│ updated_at      TIMESTAMP │ │
│ deleted_at      TIMESTAMP │ │ (soft delete)
└───────────────────────────┘ │
         │                     │
         │ 1                   │ 1
         ▼                     ▼
┌───────────────────────┐ ┌─────────────────────────────┐
│      PROFILES         │ │      REFRESH_TOKENS          │
├───────────────────────┤ ├─────────────────────────────┤
│ id           UUID  PK │ │ id                UUID  PK  │
│ user_id      UUID  FK │→│ user_id           UUID  FK  │→
│ bio          TEXT     │ │ token_hash        VARCHAR   │
│ avatar_url   VARCHAR  │ │ expires_at        TIMESTAMP │
│ timezone     VARCHAR  │ │ is_revoked        BOOLEAN   │
│ created_at   TIMESTAMP│ │ created_at        TIMESTAMP │
│ updated_at   TIMESTAMP│ └─────────────────────────────┘
└───────────────────────┘
         │
         │ 1
         ▼
┌───────────────────────┐
│     ASSESSMENTS       │
├───────────────────────┤
│ id           UUID  PK │
│ user_id      UUID  FK │→
│ type         ENUM     │ (vark, brain)
│ scores       JSONB    │
│ result       VARCHAR  │
│ note         TEXT     │
│ created_at   TIMESTAMP│
└───────────────────────┘
         │
         │ 1
         ▼
┌───────────────────────┐
│   STUDY_SESSIONS      │
├───────────────────────┤
│ id           UUID  PK │
│ user_id      UUID  FK │→
│ type         ENUM     │ (pomodoro, manual, auto)
│ duration_mins INTEGER │
│ started_at   TIMESTAMP│
│ ended_at     TIMESTAMP│
│ created_at   TIMESTAMP│
└───────────────────────┘
         │
         │ 1
         ▼
┌───────────────────────┐
│   DAILY_ACTIVITIES    │
├───────────────────────┤
│ id           UUID  PK │
│ user_id      UUID  FK │→
│ date         DATE     │
│ hours        DECIMAL  │
│ sessions_cnt INTEGER  │
│ created_at   TIMESTAMP│
└───────────────────────┘

┌───────────────────────┐ ┌─────────────────────────────┐
│   AI_CONVERSATIONS    │ │      VARK_QUESTIONS          │
├───────────────────────┤ ├─────────────────────────────┤
│ id           UUID  PK │ │ id                INT    PK │
│ user_id      UUID  FK │→│ question_text     TEXT      │
│ title        VARCHAR  │ │ options           JSONB     │
│ style        ENUM     │ │ scoring_map       JSONB     │
│ message_count INTEGER │ │ is_active         BOOLEAN   │
│ created_at   TIMESTAMP│ │ created_at        TIMESTAMP │
│ updated_at   TIMESTAMP│ └─────────────────────────────┘
└───────────────────────┘
         │
         │ 1
         ▼
┌───────────────────────┐ ┌─────────────────────────────┐
│   AI_MESSAGES         │ │      BRAIN_QUESTIONS         │
├───────────────────────┤ ├─────────────────────────────┤
│ id           UUID  PK │ │ id                INT    PK │
│ conv_id      UUID  FK │→│ group_key         VARCHAR   │
│ role         ENUM     │ │ option_a_text     TEXT      │
│ content      TEXT     │ │ option_a_value    VARCHAR   │
│ tokens_used  INTEGER  │ │ option_b_text     TEXT      │
│ created_at   TIMESTAMP│ │ option_b_value    VARCHAR   │
└───────────────────────┘ │ correct_answer    VARCHAR   │
                         │ is_active         BOOLEAN   │
                         │ created_at        TIMESTAMP │
                         └─────────────────────────────┘

┌───────────────────────┐ ┌─────────────────────────────┐
│   LEARNING_RESOURCES  │ │      LIFE_SKILLS            │
├───────────────────────┤ ├─────────────────────────────┤
│ id           UUID  PK │ │ id                UUID  PK  │
│ vark_style   ENUM     │ │ category          ENUM      │
│ title        VARCHAR  │ │ title             VARCHAR   │
│ description  TEXT     │ │ content           TEXT      │
│ url          VARCHAR  │ │ vark_adapted      JSONB     │
│ type         ENUM     │ │ is_active         BOOLEAN   │
│ category     VARCHAR  │ │ created_at        TIMESTAMP │
│ is_active    BOOLEAN  │ │ updated_at        TIMESTAMP │
│ created_at   TIMESTAMP│ └─────────────────────────────┘
└───────────────────────┘

┌───────────────────────┐
│     AUDIT_LOGS        │
├───────────────────────┤
│ id           UUID  PK │
│ user_id      UUID  FK │→
│ action       VARCHAR  │
│ entity_type  VARCHAR  │
│ entity_id    VARCHAR  │
│ old_values   JSONB    │
│ new_values   JSONB    │
│ ip_address   VARCHAR  │
│ user_agent   TEXT     │
│ created_at   TIMESTAMP│
└───────────────────────┘
```

### 5.2 Drizzle Schema Definitions

```typescript
// models/schema/users.ts
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('user'), // 'user' | 'admin'
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Types inferred from schema:
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### 5.3 Migration Strategy

```bash
# Drizzle Kit commands:
npm run db:generate    # Generate migration files from schema changes
npm run db:migrate     # Apply migrations to database
npm run db:studio      # Open Drizzle Studio GUI

# Migration workflow:
# 1. Modify schema files in models/schema/
# 2. Run `npm run db:generate` → creates migration in drizzle/migrations/
# 3. Review migration SQL for correctness
# 4. Run `npm run db:migrate` → applies to Neon PostgreSQL
# 5. Commit migration files to version control
#
# Production:
# - Migrations run automatically in CI/CD pipeline
# - Zero-downtime migrations via Neon branching
# - Rollback strategy via migration snapshots
```

### 5.4 Index Strategy

```sql
-- Performance indexes for v2 schema:

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at) WHERE is_revoked = false;
CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_type ON assessments(type);
CREATE INDEX idx_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_sessions_started ON study_sessions(started_at);
CREATE INDEX idx_activities_user_date ON daily_activities(user_id, date);
CREATE INDEX idx_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_messages_conversation ON ai_messages(conv_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_vark_questions_active ON vark_questions(is_active);
CREATE INDEX idx_brain_questions_active ON brain_questions(is_active);
CREATE INDEX idx_resources_style ON learning_resources(vark_style);
```

### 5.5 Neon Database Configuration

```typescript
// config/database.ts
//
// - Serverless driver for Neon (neon/serverless)
// - Connection pooling via @neondatabase/serverless
// - Drizzle ORM with Postgres.js driver
// - Prepared statements for performance
// - SSL required in production
// - Connection string from DATABASE_URL env var
//
// Local development:
// - Docker Compose PostgreSQL container
// - OR Neon Local (neon local CLI)
// - Schema synchronization via Drizzle push
```

---

## 6. Authentication Architecture

### 6.1 Token Strategy

```typescript
// === TOKEN CONFIGURATION ===

// Access Token
// - Short-lived: 15 minutes
// - Stored in: HTTP-only cookie named 'access_token'
// - Contains: userId, role
// - Signed with: JWT_ACCESS_SECRET

// Refresh Token
// - Long-lived: 7 days
// - Stored in: HTTP-only cookie named 'refresh_token'
// - Contains: userId, tokenId (UUID)
// - Signed with: JWT_REFRESH_SECRET
// - Hashed version stored in refresh_tokens table

// Cookie Configuration:
// httpOnly: true
// secure: true (production) / false (development)
// sameSite: 'strict'
// path: '/api/auth' (refresh token only accessible on auth endpoints)
// maxAge: 900 (15 min for access) / 604800 (7 days for refresh)
```

### 6.2 Authentication Flow Diagram

```
═══ SIGN UP ═══

POST /api/auth/sign-up
├── Body: { name, email, password }
│
├── Controller:
│   └── validate(body, signUpSchema) → Zod
│
├── Service:
│   ├── Check if email exists → ConflictError if duplicate
│   ├── Hash password (bcrypt, 10 rounds)
│   ├── Create user (Drizzle insert)
│   ├── Create refresh token (UUID, store hash in DB)
│   ├── Generate access token (15 min)
│   └── Generate refresh token (7 days)
│
└── Response:
    ├── Set-Cookie: access_token (httpOnly, secure, sameSite=strict)
    ├── Set-Cookie: refresh_token (httpOnly, secure, sameSite=strict, path=/api/auth)
    └── JSON: { success: true, data: { user: { id, name, email, role } } }


═══ SIGN IN ═══

POST /api/auth/sign-in
├── Body: { email, password }
│
├── Controller:
│   └── validate(body, signInSchema) → Zod
│
├── Service:
│   ├── Find user by email (active, not deleted)
│   ├── Compare password (bcrypt.compare)
│   │   └── Failed → AuthenticationError (generic message)
│   ├── Revoke old refresh tokens
│   ├── Create new refresh token
│   ├── Generate access token
│   └── Generate refresh token
│
└── Response: (same as sign-up)


═══ SIGN OUT ═══

POST /api/auth/sign-out
├── Cookie: refresh_token
│
├── Service:
│   ├── Extract refresh token from cookie
│   ├── Verify and decode refresh token
│   ├── Revoke refresh token in DB (is_revoked = true)
│   └── Clear cookies
│
└── Response:
    ├── Set-Cookie: access_token (empty, maxAge=0)
    ├── Set-Cookie: refresh_token (empty, maxAge=0)
    └── JSON: { success: true, message: 'Signed out successfully' }


═══ TOKEN REFRESH ═══

POST /api/auth/refresh (no auth middleware)
├── Cookie: refresh_token
│
├── Service:
│   ├── Extract refresh token from cookie
│   ├── Verify JWT signature
│   ├── Look up token in DB (by hash)
│   ├── Check not revoked, not expired
│   ├── Token rotation:
│   │   ├── Revoke old refresh token
│   │   ├── Create new refresh token
│   │   └── Generate new access token
│   └── Return new tokens
│
└── Response:
    ├── Set-Cookie: access_token (new)
    ├── Set-Cookie: refresh_token (new, rotated)
    └── JSON: { success: true, data: { user } }
```

### 6.3 Role-Based Access Control (RBAC)

```typescript
// Middleware/auth.middleware.ts
//
// Middleware chain:
//
// 1. authenticate  → Verify access token from cookie
//                    Attach user to request
//
// 2. authorize(...roles) → Check user.role ∈ allowed roles
//                          → AuthorizationError if denied

// Usage in routes:
// router.post('/admin/users',
//   authenticate,
//   authorize('admin'),
//   adminController.listUsers
// );

// Role hierarchy:
// admin: Can access everything
// user:  Can access own resources only
```

### 6.4 Security Best Practices

| Practice | Implementation |
|----------|---------------|
| Password hashing | bcrypt with 10 salt rounds |
| Token expiry | Access: 15 min, Refresh: 7 days |
| Token rotation | New refresh token issued on every refresh |
| Refresh token reuse detection | If revoked token is used, revoke ALL user's tokens |
| Brute force protection | Rate limit: 5 attempts/min per email |
| Account lockout | After 5 failed attempts, lock for 15 min |
| Cookie security | httpOnly + secure + sameSite=strict |
| Path restriction | Refresh cookie only accessible on /api/auth/* |
| Email verification | Optional: send verification email on sign-up |
| Password history | Optional: prevent reuse of last 5 passwords |

---

## 7. API Design

### 7.1 Standardized Response Format

```typescript
// === SUCCESS RESPONSE ===
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}

// === PAGINATED RESPONSE ===
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}

// === ERROR RESPONSE ===
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "invalid_string"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters",
      "code": "too_small"
    }
  ]
}

// === AUTH ERROR ===
{
  "success": false,
  "message": "Invalid credentials",
  "errors": []
}

// === RATE LIMIT ERROR ===
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "errors": [],
  "retryAfter": 45  // seconds
}
```

### 7.2 HTTP Status Codes

| Code | Usage |
|------|-------|
| **200** | Successful GET, PUT, PATCH requests |
| **201** | Successful POST (resource created) |
| **204** | Successful DELETE (no content) |
| **400** | Validation error, bad request |
| **401** | Authentication required or failed |
| **403** | Insufficient permissions (authorization) |
| **404** | Resource not found |
| **409** | Conflict (duplicate email, username) |
| **429** | Rate limit exceeded |
| **500** | Internal server error (unexpected) |
| **503** | Service unavailable (maintenance) |

### 7.3 Endpoint Specifications

#### GET /

```typescript
// Public endpoint
// Purpose: API root, version info
// Auth: None
// Rate Limit: Guest (5/min)

Response 200:
{
  "success": true,
  "message": "Brainify API v2",
  "data": {
    "name": "Brainify API",
    "version": "2.0.0",
    "status": "operational"
  }
}
```

#### GET /health

```typescript
// Public endpoint
// Purpose: Health check for monitoring
// Auth: None
// Rate Limit: Guest (5/min)

Response 200:
{
  "success": true,
  "message": "All systems operational",
  "data": {
    "status": "healthy",
    "uptime": 123456,
    "timestamp": "2026-06-17T12:00:00Z",
    "database": {
      "status": "connected",
      "responseTime": 2
    },
    "redis": {
      "status": "connected",
      "responseTime": 1
    },
    "version": "2.0.0"
  }
}

Response 503 (unhealthy):
{
  "success": false,
  "message": "Service unavailable",
  "data": {
    "status": "unhealthy",
    "uptime": 123456,
    "timestamp": "2026-06-17T12:00:00Z",
    "database": {
      "status": "disconnected",
      "error": "Connection refused"
    }
  }
}
```

#### GET /api

```typescript
// Public endpoint
// Purpose: API documentation/schema
// Auth: None
// Rate Limit: Guest (5/min)

Response 200:
{
  "success": true,
  "data": {
    "openapi": "3.1.0",
    "info": { "title": "Brainify API", "version": "2.0.0" },
    "paths": { ... }  // Full OpenAPI schema
  }
}
```

#### POST /api/auth/sign-up

```typescript
// Public endpoint
// Purpose: Create new user account
// Auth: None
// Rate Limit: Guest (5/min)

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Validation (Zod):
- name: string, 2-255 chars, trimmed
- email: string, valid email format, lowercase
- password: string, 6-128 chars

Response 201:
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-06-17T12:00:00Z"
    }
  }
}
// Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict; Max-Age=900
// Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=604800

Response 409 (duplicate email):
{
  "success": false,
  "message": "An account with this email already exists",
  "errors": [{ "field": "email", "message": "Email is already registered", "code": "unique_violation" }]
}
```

#### POST /api/auth/sign-in

```typescript
// Public endpoint
// Purpose: Authenticate existing user
// Auth: None
// Rate Limit: Guest (5/min) + per-email limit (5/min)

Request Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Validation (Zod):
- email: string, valid email format
- password: string, 1-128 chars

Response 200:
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
// Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict; Max-Age=900
// Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=604800

Response 401:
{
  "success": false,
  "message": "Invalid email or password",
  "errors": []
}
```

#### POST /api/auth/sign-out

```typescript
// Protected endpoint
// Purpose: Invalidate current session
// Auth: Authenticated (from access token cookie)
// Rate Limit: User (10/min)

Response 200:
{
  "success": true,
  "message": "Signed out successfully",
  "data": null
}
// Set-Cookie: access_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
// Set-Cookie: refresh_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
```

### 7.4 Cookie Configuration

```typescript
// config/cookies.ts

export const accessTokenCookie = {
  name: 'access_token',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 15 * 60, // 15 minutes in seconds
};

export const refreshTokenCookie = {
  name: 'refresh_token',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/auth', // Only sent on auth endpoints
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};
```

---

## 8. Security Architecture

### 8.1 Defense in Depth Strategy

```
LAYER 1: EDGE
───────────────────────────────────────────────────
  Vercel Edge Network
  - DDoS protection (Vercel)
  - CDN caching of static assets
  - Edge functions for rate limiting


LAYER 2: WAF & BOT DETECTION
───────────────────────────────────────────────────
  Arcjet
  - Bot detection (block known bots, allow search engines)
  - Shield protection (common web attacks)
  - Email validation (disposable email detection)
  - PII detection (phone numbers, SSNs, credit cards)
  - Rate limiting (distributed)


LAYER 3: HTTP SECURITY HEADERS
───────────────────────────────────────────────────
  Helmet
  - Content-Security-Policy
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Strict-Transport-Security: max-age=63072000
  - X-XSS-Protection: 0 (redundant with CSP)
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: geolocation=(), microphone=(), camera=()


LAYER 4: AUTHENTICATION & AUTHORIZATION
───────────────────────────────────────────────────
  HTTP-only Cookies
  - Access token: 15 min lifespan
  - Refresh token: 7 day lifespan, path restricted
  - SameSite=Strict prevents CSRF

  JWT Verification
  - Every protected route verifies access token
  - Token rotation on refresh

  RBAC
  - Role-based middleware
  - Admin-only endpoints


LAYER 5: INPUT VALIDATION
───────────────────────────────────────────────────
  Zod Schemas
  - Every public endpoint validates input
  - Type coercion and sanitization
  - Consistent error format

  XSS Sanitization
  - Strip script/iframe/object tags
  - Sanitize before dangerouslySetInnerHTML
  - Input encoding


LAYER 6: RATE LIMITING
───────────────────────────────────────────────────
  Redis-Backed Rate Limiting
  - Admin: 20 requests per minute
  - User:  10 requests per minute
  - Guest:  5 requests per minute
  - Auth:   5 attempts per email per minute (login)
  - AI:     15 requests per minute (separate)


LAYER 7: DATABASE SECURITY
───────────────────────────────────────────────────
  Drizzle ORM
  - Parameterized queries (no SQL injection)
  - Type-safe schema
  - Prepared statements

  Neon PostgreSQL
  - SSL/TLS enforced
  - IP whitelist in production
  - Automated backups
```

### 8.2 Arcjet Configuration

```typescript
// config/arcjet.ts
//
// Arcjet setup:
// - API key: ARCJET_KEY (required)
// - Environment: ARCJET_ENV (development/production)
//
// Rules:
// 1. Bot Detection: Block automated traffic, allow search engines
// 2. Shield: Protect against common web attacks
// 3. SQL Injection: Detect and block SQL injection attempts
// 4. XSS: Detect and block cross-site scripting attempts
// 5. Email Validation: Block disposable/temporary email domains
// 6. Rate Limiting: Distributed, Redis-backed (replaces memory limiter)

// Applied as middleware in app.ts:
// app.use(arcjetMiddleware);
```

### 8.3 Rate Limiting Strategy

```typescript
// middleware/rate-limit.middleware.ts
//
// Rate limit tiers (Redis-backed, distributed):
//
// ┌──────────┬───────────────┬──────────────────┐
// │ Tier     │ Requests/min  │ Applied To        │
// ├──────────┼───────────────┼──────────────────┤
// │ admin    │ 20            │ Authenticated     │
// │          │               │ admin users       │
// ├──────────┼───────────────┼──────────────────┤
// │ user     │ 10            │ Authenticated     │
// │          │               │ regular users     │
// ├──────────┼───────────────┼──────────────────┤
// │ guest    │ 5             │ Unauthenticated   │
// │          │               │ requests          │
// ├──────────┼───────────────┼──────────────────┤
// │ auth     │ 5/email/min   │ Login attempts    │
// │          │               │ per email         │
// ├──────────┼───────────────┼──────────────────┤
// │ ai       │ 15            │ AI endpoints      │
// │          │               │ (/api/ai/*,       │
// │          │               │  /api/search/*)   │
// └──────────┴───────────────┴──────────────────┘
//
// Key format in Redis:
// rate_limit:{tier}:{identifier}:{window}
// rate_limit:auth:john@example.com:1718612345

// Response on rate limit hit:
// Status: 429
// Headers:
//   Retry-After: 45
//   X-RateLimit-Limit: 10
//   X-RateLimit-Remaining: 0
//   X-RateLimit-Reset: 1718612389
```

### 8.4 CORS Configuration

```typescript
// config/cors.ts
//
// Allowed origins:
// - Production: FRONTEND_URL (e.g., https://brainify.app)
// - Development: http://localhost:3000 (Next.js)
// - Staging: Preview deployment URLs
//
// Options:
// - origin: strict list or function-based validation
// - credentials: true (cookies require this)
// - methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
// - allowedHeaders: Content-Type, Authorization
// - exposedHeaders: X-RateLimit-*
// - maxAge: 86400 (24 hours for preflight cache)
```

---

## 9. AI Architecture

### 9.1 Provider Abstraction Layer

```
┌──────────────────────────────────────────────────────────┐
│                    AI CONTROLLER                          │
│  (Validates input, calls service, returns response)       │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│                    AI SERVICE                             │
│  (Orchestration, caching, fallback logic)                 │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│                AI PROVIDER FACTORY                        │
│  (Returns provider based on configuration)                │
│                                                           │
│  switch (provider) {                                      │
│    case 'gemini' → return new GeminiProvider(config)      │
│    case 'openai' → return new OpenAIProvider(config)      │
│    case 'claude' → return new ClaudeProvider(config)      │
│    default       → return new GeminiProvider(config)      │
│  }                                                        │
└───────────────────────┬──────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Gemini     │ │   OpenAI     │ │   Claude     │
│   Provider   │ │   Provider   │ │   Provider   │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ - gemini-2.0 │ │ - gpt-4o     │ │ - claude-3.5 │
│   -flash     │ │ - gpt-4o-mini│ │   -sonnet    │
│ - config     │ │ - streaming  │ │ (Future)     │
│ - rate limit │ │ - functions  │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        ▼               ▼               ▼
┌──────────────────────────────────────────────────────────┐
│              AI PROVIDER INTERFACE                        │
│                                                           │
│  interface AIProvider {                                   │
│    chat(params: ChatParams): Promise<ChatResponse>;       │
│    generateContent(params: GenParams): Promise<GenResponse>;│
│    streamChat(params: ChatParams): AsyncIterable<StreamChunk>;│
│  }                                                        │
└──────────────────────────────────────────────────────────┘
```

### 9.2 Prompt Template Architecture

```
prompt-templates/
├── study-buddy/
│   ├── system/
│   │   ├── visual.prompt.yaml       # Visual learner system prompt
│   │   ├── auditory.prompt.yaml     # Auditory learner system prompt
│   │   ├── aural.prompt.yaml        # Aural alias
│   │   ├── readwrite.prompt.yaml    # Read/Write learner system prompt
│   │   └── kinesthetic.prompt.yaml  # Kinesthetic learner system prompt
│   ├── user/
│   │   └── default.prompt.yaml      # User message template
│   └── examples/
│       └── few-shot.prompt.yaml     # Few-shot examples per style
├── smart-search/
│   ├── system/
│   │   ├── visual.prompt.yaml
│   │   ├── auditory.prompt.yaml
│   │   ├── readwrite.prompt.yaml
│   │   └── kinesthetic.prompt.yaml
│   └── system/
│       ├── wikipedia-context.prompt.yaml   # Wikipedia context injection
│       └── all-styles.prompt.yaml          # Multi-style compare
└── lesson-generator/
    ├── system/
    │   └── generate.prompt.yaml
    └── user/
        └── template.prompt.yaml

// Prompt templates use Handlebars/Mustache syntax:
// "You are a {{role}}. The user is a {{style}} learner. {{style_instructions}}"
// Templates are versioned in DB for production updates without deploy.
```

### 9.3 AI Service Responsibilities

```typescript
// services/ai/ai.service.ts
//
// Responsibilities:
//
// 1. Orchestration
//    - Receive request from controller
//    - Build prompt from template + user data
//    - Call provider via factory
//    - Return formatted response
//
// 2. Caching
//    - Check Redis for identical prompt → return cached
//    - Cache policy: same prompt + same style = cached 1 hour
//    - Cache key: hash(prompt + model + style)
//
// 3. Fallback
//    - Primary provider fails → try secondary provider
//    - Both fail → return cached response (if available)
//    - No cache → return graceful error
//
// 4. Token Management
//    - Count tokens before sending
//    - Reject if over limit
//    - Track per-user token usage
//    - Log token consumption for billing
//
// 5. Safety
//    - Content filtering (Arcjet keywords)
//    - Prompt injection detection
//    - Response sanitization
```

### 9.4 VARK Style Prompt System

```typescript
// constants/style-prompts.ts
//
// Each VARK style has a completely different system prompt
// that instructs the AI how to communicate:
//
// ┌──────────────┬────────────────────────────────────────────┐
// │ Style        │ Prompt Characteristics                     │
// ├──────────────┼────────────────────────────────────────────┤
// │ Visual       │ "Use diagrams described in words, spatial  │
// │              │ analogies, tables, charts, 'imagine...'    │
// │              │ Visualize this as...'"                      │
// ├──────────────┼────────────────────────────────────────────┤
// │ Auditory     │ "Conversational tone, mnemonics, verbal    │
// │              │ analogies, 'Listen to this...', 'Think of  │
// │              │ it as a rhythm...'"                         │
// ├──────────────┼────────────────────────────────────────────┤
// │ Read/Write   │ "Definitions, lists, summaries, notes-style│
// │              │ headings, bullet points, 'The key points   │
// │              │ are...'"                                    │
// ├──────────────┼────────────────────────────────────────────┤
// │ Kinesthetic  │ "Real-world examples, step-by-step,        │
// │              │ 'Try this...', action verbs, practical     │
// │              │ applications, hands-on analogies"           │
// └──────────────┴────────────────────────────────────────────┘
```

---

## 10. Redis Architecture

### 10.1 Redis Use Cases

```
┌─────────────────────────────────────────────────────────────┐
│                        UPSTASH REDIS                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  CACHE LAYER                                             │ │
│  │                                                          │ │
│  │  • API Response Cache                                    │ │
│  │    - Key:   api:{method}:{path}:{query_hash}            │ │
│  │    - TTL:   5 minutes                                    │ │
│  │    - Use:   GET /api/profile/me, GET /api/analytics/*    │ │
│  │                                                          │ │
│  │  • AI Response Cache                                     │ │
│  │    - Key:   ai:{model}:{prompt_hash}:{style}            │ │
│  │    - TTL:   1 hour                                       │ │
│  │    - Use:   Identical search queries, popular topics     │ │
│  │                                                          │ │
│  │  • Wikipedia Lookup Cache                                │ │
│  │    - Key:   wiki:{query}                                 │ │
│  │    - TTL:   24 hours                                     │ │
│  │    - Use:   Smart Search Wikipedia fetches               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  RATE LIMITING                                            │ │
│  │                                                          │ │
│  │  • Sliding Window Counter                                │ │
│  │    - Key:   ratelimit:{tier}:{identifier}:{window}      │ │
│  │    - TTL:   Window duration (60 seconds)                │ │
│  │    - Use:   Distributed rate limiting across instances   │ │
│  │                                                          │ │
│  │  • Login Attempt Tracking                                │ │
│  │    - Key:   login:attempts:{email}                      │ │
│  │    - TTL:   15 minutes                                   │ │
│  │    - Use:   Brute force protection                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  SESSION & STATE                                          │ │
│  │                                                          │ │
│  │  • Session Data (if needed)                              │ │
│  │    - Key:   session:{session_id}                        │ │
│  │    - TTL:   1 hour                                       │ │
│  │                                                          │ │
│  │  • Rate Limit Windows (current)                          │ │
│  │    - Stored as sorted sets for sliding window            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  JOB QUEUE (Bull/BullMQ)                                 │ │
│  │                                                          │ │
│  │  • Audit Log Queue                                       │ │
│  │    - Non-critical audit records processed asynchronously │ │
│  │                                                          │ │
│  │  • Cache Warm Queue                                      │ │
│  │    - Pre-cache popular queries during low traffic        │ │
│  │                                                          │ │
│  │  • Email Queue (future)                                  │ │
│  │    - Password reset emails, verification emails          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Redis Configuration

```typescript
// config/redis.ts
//
// Provider: Upstash Redis (serverless, REST + Redis wire protocol)
//
// Local development:
// - Docker Compose Redis container (localhost:6379)
// - No password in development
//
// Production:
// - Upstash Redis URL from UPSTASH_REDIS_URL env var
// - TLS enabled
// - Token-based authentication
//
// Key naming convention:
// {service}:{type}:{identifier}
// Examples:
//   api:get:/api/profile/me:user_123
//   ai:gemini:hash_abc123
//   ratelimit:user:ip_1.2.3.4:1718612345
//   login:attempts:john@example.com
```

### 10.3 Cache Invalidation Strategy

| Cache Type | Invalidation Trigger | Strategy |
|-----------|---------------------|----------|
| API Response | Profile update | Delete key `api:get:/api/profile/me:{userId}` |
| API Response | Session logged | Delete key `api:get:/api/analytics/*:{userId}` |
| AI Response | Time-based | TTL expiry (1 hour) |
| Wikipedia | Time-based | TTL expiry (24 hours) |
| Rate Limit | Time-based | Sliding window auto-expiry |

---

## 11. Docker Architecture

### 11.1 Multi-Stage Dockerfile

```dockerfile
# docker/Dockerfile

# ──────────────────────────────────────
# STAGE 1: Install dependencies
# ──────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

# Install all dependencies (including dev)
RUN npm ci --include=dev

# ──────────────────────────────────────
# STAGE 2: Build
# ──────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build all packages
RUN npm run build

# ──────────────────────────────────────
# STAGE 3: Production
# ──────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/packages ./packages

# Set non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', r => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "apps/backend/dist/server.js"]
```

### 11.2 Development Docker Compose

```yaml
# docker/docker-compose.dev.yml
#
# Provides local infrastructure for development:
# - PostgreSQL (port 5432)
# - Redis (port 6379)
# - Backend API (port 8080) — hot reload via volume mount
#
# Usage: docker compose -f docker/docker-compose.dev.yml up -d

version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: brainify-postgres
    environment:
      POSTGRES_USER: brainify
      POSTGRES_PASSWORD: brainify_dev
      POSTGRES_DB: brainify
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U brainify']
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: brainify-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
      target: deps
    container_name: brainify-app
    ports:
      - '8080:8080'
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://brainify:brainify_dev@postgres:5432/brainify
      REDIS_URL: redis://redis:6379
    volumes:
      - ../apps/backend/src:/app/apps/backend/src
      - ../packages:/app/packages
    command: npm run dev --workspace=apps/backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
```

### 11.3 Production Docker Compose

```yaml
# docker/docker-compose.prod.yml
#
# Production deployment configuration.
# Note: In Railway, this is managed by the platform.
# This file is for self-hosted or alternative deployments.

version: '3.9'

services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
      target: runner
    container_name: brainify-app
    ports:
      - '8080:8080'
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      ARCJET_KEY: ${ARCJET_KEY}
      SENTRY_DSN: ${SENTRY_DSN}
      FRONTEND_URL: ${FRONTEND_URL}
      LOG_LEVEL: info
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
    restart: unless-stopped
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
    healthcheck:
      test: ['CMD', 'node', '-e', "require('http').get('http://localhost:8080/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

### 11.4 .dockerignore

```dockerignore
# docker/.dockerignore

node_modules
.git
.gitignore
*.md
.env
.env.local
.env.*.local
dist
.next
build
coverage
.docker
logs
*.log
.npm
.eslintcache
.prettiercache
turbo
```

### 11.5 Development Scripts

```bash
# scripts/dev.sh
#!/bin/bash
#
# Development startup script
#
# 1. Starts Docker Compose infrastructure (PostgreSQL + Redis)
# 2. Runs database migrations
# 3. Seeds development data
# 4. Starts backend + frontend dev servers concurrently

set -e

echo "🚀 Starting Brainify development environment..."

# Start infrastructure
echo "📦 Starting PostgreSQL and Redis..."
docker compose -f docker/docker-compose.dev.yml up -d postgres redis

# Wait for services
echo "⏳ Waiting for services..."
sleep 3

# Run migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

# Seed data (if needed)
echo "🌱 Seeding development data..."
npm run db:seed

# Start dev servers
echo "🖥️  Starting dev servers..."
npm run dev
```

```bash
# scripts/prod.sh
#!/bin/bash
#
# Production startup script
#
# 1. Validates environment variables
# 2. Runs database migrations
# 3. Starts production server

set -e

echo "🚀 Starting Brainify production server..."

# Validate env
echo "🔍 Validating environment..."
node -e "
  const required = ['DATABASE_URL', 'REDIS_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    console.error('Missing required env vars:', missing.join(', '));
    process.exit(1);
  }
  console.log('✅ All required env vars present');
"

# Run migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

# Start server
echo "🚀 Starting server..."
npm run start
```

---

## 12. CI/CD Architecture

### 12.1 CI/CD Pipeline Overview

```
                    PUSH / PR to main
                          │
                          ▼
              ┌─────────────────────┐
              │  TRIGGER:           │
              │  - push to main     │
              │  - pull_request to  │
              │    main             │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
       ┌──────│  1. LINT & FORMAT   │──────┐
       │      └─────────────────────┘      │
       │                                   │
       ▼                                   ▼
┌──────────────┐                  ┌────────────────┐
│ ESLint check  │                  │ Prettier check │
└──────┬───────┘                  └───────┬────────┘
       └──────────────┬──────────────────┘
                      │
                      ▼
              ┌─────────────────────┐
              │  2. TYPE CHECK      │
              │  tsc --noEmit       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  3. TEST            │
              │  vitest run         │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  4. BUILD           │
              │  npm run build      │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  5. DOCKER BUILD    │
              │  docker build       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  6. SECURITY SCAN   │
              │  - Trivy            │
              │  - Snyk (optional)  │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  7. DEPLOY          │
              │  - Railway (API)    │
              │  - Vercel (Web)     │
              │  - Neon (DB)       │
              └─────────────────────┘
```

### 12.2 GitHub Actions Workflows

#### 1. Lint Workflow (`.github/workflows/lint.yml`)

```yaml
name: Lint

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: ESLint
        run: npm run lint

      - name: Prettier Check
        run: npm run format:check
```

#### 2. Type Check Workflow (`.github/workflows/type-check.yml`)

```yaml
name: Type Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  typecheck:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - name: TypeScript Check
        run: npx tsc --noEmit
```

#### 3. Test Workflow (`.github/workflows/test.yml`)

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: brainify
          POSTGRES_PASSWORD: brainify_test
          POSTGRES_DB: brainify_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgres://brainify:brainify_test@localhost:5432/brainify_test

      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: postgres://brainify:brainify_test@localhost:5432/brainify_test
          REDIS_URL: redis://localhost:6379
          JWT_ACCESS_SECRET: test-access-secret
          JWT_REFRESH_SECRET: test-refresh-secret
```

#### 4. Build Workflow (`.github/workflows/build.yml`)

```yaml
name: Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - name: Build
        run: npm run build
```

#### 5. Docker Build Workflow (`.github/workflows/docker-build.yml`)

```yaml
name: Docker Build

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  docker:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: brainify/backend
          tags: |
            type=semver,pattern={{version}}
            type=ref,event=branch
            type=sha,format=short

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

#### 6. Security Scan Workflow (`.github/workflows/security-scan.yml`)

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Every Monday at 6 AM

jobs:
  trivy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

#### 7. Deploy Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy

on:
  push:
    branches: [main]

concurrency:
  group: production
  cancel-in-progress: false

jobs:
  deploy-backend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Deploy to Railway
        uses: railwayapp/actions/deploy@v2
        with:
          service: brainify-api
          projectId: ${{ secrets.RAILWAY_PROJECT_ID }}
          token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 12.3 Branch Protection Rules

```
Branch: main
───────────────────────────────────
✔ Require pull request before merging
  - Required approvals: 1
  - Dismiss stale reviews: yes
✔ Require status checks
  - Lint (required)
  - Type Check (required)
  - Test (required)
  - Build (required)
  - Security Scan (required)
✔ Require branches to be up to date
✔ Do not allow bypassing
✔ Linear history
```

---

## 13. Deployment Architecture

### 13.1 Service Distribution

```
┌──────────────────────────────────────────────────────────────────┐
│                        PRODUCTION ENVIRONMENT                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐   ┌──────────────────┐                    │
│  │     VERCEL        │   │     RAILWAY       │                    │
│  │   (Frontend)      │   │   (Backend)       │                    │
│  │                   │   │                   │                    │
│  │  Next.js 15 SSR   │   │  Express v5 API   │                    │
│  │  Static assets    │   │  TypeScript       │                    │
│  │  Edge functions   │   │  ESM Modules      │                    │
│  │  ISR for public   │   │  Health checks    │                    │
│  │  pages            │   │  Auto-scaling     │                    │
│  │                   │   │                   │                    │
│  │  URL: brainify.app│   │  URL: api.brainify.app               │
│  └────────┬─────────┘   └────────┬──────────┘                    │
│           │                      │                               │
│           │                      │                               │
│           └──────────┬───────────┘                               │
│                      │                                           │
│                      ▼                                           │
│  ┌────────────────────────────────────────────────────┐         │
│  │                    DATABASE LAYER                   │         │
│  │                                                     │         │
│  │  ┌──────────────────────┐  ┌──────────────────────┐│         │
│  │  │   NEON POSTGRESQL    │  │   UPSTASH REDIS      ││         │
│  │  │                      │  │                      ││         │
│  │  │  Serverless SQL      │  │  Serverless Cache    ││         │
│  │  │  Auto-scaling        │  │  Global replication  ││         │
│  │  │  Branch deployments  │  │  TLS encrypted       ││         │
│  │  │  Point-in-time       │  │  99.99% uptime      ││         │
│  │  │  recovery            │  │                      ││         │
│  │  └──────────────────────┘  └──────────────────────┘│         │
│  └────────────────────────────────────────────────────┘         │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │                 MONITORING LAYER                    │         │
│  │                                                     │         │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │         │
│  │  │  SENTRY  │  │  WINSTON │  │  RAILWAY LOGS    │ │         │
│  │  │  Errors  │  │  Logs    │  │  Infrastructure  │ │         │
│  │  │          │  │  JSON    │  │  Metrics         │ │         │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 13.2 Environment Configuration

```bash
# .env.example (root)

# === BACKEND ===
NODE_ENV=development

# Database
DATABASE_URL=postgres://brainify:brainify_dev@localhost:5432/brainify

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# AI
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
AI_PROVIDER=gemini  # gemini | openai

# Security
ARCJET_KEY=your-arcjet-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=debug

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# === FRONTEND ===
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 13.3 Environment-Specific Configs

```typescript
// config/env.ts
//
// Zod schema validates all required env vars at startup.
// Each environment (development, staging, production) has different
// validation rules (some optional in dev, required in prod).

const envSchema = z.object({
  // Required in all environments
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().url(),

  // Optional in development, required in production
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ARCJET_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),

  // Defaults
  PORT: z.coerce.number().default(8080),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  AI_PROVIDER: z.enum(['gemini', 'openai']).default('gemini'),
});

// Validate at startup. Process exits with error message if invalid.
```

### 13.4 Deployment Checklist

```markdown
# Production Deployment Checklist

## Pre-Deployment
- [ ] All CI/CD checks passing (lint, type-check, test, build)
- [ ] Database migrations reviewed and tested
- [ ] Environment variables configured in Railway
- [ ] Environment variables configured in Vercel
- [ ] Neon database created with proper SSL
- [ ] Upstash Redis instance created
- [ ] Arcjet key configured
- [ ] Sentry project created
- [ ] Domains configured (brainify.app, api.brainify.app)

## Deployment Steps
1. Merge PR to main → triggers CI/CD pipeline
2. Database migrations run automatically
3. Backend deploys to Railway
4. Frontend deploys to Vercel
5. Smoke tests pass
6. Monitoring dashboards confirm health

## Post-Deployment
- [ ] Verify health endpoint returns 200
- [ ] Verify sign-up flow end-to-end
- [ ] Verify sign-in flow end-to-end
- [ ] Verify AI chat endpoint functional
- [ ] Check Sentry for any new errors
- [ ] Verify Winston logs are being written
- [ ] Confirm CDN cache warming
- [ ] Run Lighthouse audit on frontend

## Rollback Plan
1. Railway: Rollback to previous deployment via dashboard
2. Vercel: Instant rollback via deployment history
3. Database: Restore from pre-deployment snapshot
4. Redis: Cache will repopulate automatically
```

---

## 14. Monitoring Architecture

### 14.1 Monitoring Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         MONITORING STACK                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────┐    ┌──────────────────────────────────┐ │
│  │     HEALTH CHECKS    │    │       STRUCTURED LOGGING         │ │
│  │                      │    │                                  │ │
│  │  • /health endpoint │    │  • Winston (application logs)    │ │
│  │  • Database ping    │    │  • Morgan (HTTP request logs)    │ │
│  │  • Redis ping       │    │  • JSON structured format        │ │
│  │  • AI provider ping │    │  • log levels (debug → error)    │ │
│  │  • Uptime tracking  │    │  • Colorized in development      │ │
│  └─────────────────────┘    └──────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────┐    ┌──────────────────────────────────┐ │
│  │    ERROR TRACKING    │    │       PERFORMANCE METRICS        │ │
│  │                      │    │                                  │ │
│  │  • Sentry            │    │  • Response time percentiles    │ │
│  │  • Error grouping    │    │  • Database query performance   │ │
│  │  • Source maps       │    │  • Redis operation latency      │ │
│  │  • User context      │    │  • AI provider latency          │ │
│  │  • Performance       │    │  • API throughput               │ │
│  │    monitoring        │    │  • Error rates by endpoint      │ │
│  └─────────────────────┘    └──────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    RAILWAY DASHBOARD                         │ │
│  │                                                              │ │
│  │  • CPU/Memory usage                                          │ │
│  │  • Request count and latency                                 │ │
│  │  • Active deployments                                        │ │
│  │  • Logs viewer (integrated)                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 14.2 Health Check Endpoint

```typescript
// GET /health
//
// Returns detailed health status of all services.
// Called by:
// - Docker health check (every 30s)
// - Railway health check
// - Uptime monitoring service (optional)

Response:
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 1234567,
    "timestamp": "2026-06-17T12:00:00.000Z",
    "version": "2.0.0",
    "services": {
      "database": {
        "status": "healthy",
        "responseTimeMs": 2,
        "connections": 5
      },
      "redis": {
        "status": "healthy",
        "responseTimeMs": 1,
        "memoryUsageMb": 12.5
      },
      "ai": {
        "status": "healthy",
        "provider": "gemini",
        "lastCheck": "2026-06-17T12:00:00.000Z"
      }
    }
  }
}
```

### 14.3 Sentry Integration

```typescript
// config/sentry.ts (optional, if SENTRY_DSN is provided)
//
// Sentry captures:
// - Unhandled exceptions
// - Unhandled promise rejections
// - 5xx server errors
// - Performance traces (API endpoints)
//
// User context attached to errors:
// - userId (if authenticated)
// - email
// - role
//
// Source maps uploaded during build:
// - Enables readable stack traces
// - Stripped in production binary
```

---

## 15. Logging Architecture

### 15.1 Winston Configuration

```typescript
// config/logger.ts
//
// Winston logger configuration:
//
// Transports:
// 1. Console (all environments)
//    - Colorized in development
//    - JSON in production
//    - Level: LOG_LEVEL env var (default: 'info')
//
// 2. File (production only)
//    - logs/error.log — error level only
//    - logs/combined.log — all levels
//    - Max size: 10MB per file
//    - Max files: 5 (rotation)
//    - JSON format
//
// Morgan stream piped into Winston:
//   morgan.token('user-id', (req) => req.user?.id || 'anonymous');
//
//   morgan(':method :url :status :response-time ms - :user-id', {
//     stream: { write: (msg) => logger.http(msg.trim()) }
//   });

// Log levels (npm levels):
//   error: 0  — Unhandled errors, database failures
//   warn:  1  — Rate limit warnings, deprecated API calls
//   info:  2  — Request start/end, user actions
//   http:  3  — Morgan HTTP request logs
//   debug: 4  — Query details, cache operations
```

### 15.2 Logging Standards

```typescript
// === STRUCTURED LOG FORMAT ===

// Successful request:
{
  "timestamp": "2026-06-17T12:00:00.000Z",
  "level": "info",
  "message": "User signed in successfully",
  "service": "auth",
  "userId": "550e8400-...",
  "email": "john@example.com",
  "ip": "192.168.1.1",
  "requestId": "req_abc123",
  "duration": 145
}

// Error:
{
  "timestamp": "2026-06-17T12:00:00.000Z",
  "level": "error",
  "message": "Database connection failed",
  "service": "database",
  "error": {
    "name": "ConnectionError",
    "message": "Connection refused",
    "stack": "..."
  },
  "requestId": "req_abc123",
  "userId": "550e8400-..."
}

// AI request:
{
  "timestamp": "2026-06-17T12:00:00.000Z",
  "level": "info",
  "message": "AI chat request completed",
  "service": "ai",
  "provider": "gemini",
  "model": "gemini-2.0-flash",
  "tokensUsed": 450,
  "tokensInput": 200,
  "tokensOutput": 250,
  "cacheHit": false,
  "latency": 1234,
  "userId": "550e8400-..."
}

// NEVER log:
// - Passwords (even hashed)
// - Full JWT tokens
// - Credit card numbers
// - Phone numbers
// - API keys or secrets
// - Database connection strings
```

### 15.3 Log Rotation Strategy

```yaml
# Production log rotation (managed by Docker or systemd):
#
# Docker logging:
#   driver: json-file
#   options:
#     max-size: '10m'
#     max-file: '3'
#
# Winston file transport:
#   filename: logs/error.log
#   maxsize: 10485760  # 10MB
#   maxFiles: 5
#   tailable: true
#
# Retention:
#   Local files: 7 days
#   Railway logs: 30 days (platform managed)
#   Sentry errors: 90 days
```

---

## 16. Developer Experience

### 16.1 NPM Scripts (Root `package.json`)

```json
{
  "name": "brainify",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "npm run dev -w apps/backend",
    "dev:frontend": "npm run dev -w apps/web",

    "start": "npm run start -w apps/backend",

    "build": "npm run build -w packages/shared && npm run build -w apps/backend && npm run build -w apps/web",

    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",

    "format": "prettier --write '**/*.{ts,tsx,json,md,yaml}'",
    "format:check": "prettier --check '**/*.{ts,tsx,json,md,yaml}'",

    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",

    "db:generate": "npm run db:generate -w apps/backend",
    "db:migrate": "npm run db:migrate -w apps/backend",
    "db:studio": "npm run db:studio -w apps/backend",
    "db:seed": "npm run db:seed -w apps/backend",
    "db:push": "npm run db:push -w apps/backend",

    "type-check": "tsc --noEmit",

    "prepare": "husky"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "turbo": "^2.0.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

### 16.2 Path Aliases

```typescript
// apps/backend/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@config/*": ["./src/config/*"],
      "@controllers/*": ["./src/controllers/*"],
      "@services/*": ["./src/services/*"],
      "@repositories/*": ["./src/repositories/*"],
      "@middleware/*": ["./src/middleware/*"],
      "@routes/*": ["./src/routes/*"],
      "@validations/*": ["./src/validations/*"],
      "@models/*": ["./src/models/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@constants/*": ["./src/constants/*"],
      "@shared/*": ["../../packages/shared/src/*"]
    }
  }
}
```

```typescript
// apps/web/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@lib/*": ["./src/lib/*"],
      "@providers/*": ["./src/providers/*"],
      "@services/*": ["./src/services/*"],
      "@store/*": ["./src/store/*"],
      "@types/*": ["./src/types/*"],
      "@shared/*": ["../../packages/shared/src/*"]
    }
  }
}
```

### 16.3 Pre-commit Hooks (Husky + lint-staged)

```json
// package.json (lint-staged config)
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yaml}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

---

## 17. Migration Strategy from V1

### 17.1 Migration Overview

```
V1 (Current)                    V2 (Target)
─────────────────────           ─────────────────────
MongoDB + Mongoose      →       PostgreSQL + Drizzle ORM
JavaScript (CommonJS)   →       TypeScript (ESM)
React + Vite            →       Next.js 15 App Router
React Router DOM        →       App Router (file-based)
Plain Tailwind          →       Tailwind + Shadcn UI
React Context (3)       →       Zustand + TanStack Query
Single JWT (7d)         →       Access + Refresh Tokens
localStorage token      →       HTTP-only cookies
No validation           →       Zod validation
No caching              →       Redis caching
console.log             →       Winston + Morgan
No tests                →       Vitest + Playwright
No Docker               →       Multi-stage Docker
No CI/CD                →       Full GitHub Actions
Gemini only             →       Multi-provider AI layer
Single collection       →       Normalized PostgreSQL
```

### 17.2 Migration Phases

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MIGRATION ROADMAP                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PHASE 1: FOUNDATION (Week 1)                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Initialize monorepo (Turborepo + workspaces)               │   │
│  │ • Setup TypeScript configs (base + per-app)                  │   │
│  │ • Configure ESLint + Prettier                                │   │
│  │ • Create shared package (types, validations, constants)      │   │
│  │ • Initialize Drizzle ORM with Neon PostgreSQL                │   │
│  │ • Implement initial schema (users table)                     │   │
│  │ • Create migration files                                     │   │
│  │ • Setup Docker + Docker Compose (dev environment)            │   │
│  │ • Configure environment validation (Zod)                     │   │
│  │ • Setup Winston logger + Morgan                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  PHASE 2: AUTHENTICATION (Week 2)                                    │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Implement Auth Controller + Service + Repository            │   │
│  │ • JWT access token (15 min) + refresh token (7 days)          │   │
│  │ • HTTP-only cookie management                                 │   │
│  │ • Token rotation + reuse detection                            │   │
│  │ • bcrypt password hashing                                     │   │
│  │ • Zod validation schemas (sign-up, sign-in)                   │   │
│  │ • RBAC middleware (user/admin roles)                          │   │
│  │ • Rate limiting (Redis-backed)                                │   │
│  │ • Auth middleware (authenticate + authorize)                  │   │
│  │ • Sign-up, sign-in, sign-out, refresh endpoints               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  PHASE 3: SECURITY (Week 2-3)                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Arcjet integration (bot detection, shield, SQLi/XSS)        │   │
│  │ • Helmet security headers                                     │   │
│  │ • CORS configuration                                          │   │
│  │ • Distributed rate limiting (Redis)                           │   │
│  │ • Input sanitization                                          │   │
│  │ • Error handling middleware                                   │   │
│  │ • Standardized API responses                                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  PHASE 4: PROFILE + ASSESSMENTS (Week 3)                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Profile controller + service + repository                   │   │
│  │ • VARK assessment service (scoring logic from V1)              │   │
│  │ • Brain dominance service (A/B scoring from V1)               │   │
│  │ • Store VARK/brain questions in DB (seed data)                │   │
│  │ • Assessment retake endpoint                                  │   │
│  │ • Study session logging                                      │   │
│  │ • Daily activity + streak tracking                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  PHASE 5: AI LAYER (Week 4)                                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Abstract AI provider interface                              │   │
│  │ • Gemini provider implementation                              │   │
│  │ • OpenAI provider implementation                              │   │
│  │ • Factory pattern for provider selection                       │   │
│  │ • Prompt template system (YAML templates)                     │   │
│  │ • VARK-adapted prompts (4 styles)                             │   │
│  │ • Study Buddy chat endpoint                                  │   │
│  │ • Smart Search (Wikipedia + AI)                               │   │
│  │ • All-styles compare endpoint                                 │   │
│  │ • AI response caching (Redis)                                 │   │
│  │ • Token counting + budgeting                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  PHASE 6: FRONTEND INITIALIZATION (Week 4-5)                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Next.js 15 App Router setup                                │   │
│  │ • Shadcn UI initialization + component generation             │   │
│  │ • Zustand stores (auth, UI, notifications)                   │   │
│  │ • TanStack Query setup                                       │   │
│  │ • API client with interceptors                               │   │
│  │ • Auth provider + auth guard component                       │   │
│  │ • Landing page (SSR)                                          │   │
│  │ • Login + Register pages                                      │   │
│  │ • Dashboard layout (sidebar + topbar)                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  PHASE 7: FRONTEND PAGES (Week 5-6)                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Dashboard page (stats, charts, radar)                      │   │
│  │ • VARK Quiz page (16 questions, multi-select)                │   │
│  │ • Brain Quiz page (21 A/B questions)                         │   │
│  │ • Results page (certificate + charts)                        │   │
│  │ • Analytics page (trends, metrics)                           │   │
│  │ • Profile page (settings + preferences)                      │   │
│  │ • Learn Hub page (VARK-specific resources)                   │   │
│  │ • Study Buddy page (AI chat interface)                       │   │
│  │ • Smart Search page (search + results)                       │   │
│  │ • Life Skills page (6 categories)                            │   │
│  │ • Error + loading + empty states                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  PHASE 8: DOCKER + CI/CD (Week 6)                                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Multi-stage Dockerfile (deps → builder → runner)           │   │
│  │ • Docker Compose dev (postgres + redis + app)               │   │
│  │ • Docker Compose prod (app with resource limits)             │   │
│  │ • GitHub Actions: Lint                                       │   │
│  │ • GitHub Actions: Type Check                                 │   │
│  │ • GitHub Actions: Test                                       │   │
│  │ • GitHub Actions: Build                                      │   │
│  │ • GitHub Actions: Docker Build                               │   │
│  │ • GitHub Actions: Security Scan                              │   │
│  │ • GitHub Actions: Deploy                                     │   │
│  │ • Husky pre-commit hooks                                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  PHASE 9: MONITORING + DEPLOYMENT (Week 6-7)                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Sentry error tracking                                      │   │
│  │ • Health check endpoint (detailed)                            │   │
│  │ • Railway deployment (backend)                                │   │
│  │ • Vercel deployment (frontend)                                │   │
│  │ • Neon PostgreSQL provisioning                                │   │
│  │ • Upstash Redis provisioning                                  │   │
│  │ • Domain configuration + SSL                                 │   │
│  │ • Production smoke tests                                      │   │
│  │ • Documentation updates                                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  PHASE 10: V1 DATA MIGRATION (Week 7)                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Export V1 MongoDB data (users, assessments, activity)      │   │
│  │ • Transform data to PostgreSQL schema                        │   │
│  │ • Import script with validation                              │   │
│  │ • Verify data integrity (counts, samples)                    │   │
│  │ • Decommission V1 backend                                   │   │
│  │ • Update DNS to new frontend                                 │   │
│  │ • Monitor for issues                                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 17.3 Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Data loss during migration | Low | Critical | Export + verify before import. Keep V1 running during migration. |
| Performance regression | Medium | High | Benchmark key endpoints (auth, AI, analytics) in staging before production. |
| Feature parity gaps | Medium | Medium | Feature inventory tracking per sprint. Acceptance criteria per endpoint. |
| AI provider API changes | Low | High | Abstracted provider layer. Fallback to secondary provider. |
| Redis unavailability | Low | Medium | Cache miss falls back to database without errors. Rate limiter falls back to memory. |
| Database downtime | Low | Critical | Neon automatic failover. Read replicas for read-heavy workloads. |
| Authentication migration | Medium | High | All existing users must reset password via "forgot password" flow. JWT secrets rotation. |

### 17.4 Data Migration Script Architecture

```typescript
// scripts/migrate-v1-data.ts
//
// One-time migration script:
//
// 1. Connect to V1 MongoDB
// 2. Read all users from User collection
// 3. For each user:
//    a. Transform to V2 schema:
//       - Map _id → id (UUID)
//       - Map password → password_hash (keep existing hash)
//       - Map varkPreference → assessment entry
//       - Map brainScore → assessment entry
//       - Map dailyActivity → activity entries
//    b. Insert into PostgreSQL via Drizzle
// 4. Verify counts match
// 5. Generate migration report
//
// Safety:
// - Idempotent (dry-run mode)
// - Batch processing (100 users at a time)
// - Progress logging
// - Rollback capability
```

### 17.5 V1 Feature Migration Priority

| Priority | Feature | Phase | Effort | V1 Code Source |
|----------|---------|-------|--------|----------------|
| **P0** | User Authentication | Phase 2 | Medium | routes/auth.js |
| **P0** | VARK Assessment (16Q) | Phase 4 | Medium | routes/assessment.js |
| **P0** | Brain Quiz (21Q) | Phase 4 | Medium | routes/assessment.js |
| **P0** | Study Buddy AI Chat | Phase 5 | High | routes/ai.js |
| **P0** | Smart Search | Phase 5 | High | routes/search.js |
| **P1** | Dashboard + Stats | Phase 7 | High | Dashboard.jsx |
| **P1** | Activity/Streak Tracking | Phase 4 | Medium | routes/profile.js |
| **P1** | Learning Analytics | Phase 7 | High | Analytics.jsx |
| **P1** | User Profile | Phase 4 | Low | routes/profile.js |
| **P2** | All-4-Style Compare | Phase 5 | Medium | routes/search.js |
| **P2** | Learn Hub | Phase 7 | Medium | LearnHub.jsx |
| **P2** | Life Skills Hub | Phase 7 | Medium | LifeSkills.jsx |
| **P2** | Results Page | Phase 7 | Low | Results.jsx |
| **P3** | Pomodoro Timer | Phase 7 | Low | PomodoroTimer.jsx |
| **P3** | Dark Mode | Phase 6 | Low | ThemeContext.jsx |
| **P3** | PWA Support | Phase 8 | Medium | vite.config.js |
| **P3** | Impact Page | Phase 7 | Low | ImpactPage.jsx |
| **P4** | Rule-based Chatbot | ❌ Remove | — | routes/chat.js |
| **P4** | In-memory Notifications | ❌ Remove | — | NotificationContext.jsx |

---

## Appendix A: Architecture Decision Records (ADRs)

| ADR | Decision | Rationale |
|-----|----------|-----------|
| **ADR-001** | PostgreSQL over MongoDB | Normalized schema, ACID compliance, better analytics queries, Neon serverless scaling. |
| **ADR-002** | Drizzle ORM over Prisma | Lighter, faster, better TypeScript integration, easier migration from raw SQL. |
| **ADR-003** | Express v5 over Fastify | Ecosystem maturity, middleware compatibility, simpler migration from V1. |
| **ADR-004** | HTTP-only cookies over localStorage | XSS mitigation, CSRF protection via SameSite, proper token lifecycle. |
| **ADR-005** | Multi-provider AI abstraction | Avoid vendor lock-in, fallback capability, competitive pricing leverage. |
| **ADR-006** | Turborepo over Nx | Simpler configuration, faster for monorepo of this size, better Vite/Next.js integration. |
| **ADR-007** | TanStack Query over SWR | Better TypeScript support, more mature caching, optimistic updates for future features. |
| **ADR-008** | Zustand over Redux | Simpler API, less boilerplate, sufficient for app complexity, good TypeScript support. |
| **ADR-009** | Railway over Heroku | Better DX, integrated databases, simpler deployment, better pricing for Node.js. |
| **ADR-010** | Neon over traditional PostgreSQL | Serverless scaling (pay per use), branching for preview deploys, managed backups. |

---

## Appendix B: Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | ✅ | — | `development`, `staging`, `production` |
| `PORT` | ❌ | `8080` | Backend server port |
| `DATABASE_URL` | ✅ | — | Neon PostgreSQL connection string |
| `REDIS_URL` | ✅ | — | Upstash Redis connection string |
| `JWT_ACCESS_SECRET` | ✅ | — | JWT signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | ✅ | — | Refresh token signing secret (min 32 chars) |
| `FRONTEND_URL` | ✅ | — | Frontend URL for CORS |
| `GEMINI_API_KEY` | ✅* | — | Google Gemini API key |
| `OPENAI_API_KEY` | ❌ | — | OpenAI API key (fallback) |
| `AI_PROVIDER` | ❌ | `gemini` | Default AI provider |
| `ARCJET_KEY` | ✅* | — | Arcjet API key |
| `SENTRY_DSN` | ❌ | — | Sentry error tracking DSN |
| `LOG_LEVEL` | ❌ | `info` | Winston log level |

*Required in production, optional in development.

---

## Appendix C: NPM Package Versions

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15.0.0 | Frontend framework |
| `react` | ^19.0.0 | UI library |
| `express` | ^5.0.0 | Backend framework |
| `typescript` | ^5.5.0 | Language |
| `drizzle-orm` | ^0.35.0 | ORM |
| `drizzle-kit` | ^0.28.0 | Migration tooling |
| `@neondatabase/serverless` | ^0.10.0 | Neon database driver |
| `@upstash/redis` | ^1.34.0 | Redis client |
| `@arcjet/node` | ^1.0.0 | Security |
| `zod` | ^4.0.0 | Validation |
| `winston` | ^3.14.0 | Logging |
| `morgan` | ^1.10.0 | HTTP logging |
| `@sentry/node` | ^8.0.0 | Error tracking |
| `jsonwebtoken` | ^9.0.0 | JWT |
| `bcryptjs` | ^2.4.0 | Password hashing |
| `helmet` | ^8.0.0 | Security headers |
| `cookie-parser` | ^1.4.0 | Cookie parsing |
| `turbo` | ^2.0.0 | Monorepo tooling |
| `vitest` | ^2.0.0 | Testing |
| `husky` | ^9.0.0 | Git hooks |
| `tailwindcss` | ^3.4.0 | CSS framework |
| `@radix-ui/*` | ^1.0.0 | Headless UI primitives |
| `zustand` | ^5.0.0 | State management |
| `@tanstack/react-query` | ^5.0.0 | Server state |
| `recharts` | ^2.12.0 | Charts |

---

*This document represents the complete production-grade architecture for Brainify v2. Implementation should follow the 10-phase migration plan, with each phase producing deployable, tested increments.*