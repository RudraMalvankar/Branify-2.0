# Brainify v2 — Solo Developer MVP Architecture

> **Document Version:** 1.1.0  
> **Date:** June 17, 2026  
> **Status:** Ready for Implementation  
> **Target:** Solo Developer, 4–6 week delivery

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
10. [Docker Architecture](#10-docker-architecture)
11. [CI/CD Architecture](#11-cicd-architecture)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Logging Architecture](#13-logging-architecture)
14. [Developer Experience](#14-developer-experience)
15. [Migration Strategy from V1](#15-migration-strategy-from-v1)

---

## 1. System Architecture

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER DEVICES                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐                   │
│  │   Web    │  │  Mobile  │  │   PWA     │                   │
│  │ Browser  │  │  (iOS)   │  │ (Android) │                   │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘                   │
│       │             │              │                           │
└───────┼─────────────┼──────────────┼───────────────────────────┘
        │             │              │
        │     ┌───────┴──────────────┴───────┐
        │     │       VERCEL (CDN)            │
        │     │   ┌──────────────────────┐    │
        │     │   │  Next.js 15 App      │    │
        │     │   │  Router · SSR        │    │
        │     │   └──────────────────────┘    │
        │     └───────────────┬───────────────┘
        │                     │ HTTPS
        │           ┌─────────▼──────────┐
        │           │  RAILWAY (Backend)  │
        │           │ ┌────────────────┐  │
        │           │ │ Express v5     │  │
        │           │ │ TypeScript     │  │
        │           │ │ ESM Modules    │  │
        │           │ └───────┬────────┘  │
        │           └─────────┼───────────┘
        │                     │
        │           ┌─────────▼──────────┐
        │           │      NEON          │
        │           │   PostgreSQL       │
        │           │   + Drizzle ORM    │
        │           └────────────────────┘
        │
        │           ┌──────────────────────────┐
        │           │   Gemini 2.0 Flash API   │
        │           │   (Google AI)            │
        │           └──────────────────────────┘
        │
        │           ┌──────────────────────────┐
        │           │   Wikipedia REST API     │
        │           └──────────────────────────┘
```

### 1.2 Request Lifecycle (MVP)

```
CLIENT
  │
  ▼
VERCEL EDGE NETWORK (CDN + static assets)
  │
  └── API requests → Railway (Express v5 Backend)
       │
       ├── Helmet Middleware (security headers)
       ├── CORS Middleware
       ├── Rate Limiter (in-memory, single-instance)
       ├── Auth Middleware (JWT from HTTP-only cookie)
       │
       ▼
ROUTE → CONTROLLER (Zod validation)
  │
  ▼
SERVICE (business logic)
  │
  ▼
REPOSITORY (database queries via Drizzle ORM)
  │
  ▼
DATABASE (Neon PostgreSQL)
  │
  ▼
RESPONSE ← structured JSON ← error handling middleware
```

### 1.3 Architecture Principles (MVP)

| Principle | Implementation |
|-----------|---------------|
| **Separation of Concerns** | Route → Controller → Service → Repository |
| **Type Safety** | TypeScript strict mode everywhere |
| **Validation First** | Every endpoint validates via Zod |
| **Defense in Depth** | Helmet + CORS + Rate Limiting + Input Validation |
| **Observability** | Winston + Morgan logging |
| **Fail Fast** | Validate config at startup, crash if critical env vars missing |
| **Iterative Delivery** | Ship working features first, add complexity later |

### 1.4 Phase 1 Exclusions (Post-MVP)

| Feature | When | Why |
|---------|------|-----|
| Redis / Upstash | Phase 8+ | Not needed at low scale |
| Arcjet | Phase 9+ | Helmet + rate limiting sufficient for MVP |
| Sentry | Phase 9+ | Winston logs sufficient initially |
| BullMQ / Job Queues | Post-MVP | No async jobs needed yet |
| Advanced Monitoring | Post-MVP | Railway dashboard sufficient |
| Multi-Provider AI | Post-MVP | Gemini only for MVP |

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
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.dev.yml
│   └── .dockerignore
│
├── scripts/
│   └── dev.sh
│
├── .github/
│   └── workflows/
│       ├── lint.yml
│       ├── type-check.yml
│       ├── test.yml
│       ├── build.yml
│       └── deploy.yml
│
├── docs/
│   └── architecture/
│       ├── project-analysis.md
│       └── v2-architecture.md
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
│   ├── database.ts              # Drizzle + Neon config
│   ├── logger.ts                # Winston logger configuration
│   └── cors.ts                  # CORS configuration
│
├── controllers/
│   ├── auth.controller.ts       # Sign-up, sign-in, sign-out, refresh
│   ├── profile.controller.ts    # Get/update profile
│   ├── assessment.controller.ts # VARK, Brain, retake
│   ├── ai.controller.ts         # Study Buddy chat
│   ├── search.controller.ts     # Smart Search, All-styles
│   ├── analytics.controller.ts  # Dashboard analytics
│   └── sessions.controller.ts   # Study session logging
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
│   │   ├── gemini.service.ts    # Gemini provider (direct)
│   │   ├── prompt.service.ts    # Prompt template management
│   │   ├── chat.service.ts      # Study Buddy orchestration
│   │   └── search.service.ts    # Wikipedia + AI search
│   ├── profile.service.ts       # Profile management
│   ├── analytics.service.ts     # Analytics aggregation
│   └── sessions.service.ts      # Study session tracking
│
├── repositories/
│   ├── user.repository.ts
│   ├── assessment.repository.ts
│   ├── session.repository.ts
│   └── token.repository.ts
│
├── routes/
│   ├── index.ts                 # Route aggregator
│   ├── auth.routes.ts           # /api/auth/*
│   ├── profile.routes.ts        # /api/profile/*
│   ├── assessment.routes.ts     # /api/assessment/*
│   ├── ai.routes.ts             # /api/ai/*
│   ├── search.routes.ts         # /api/search/*
│   ├── analytics.routes.ts      # /api/analytics/*
│   └── sessions.routes.ts       # /api/sessions/*
│
├── middleware/
│   ├── auth.middleware.ts       # JWT verification, role check
│   ├── error.middleware.ts      # Global error handler
│   ├── validate.middleware.ts   # Zod validation middleware
│   ├── rate-limit.middleware.ts # In-memory rate limiting
│   └── not-found.middleware.ts  # 404 handler
│
├── validations/
│   ├── auth.validation.ts       # Sign-up, sign-in schemas
│   ├── profile.validation.ts    # Profile update schemas
│   ├── assessment.validation.ts # VARK, brain answer schemas
│   ├── search.validation.ts     # Search query schemas
│   └── ai.validation.ts         # Chat message schemas
│
├── models/
│   ├── schema/
│   │   ├── users.ts             # Users table
│   │   ├── profiles.ts          # Profiles table
│   │   ├── assessments.ts       # Assessments table
│   │   ├── study-sessions.ts    # Study sessions
│   │   ├── ai-conversations.ts  # AI conversations
│   │   └── refresh-tokens.ts    # Refresh tokens
│   ├── relations.ts             # Drizzle table relations
│   └── index.ts                 # Schema barrel export
│
├── utils/
│   ├── response.ts              # Standardized response helpers
│   ├── sanitize.ts              # XSS sanitization
│   └── constants.ts             # App-wide constants
│
├── app.ts                       # Express app setup
└── server.ts                    # Server entry point
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
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard layout
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
│   ├── not-found.tsx
│   └── error.tsx
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
│   │   └── mobile-nav.tsx
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
│   │   └── register-form.tsx
│   └── shared/
│       ├── loading-spinner.tsx
│       ├── error-state.tsx
│       └── empty-state.tsx
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-theme.ts
│   ├── use-debounce.ts
│   └── use-media-query.ts
│
├── lib/
│   ├── api-client.ts             # Fetch wrapper with interceptors
│   ├── utils.ts
│   └── constants.ts
│
├── providers/
│   ├── auth-provider.tsx
│   ├── theme-provider.tsx
│   └── query-provider.tsx
│
├── services/
│   ├── auth.service.ts
│   ├── profile.service.ts
│   ├── assessment.service.ts
│   ├── ai.service.ts
│   ├── search.service.ts
│   └── analytics.service.ts
│
├── store/
│   ├── auth.store.ts             # Zustand auth store
│   └── ui.store.ts               # UI state
│
├── types/
│   ├── api.ts
│   ├── auth.ts
│   ├── assessment.ts
│   ├── ai.ts
│   └── user.ts
│
└── styles/
    ├── globals.css
    └── shadcn.css
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
│   │   └── search.ts
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
┌──────────────────────────────────────────────┐
│              MIDDLEWARE STACK                  │
│                                                │
│  1. Helmet        → Security headers          │
│  2. CORS          → Cross-origin handling      │
│  3. CookieParser  → Parse HTTP-only cookies   │
│  4. Morgan        → HTTP request logging       │
│  5. Express JSON  → Body parsing               │
│  6. Rate Limiter  → In-memory rate limits     │
│                                                │
└──────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────┐
│               ROUTE LAYER                      │
│                                                │
│  Routes ONLY define:                           │
│  - HTTP method + path                          │
│  - Middleware to apply (auth, validation)       │
│  - Controller function to call                 │
│                                                │
└──────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────┐
│               CONTROLLER LAYER                 │
│                                                │
│  Controllers ONLY:                             │
│  - Extract data from req                       │
│  - Call service methods                        │
│  - Send standardized response                  │
│  NO business logic                             │
│  NO database queries                           │
│                                                │
└──────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────┐
│                SERVICE LAYER                   │
│                                                │
│  Services ONLY:                                │
│  - Business logic                              │
│  - Orchestration of repositories               │
│  - External API calls (Wikipedia, Gemini)     │
│                                                │
└──────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────┐
│               REPOSITORY LAYER                 │
│                                                │
│  Repositories ONLY:                            │
│  - Database queries via Drizzle ORM            │
│  - Return typed results                        │
│                                                │
└──────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────┐
│              ERROR HANDLING                    │
│                                                │
│  Custom AppError class:                        │
│  - statusCode, message, code, details          │
│  Global error handler logs via Winston         │
│                                                │
└──────────────────────────────────────────────┘
```

### 3.2 Error Handling Strategy

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
// - Returns standardized JSON response
```

### 3.3 Server Configuration (`server.ts`)

```typescript
// Server entry point responsibilities:
//
// 1. Validate environment variables (Zod schema)
// 2. Initialize PostgreSQL connection (Drizzle)
// 3. Create Express app with all middleware
// 4. Register all routes
// 5. Start HTTP server
// 6. Register graceful shutdown handlers:
//    - SIGTERM → close server, disconnect DB
//    - SIGINT  → same as SIGTERM
//    - uncaughtException → log, exit(1)
//    - unhandledRejection → log, exit(1)
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
4. Access token read from HTTP-only cookie
    │   (automatic with credentials: 'include')
    │
    ├── Token valid → proceed with request
    │
    └── Token expired
         │
         ├── Call POST /api/auth/refresh
         │
         ├── Success → retry original request
         │
         └── Failed → redirect to /login
```

### 4.3 State Management Strategy

| State Type | Technology | Examples |
|-----------|-----------|----------|
| **Server State** | TanStack Query | User profile, assessments, analytics |
| **Auth State** | Zustand | Current user, login/logout actions |
| **UI State** | Zustand | Sidebar state, theme mode |
| **Form State** | React Hook Form + Zod | Login, register, profile forms |

### 4.4 API Client Architecture

```typescript
// services/api-client.ts
//
// Features:
// - Base URL from NEXT_PUBLIC_API_URL
// - credentials: 'include' for HTTP-only cookies
// - Response interceptor:
//   - 401 → attempt refresh via /api/auth/refresh
//   - Refresh succeeds → retry original request
//   - Refresh fails → redirect to /login, clear auth store
// - Error normalization
// - Retry: exponential backoff for 5xx (max 3 retries)
// - AbortController support
```

---

## 5. Database Architecture

### 5.1 Entity Relationship Diagram (MVP)

```
┌───────────────────┐
│      USERS        │
├───────────────────┤
│ id          UUID  │
│ name        VARCHAR│
│ email      VARCHAR│←┐ UNIQUE
│ password_hash VARCHAR│
│ role        VARCHAR│ (user, admin)
│ is_active  BOOLEAN│
│ created_at TIMESTAMP│
│ updated_at TIMESTAMP│
└────────┬──────────┘
         │ 1
         │
┌────────▼──────────┐  ┌──────────────────────┐
│     PROFILES      │  │   REFRESH_TOKENS     │
├───────────────────┤  ├──────────────────────┤
│ id          UUID  │  │ id             UUID  │
│ user_id     UUID  │→ │ user_id        UUID  │→
│ bio          TEXT │  │ token_hash   VARCHAR │
│ avatar_url VARCHAR│  │ expires_at  TIMESTAMP│
│ timezone   VARCHAR│  │ is_revoked  BOOLEAN  │
│ created_at TIMESTAMP│  │ created_at TIMESTAMP│
└───────────────────┘  └──────────────────────┘
         │ 1
         │
┌────────▼──────────┐
│   ASSESSMENTS     │
├───────────────────┤
│ id          UUID  │
│ user_id     UUID  │→
│ type        VARCHAR│ (vark, brain)
│ scores       JSONB│
│ result     VARCHAR│
│ note         TEXT │
│ created_at TIMESTAMP│
└───────────────────┘
         │ 1
         │
┌────────▼──────────┐
│  STUDY_SESSIONS   │
├───────────────────┤
│ id          UUID  │
│ user_id     UUID  │→
│ type        VARCHAR│ (pomodoro, manual, auto)
│ duration_mins INT │
│ started_at TIMESTAMP│
│ created_at TIMESTAMP│
└───────────────────┘

┌───────────────────┐
│ AI_CONVERSATIONS  │
├───────────────────┤
│ id          UUID  │
│ user_id     UUID  │→
│ title      VARCHAR│
│ style      VARCHAR│ (vark style)
│ message_cnt INT  │
│ created_at TIMESTAMP│
│ updated_at TIMESTAMP│
└───────────────────┘
         │ 1
         │
┌────────▼──────────┐
│   AI_MESSAGES     │
├───────────────────┤
│ id          UUID  │
│ conv_id     UUID  │→
│ role       VARCHAR│ (user, assistant)
│ content      TEXT │
│ created_at TIMESTAMP│
└───────────────────┘
```

### 5.2 Drizzle Schema Definitions (6 Tables)

```typescript
// models/schema/users.ts
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  // VARK Scores (denormalized for fast reads — assessment history in assessments table)
  visual: varchar('visual', { length: 50 }).default('0').notNull(),
  aural: varchar('aural', { length: 50 }).default('0').notNull(),
  readWrite: varchar('read_write', { length: 50 }).default('0').notNull(),
  kinesthetic: varchar('kinesthetic', { length: 50 }).default('0').notNull(),
  varkPreference: varchar('vark_preference', { length: 50 }).default('').notNull(),
  varkNote: text('vark_note').default('').notNull(),
  // Brain Scores
  brainScore: varchar('brain_score', { length: 50 }).default('0').notNull(),
  brainType: varchar('brain_type', { length: 50 }).default('').notNull(),
  brainNote: text('brain_note').default('').notNull(),
  // Activity (denormalized for fast reads)
  totalSessions: integer('total_sessions').default(0).notNull(),
  streakDays: integer('streak_days').default(0).notNull(),
  lastActive: timestamp('last_active'),
  // Meta
  role: varchar('role', { length: 20 }).notNull().default('user'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

All 6 table schemas follow this pattern. Key design notes:

- **users table** includes denormalized VARK/brain scores for fast profile reads (assessment history is in assessments table)
- **profiles table** extends users with bio, avatar, timezone
- **assessments** stores each attempt as a row with JSONB scores
- **study_sessions** stores individual learning sessions
- **ai_conversations + ai_messages** store chat history with Gemini
- **refresh_tokens** enables token rotation and revocation

### 5.3 Index Strategy (13 indexes)

```sql
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at) WHERE is_revoked = false;
CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_type ON assessments(type);
CREATE INDEX idx_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_sessions_started ON study_sessions(started_at);
CREATE INDEX idx_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_conversations_updated ON ai_conversations(updated_at);
CREATE INDEX idx_messages_conversation ON ai_messages(conv_id);
```

### 5.4 Migration Strategy

```bash
# Drizzle Kit commands:
npm run db:generate    # Generate migration files from schema changes
npm run db:migrate     # Apply migrations to database
npm run db:studio      # Open Drizzle Studio GUI

# Migration workflow:
# 1. Modify schema files in models/schema/
# 2. Run `npm run db:generate` → creates migration in drizzle/migrations/
# 3. Review migration SQL
# 4. Run `npm run db:migrate` → applies to Neon PostgreSQL
# 5. Commit migration files

# Production: Migrations run automatically during CI/CD deploy
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

### 6.2 Endpoints

```
POST /api/auth/sign-up     → Register (name, email, password) → 201 + Set-Cookie
POST /api/auth/sign-in     → Login (email, password) → 200 + Set-Cookie
POST /api/auth/sign-out    → Logout (clear cookies, revoke token) → 200
POST /api/auth/refresh     → Refresh tokens (token rotation) → 200 + Set-Cookie
```

### 6.3 Security Practices

| Practice | Implementation |
|----------|---------------|
| Password hashing | bcrypt with 10 salt rounds |
| Token expiry | Access: 15 min, Refresh: 7 days |
| Token rotation | New refresh token on every refresh |
| Reuse detection | Revoked token used → revoke ALL user tokens |
| Cookie security | httpOnly + secure + sameSite=strict |
| Path restriction | Refresh cookie only on /api/auth/* |

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

// === ERROR RESPONSE ===
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format", "code": "invalid_string" }
  ]
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
      "totalPages": 8
    }
  }
}
```

### 7.2 Core Endpoints (MVP)

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| POST | /api/auth/sign-up | ❌ | 5/min | Create account |
| POST | /api/auth/sign-in | ❌ | 5/min per email | Login |
| POST | /api/auth/sign-out | ✅ | 10/min | Logout |
| POST | /api/auth/refresh | ❌ | 10/min | Refresh tokens |
| GET | /api/profile/me | ✅ | 10/min | Get profile |
| PUT | /api/profile/me | ✅ | 10/min | Update profile |
| POST | /api/assessment/vark | ✅ | 10/min | Submit VARK answers |
| POST | /api/assessment/brain | ✅ | 10/min | Submit brain answers |
| POST | /api/assessment/retake | ✅ | 5/min | Reset assessments |
| POST | /api/sessions/log | ✅ | 10/min | Log study session |
| GET | /api/analytics/dashboard | ✅ | 10/min | Dashboard stats |
| POST | /api/ai/chat | ✅ | 15/min | Study Buddy chat |
| POST | /api/search/query | ✅ | 15/min | Smart Search |
| POST | /api/search/all-styles | ✅ | 15/min | All 4 styles compare |
| GET | /api/health | ❌ | 10/min | Health check |

---

## 8. Security Architecture (MVP)

### 8.1 Defense in Depth (Phase 1)

```
LAYER 1: HTTP SECURITY HEADERS
───────────────────────────────────
  Helmet
  - Content-Security-Policy
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Strict-Transport-Security
  - Referrer-Policy
  - Permissions-Policy

LAYER 2: AUTHENTICATION
───────────────────────────────────
  HTTP-only Cookies
  - Access token: 15 min lifespan
  - Refresh token: 7 day lifespan
  - SameSite=Strict prevents CSRF

  JWT Verification
  - Every protected route verifies access token
  - Token rotation on refresh

LAYER 3: INPUT VALIDATION
───────────────────────────────────
  Zod Schemas
  - Every endpoint validates input
  - Type coercion and sanitization

  XSS Sanitization
  - Strip script/iframe/object tags
  - Sanitize before dangerouslySetInnerHTML

LAYER 4: RATE LIMITING
───────────────────────────────────
  In-Memory Rate Limiting (single instance)
  - User:  10 requests per minute
  - Guest:  5 requests per minute
  - Auth:   5 attempts per email per minute
  - AI:     15 requests per minute

LAYER 5: DATABASE SECURITY
───────────────────────────────────
  Drizzle ORM
  - Parameterized queries (no SQL injection)
  - Type-safe schema
```

### 8.2 Phase 2 Security (Post-MVP)

| Feature | Phase | Purpose |
|---------|-------|---------|
| Arcjet | 9 | Bot detection, advanced SQLi/XSS shield |
| Redis rate limiting | 8 | Distributed rate limiting |
| Sentry | 9 | Error tracking |

### 8.3 Rate Limiting Strategy (MVP)

```typescript
// middleware/rate-limit.middleware.ts
//
// In-memory rate limiting (sufficient for single-instance deployment):
//
// ┌──────────┬───────────────┬──────────────────┐
// │ Tier     │ Requests/min  │ Applied To        │
// ├──────────┼───────────────┼──────────────────┤
// │ user     │ 10            │ Authenticated     │
// ├──────────┼───────────────┼──────────────────┤
// │ guest    │ 5             │ Unauthenticated   │
// ├──────────┼───────────────┼──────────────────┤
// │ auth     │ 5/email/min   │ Login attempts    │
// ├──────────┼───────────────┼──────────────────┤
// │ ai       │ 15            │ AI endpoints      │
// └──────────┴───────────────┴──────────────────┘
//
// Upgrade path: Replace with Redis-backed limiter in Phase 8
// when scaling to multiple instances.
```

---

## 9. AI Architecture

### 9.1 AI Service Layer (Gemini Only)

```
┌──────────────────────────────────────┐
│           AI CONTROLLER               │
│  (Validates input, calls service)     │
└───────────────┬──────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│           CHAT SERVICE                │
│  (Study Buddy orchestration)          │
│  - Builds VARK-adapted prompt         │
│  - Manages conversation history       │
│  - Calls gemini.service               │
│  - Stores messages to DB              │
└───────────────┬──────────────────────┘
                │
                ├──────────────────────┐
                ▼                      ▼
┌─────────────────────┐   ┌─────────────────────┐
│   GEMINI SERVICE     │   │   SEARCH SERVICE    │
│   (gemini-2.0-flash) │   │   (Wikipedia + AI)  │
│                      │   │                     │
│   - Direct API call  │   │ - Fetch Wikipedia   │
│   - Streaming ready  │   │ - Gemini reformat   │
│   - Error handling   │   │ - All-styles mode   │
└─────────────────────┘   └─────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│         PROMPT SERVICE                │
│  (Prompt template management)         │
│                                       │
│  - VARK-adapted system prompts (4)    │
│  - Context window management          │
│  - Style-specific instructions        │
└──────────────────────────────────────┘
```

### 9.2 Service Responsibilities

```typescript
// services/ai/gemini.service.ts
//
// Responsibilities:
// - Initialize Gemini client with API key
// - Send chat request to Gemini 2.0 Flash
// - Return parsed response
// - Handle API errors gracefully
// - Support streaming (optional)
//
// Key design decisions:
// - NO provider abstraction layer (Gemini only)
// - NO factory pattern
// - Direct service-to-API calls
// - Designed for future extensibility:
//   If OpenAI is needed later, add openai.service.ts
//   and switch in chat.service.ts

// services/ai/prompt.service.ts
//
// Responsibilities:
// - Build VARK-adapted system prompt
// - Manage conversation context (last 8 messages)
// - Inject user style information
// - Strip sensitive content
//
// VARK System Prompts:
//   Visual:      "Use diagrams in words, spatial analogies, tables"
//   Auditory:    "Conversational, mnemonics, verbal analogies"
//   Read/Write:  "Definitions, lists, summaries, bullet points"
//   Kinesthetic: "Real-world examples, step-by-step, action verbs"

// services/ai/chat.service.ts
//
// Responsibilities:
// - Receive user message + conversation history
// - Build prompt via prompt.service
// - Call gemini.service
// - Store user message + AI response in DB
// - Return formatted response
//
// services/ai/search.service.ts
//
// Responsibilities:
// - Query Wikipedia REST API
// - Build search context from Wikipedia extract
// - Call Gemini to reformat in user's VARK style
// - "All Styles" mode: 4 parallel Gemini calls
// - Return structured search results
```

### 9.3 Future Extensibility (No Code Yet)

```
// When adding a second AI provider in future:
//
// 1. Create openai.service.ts (same interface pattern)
// 2. Update chat.service.ts to use new provider
// 3. No factory, no abstraction layer needed
//
// Keep it simple. Add complexity only when required.
```

---

## 10. Docker Architecture

### 10.1 Multi-Stage Dockerfile

```dockerfile
# docker/Dockerfile

# ──────────────────────────────────────
# STAGE 1: Install dependencies
# ──────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

RUN npm ci --include=dev

# ──────────────────────────────────────
# STAGE 2: Build
# ──────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ──────────────────────────────────────
# STAGE 3: Production
# ──────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/packages ./packages

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', r => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "apps/backend/dist/server.js"]
```

### 10.2 Development Docker Compose

```yaml
# docker/docker-compose.dev.yml
#
# Provides local PostgreSQL for development.
# Redis NOT included in MVP — added in Phase 8.

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

volumes:
  postgres_data:
```

### 10.3 .dockerignore

```
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
logs
*.log
.npm
.eslintcache
.prettiercache
turbo
```

### 10.4 Development Scripts

```bash
# scripts/dev.sh
#!/bin/bash
set -e

echo "🚀 Starting Brainify development environment..."

# Start infrastructure
echo "📦 Starting PostgreSQL..."
docker compose -f docker/docker-compose.dev.yml up -d postgres

# Wait for services
sleep 3

# Run migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

# Seed data
echo "🌱 Seeding development data..."
npm run db:seed

# Start dev servers
echo "🖥️  Starting dev servers (backend:8080 + frontend:3000)..."
npm run dev
```

---

## 11. CI/CD Architecture

### 11.1 CI/CD Pipeline Overview

```
PUSH / PR to main
        │
        ▼
┌─────────────────────┐
│  1. LINT & FORMAT   │
│  ESLint + Prettier  │
└──────────┬──────────┘
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
│  5. DEPLOY          │
│  Railway (API)      │
│  Vercel (Web)       │
└─────────────────────┘
```

### 11.2 GitHub Actions Workflows (5 total)

#### Lint (`.github/workflows/lint.yml`)

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

#### Type Check (`.github/workflows/type-check.yml`)

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

#### Test (`.github/workflows/test.yml`)

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
          JWT_ACCESS_SECRET: test-access-secret
          JWT_REFRESH_SECRET: test-refresh-secret
```

#### Build (`.github/workflows/build.yml`)

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

#### Deploy (`.github/workflows/deploy.yml`)

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

---

## 12. Deployment Architecture

### 12.1 Service Distribution

```
┌──────────────────────────────────────────────────┐
│                  PRODUCTION ENVIRONMENT            │
├──────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────┐   ┌──────────────────┐      │
│  │     VERCEL        │   │     RAILWAY       │      │
│  │   (Frontend)      │   │   (Backend)       │      │
│  │                    │   │                   │      │
│  │  Next.js 15 SSR    │   │  Express v5 API   │      │
│  │  Static assets     │   │  TypeScript       │      │
│  │  CDN caching       │   │  Health checks    │      │
│  │                    │   │  Auto-scaling     │      │
│  │  URL: brainify.app │   │  URL: api.brainify.app ││
│  └────────┬─────────┘   └────────┬──────────┘      │
│           │                      │                  │
│           └──────────┬───────────┘                  │
│                      │                               │
│                      ▼                               │
│  ┌──────────────────────────────────────┐           │
│  │            NEON POSTGRESQL            │           │
│  │                                        │           │
│  │  Serverless SQL · Auto-scaling        │           │
│  │  Branch deployments · TLS encrypted    │           │
│  │  Point-in-time recovery               │           │
│  └──────────────────────────────────────┘           │
│                                                    │
└──────────────────────────────────────────────────┘
```

### 12.2 Environment Variables (MVP)

```bash
# .env.example

# === BACKEND ===
NODE_ENV=development

# Database
DATABASE_URL=postgres://brainify:brainify_dev@localhost:5432/brainify

# Auth
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# AI (Gemini only for MVP)
GEMINI_API_KEY=your-gemini-api-key

# Server
PORT=8080
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug

# === FRONTEND ===
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 12.3 Production Deployment Checklist

```markdown
# Production Deployment Checklist (MVP)

## Pre-Deployment
- [ ] All CI/CD checks passing (lint, type-check, test, build)
- [ ] Database migrations reviewed and tested
- [ ] Environment variables configured in Railway
- [ ] Environment variables configured in Vercel
- [ ] Neon database created with proper SSL
- [ ] Domains configured (brainify.app, api.brainify.app)

## Deployment Steps
1. Merge PR to main → triggers CI/CD pipeline
2. Database migrations run automatically
3. Backend deploys to Railway
4. Frontend deploys to Vercel
5. Smoke tests pass

## Post-Deployment
- [ ] Health endpoint returns 200
- [ ] Sign-up → sign-in → dashboard flow works
- [ ] VARK assessment completes successfully
- [ ] AI Study Buddy responds
- [ ] Smart Search returns results
- [ ] Winston logs are being written
- [ ] Lighthouse audit on frontend (target: 90+)

## Rollback Plan
1. Railway: Rollback to previous deployment via dashboard
2. Vercel: Instant rollback via deployment history
3. Database: Restore from pre-deployment snapshot
```

---

## 13. Logging Architecture

### 13.1 Winston Configuration

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
//
// Morgan stream piped into Winston:
//   morgan(':method :url :status :response-time ms', {
//     stream: { write: (msg) => logger.http(msg.trim()) }
//   });

// Log levels:
//   error: 0  — Unhandled errors, database failures
//   warn:  1  — Rate limit warnings, deprecated API calls
//   info:  2  — Request start/end, user actions
//   http:  3  — Morgan HTTP request logs
//   debug: 4  — Query details, cache operations
```

### 13.2 Structured Log Format

```typescript
// Successful request:
{
  "timestamp": "2026-06-17T12:00:00.000Z",
  "level": "info",
  "message": "User signed in successfully",
  "service": "auth",
  "userId": "550e8400-...",
  "duration": 145
}

// Error:
{
  "timestamp": "2026-06-17T12:00:00.000Z",
  "level": "error",
  "message": "Database connection failed",
  "service": "database",
  "error": { "name": "ConnectionError", "message": "Connection refused" }
}

// NEVER log:
// - Passwords (even hashed)
// - JWT tokens
// - Credit card numbers
// - API keys or secrets
```

---

## 14. Developer Experience

### 14.1 NPM Scripts (Root `package.json`)

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

### 14.2 Husky Pre-commit Hook

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yaml}": ["prettier --write"]
  }
}
```

---

## 15. Migration Strategy from V1

### 15.1 Side-by-Side Comparison

| Aspect | V1 (Current) | V2 (Target) | Complexity |
|--------|-------------|-------------|------------|
| Database | MongoDB + Mongoose | PostgreSQL + Drizzle ORM | High |
| Language | JavaScript (CommonJS) | TypeScript (ESM) | Medium |
| Frontend | React + Vite | Next.js 15 App Router | High |
| Auth | Single JWT, localStorage | Access + Refresh, HTTP-only | Medium |
| Validation | Manual checks | Zod | Medium |
| AI | Gemini only (direct call) | Gemini only (service layer) | Low |
| State | React Context (3) | Zustand + TanStack Query | Medium |
| Caching | None | None (Redis in Phase 8) | None |
| Logging | console.log | Winston + Morgan | Low |
| Testing | None | Vitest | Medium |
| Containerization | None | Docker | Low |
| CI/CD | None | GitHub Actions (5 workflows) | Medium |
| Security | None | Helmet + CORS + Rate Limiting | Low |

### 15.2 Feature Migration Priority

| Priority | Feature | Phase | Effort |
|----------|---------|-------|--------|
| **P0** | User Authentication | Phase 2 | Medium |
| **P0** | VARK Assessment (16Q) | Phase 3 | Medium |
| **P0** | Brain Quiz (21Q) | Phase 4 | Medium |
| **P0** | Dashboard + Stats | Phase 5 | High |
| **P0** | AI Study Buddy | Phase 6 | High |
| **P1** | Smart Search | Phase 7 | Medium |
| **P1** | Activity/Streak Tracking | Phase 5 | Medium |
| **P1** | Learning Analytics | Phase 5 | High |
| **P1** | User Profile | Phase 2 | Low |
| **P2** | Learn Hub | Phase 5 | Medium |
| **P2** | Life Skills Hub | Phase 5 | Medium |
| **P2** | Results Page | Phase 3 | Low |
| **P2** | All-4-Style Compare | Phase 7 | Medium |
| **P3** | Pomodoro Timer | Phase 5 | Low |
| **P3** | Dark Mode | Phase 1 | Low |
| **P3** | PWA Support | Phase 10 | Medium |

### 15.3 Data Migration Script Architecture

```typescript
// scripts/migrate-v1-data.ts
//
// One-time migration script:
//
// 1. Connect to V1 MongoDB
// 2. Read all users from User collection
// 3. For each user:
//    a. Transform to V2 schema:
//       - MongoDB _id → UUID
//       - password stays as hash
//       - varkPreference → denormalized on users table
//       - brainScore → denormalized on users table
//       - dailyActivity → study_sessions rows
//       - createdAt → ISO timestamp
//    b. Insert into PostgreSQL via Drizzle
// 4. Verify counts match
// 5. Generate migration report
//
// Safety:
// - Dry-run mode (--dry-run flag)
// - Batch processing (100 users)
// - Progress logging
```

---

## Architecture Decision Records (ADRs)

| ADR | Decision | Rationale |
|-----|----------|-----------|
| **ADR-001** | PostgreSQL over MongoDB | Normalized schema, ACID compliance, Neon serverless |
| **ADR-002** | Drizzle ORM over Prisma | Lighter, faster, better TS integration |
| **ADR-003** | Express v5 over Fastify | Ecosystem maturity, simpler migration from V1 |
| **ADR-004** | HTTP-only cookies over localStorage | XSS mitigation, CSRF protection via SameSite |
| **ADR-005** | Gemini only (no factory) | MVP simplicity; add providers later when needed |
| **ADR-006** | Turborepo over Nx | Simpler config, faster for this project size |
| **ADR-007** | TanStack Query over SWR | Better TypeScript, more mature caching |
| **ADR-008** | Zustand over Redux | Simpler API, less boilerplate |
| **ADR-009** | Railway + Vercel over self-hosted | Zero DevOps, free tiers, easy scaling |
| **ADR-010** | No Redis in Phase 1 | Not needed at low scale; add in Phase 8 |

---

## NPM Package Versions (MVP)

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15.0.0 | Frontend framework |
| `react` | ^19.0.0 | UI library |
| `express` | ^5.0.0 | Backend framework |
| `typescript` | ^5.5.0 | Language |
| `drizzle-orm` | ^0.35.0 | ORM |
| `drizzle-kit` | ^0.28.0 | Migration tooling |
| `@neondatabase/serverless` | ^0.10.0 | Neon driver |
| `zod` | ^4.0.0 | Validation |
| `winston` | ^3.14.0 | Logging |
| `morgan` | ^1.10.0 | HTTP logging |
| `jsonwebtoken` | ^9.0.0 | JWT |
| `bcryptjs` | ^2.4.0 | Password hashing |
| `helmet` | ^8.0.0 | Security headers |
| `cookie-parser` | ^1.4.0 | Cookie parsing |
| `@google/generative-ai` | ^0.21.0 | Gemini SDK |
| `turbo` | ^2.0.0 | Monorepo tooling |
| `vitest` | ^2.0.0 | Testing |
| `husky` | ^9.0.0 | Git hooks |
| `tailwindcss` | ^3.4.0 | CSS framework |
| `zustand` | ^5.0.0 | State management |
| `@tanstack/react-query` | ^5.0.0 | Server state |
| `recharts` | ^2.12.0 | Charts |

---

*This document represents the solo developer MVP architecture for Brainify v2. Implementation should follow the 11-phase roadmap, with each phase producing deployable, tested increments. Enterprise features (Redis, Arcjet, Sentry, multi-provider AI) are deferred to post-MVP phases.*