# Brainify v2 — Implementation Roadmap

> **Document Version:** 1.0.0  
> **Date:** June 17, 2026  
> **Status:** Ready for Execution  
> **Total Estimated Effort:** 10-12 weeks (1 developer full-time)  

---

## Table of Contents

- [Phase 1: Project Foundation](#phase-1-project-foundation)
- [Phase 2: Database Layer](#phase-2-database-layer)
- [Phase 3: Authentication](#phase-3-authentication)
- [Phase 4: Frontend Foundation](#phase-4-frontend-foundation)
- [Phase 5: Assessments](#phase-5-assessments)
- [Phase 6: Dashboard](#phase-6-dashboard)
- [Phase 7: AI Layer](#phase-7-ai-layer)
- [Phase 8: Redis](#phase-8-redis)
- [Phase 9: Security](#phase-9-security)
- [Phase 10: Docker](#phase-10-docker)
- [Phase 11: CI/CD](#phase-11-cicd)
- [Phase 12: Production Deployment](#phase-12-production-deployment)

---

## Phase 1: Project Foundation

**Week:** 1  
**Effort:** 5 days  
**Dependencies:** None  

### Goal

Initialize the monorepo structure, package manager, shared configuration, and developer tooling. Establish the foundation that all subsequent phases build upon.

### Deliverables

1. Root monorepo with Turborepo + npm workspaces
2. TypeScript configurations (base + per-app)
3. ESLint + Prettier configurations
4. Shared package with types, validations, constants
5. Environment configuration with Zod validation
6. Winston logger setup
7. Express v5 app skeleton with health check
8. Next.js 15 app skeleton with root layout
9. Git hooks (Husky + lint-staged)
10. Root-level npm scripts

### Files to Create

```
brainify/
├── package.json                          # Root workspace config
├── turbo.json                            # Turborepo pipeline
├── tsconfig.base.json                    # Shared TS config
├── .eslintrc.cjs                         # ESLint config
├── .prettierrc                           # Prettier config
├── .prettierignore                       # Prettier ignore
├── .gitignore                            # Git ignore
├── .env.example                          # Environment template
├── .husky/
│   ├── pre-commit                        # Lint-staged hook
│   └── _/husky.sh                        # Husky internals
│
├── packages/
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── types/
│           │   ├── api.ts                # API response types
│           │   ├── user.ts               # User entity types
│           │   └── index.ts
│           ├── validations/
│           │   ├── auth.ts               # Sign-up/sign-in schemas
│           │   └── common.ts             # Pagination, ID, etc.
│           └── constants/
│               ├── vark.ts               # VARK style constants
│               ├── brain.ts              # Brain score thresholds
│               ├── roles.ts              # Role enum
│               └── index.ts
│
├── apps/
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── server.ts                 # Entry point
│   │       ├── app.ts                    # Express app setup
│   │       ├── config/
│   │       │   ├── env.ts               # Zod env validation
│   │       │   └── logger.ts            # Winston config
│   │       ├── middleware/
│   │       │   ├── error.middleware.ts   # Global error handler
│   │       │   └── not-found.middleware.ts
│   │       ├── utils/
│   │       │   └── response.ts          # Standard response helpers
│   │       └── types/
│   │           └── express.d.ts          # Express augmentation
│   │
│   └── web/
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── postcss.config.ts
│       ├── components.json               # Shadcn UI config
│       └── src/
│           ├── app/
│           │   ├── layout.tsx            # Root layout
│           │   ├── page.tsx              # Landing placeholder
│           │   ├── not-found.tsx         # 404 page
│           │   └── error.tsx             # Error boundary
│           └── styles/
│               ├── globals.css
│               └── shadcn.css
│
└── scripts/
    ├── dev.sh                            # Dev startup script
    └── prod.sh                           # Prod startup script
```

### Dependencies

| Dependency | Version | Purpose |
|-----------|---------|---------|
| `turbo` | ^2.0.0 | Monorepo orchestration |
| `typescript` | ^5.5.0 | Type safety |
| `eslint` | ^10.0.0 | Linting |
| `prettier` | ^3.3.0 | Formatting |
| `husky` | ^9.0.0 | Git hooks |
| `lint-staged` | ^15.0.0 | Staged file checks |
| `concurrently` | ^8.2.0 | Parallel dev servers |
| `express` | ^5.0.0 | Backend framework |
| `next` | ^15.0.0 | Frontend framework |
| `react` | ^19.0.0 | UI library |
| `tailwindcss` | ^3.4.0 | CSS framework |
| `zod` | ^4.0.0 | Validation |
| `winston` | ^3.14.0 | Logging |
| `morgan` | ^1.10.0 | HTTP logging |
| `tsx` | ^4.0.0 | TypeScript execution |
| `@types/*` | latest | Type definitions |

### Acceptance Criteria

- [ ] `npm run dev` starts both backend (port 8080) and frontend (port 3000)
- [ ] `GET /health` returns `{ success: true, data: { status: "healthy" } }`
- [ ] `GET /` on frontend renders the landing placeholder
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run format:check` passes with zero errors
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run build` produces production bundles for both apps
- [ ] Missing env vars cause startup failure with clear error message
- [ ] Winston logger writes structured JSON to console
- [ ] Morgan HTTP logs are piped through Winston
- [ ] Husky pre-commit hook runs lint-staged

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `chore: initialize monorepo with turborepo` | Root | package.json, turbo.json, gitignore |
| `chore: configure typescript, eslint, prettier` | Root | TS configs, ESLint, Prettier, Husky |
| `feat: create shared package` | `packages/shared` | Types, validations, constants |
| `feat: scaffold backend with express v5` | `apps/backend` | Server, app, config, error handling |
| `feat: scaffold frontend with next.js 15` | `apps/web` | App router, layout, Tailwind, Shadcn |
| `chore: add dev scripts and env configuration` | Root | env.example, dev.sh, prod.sh |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Initialize monorepo + Turborepo | 2 |
| Configure TypeScript (base + per-app) | 2 |
| Configure ESLint + Prettier + Husky | 2 |
| Create shared package | 4 |
| Scaffold backend (Express v5) | 6 |
| Scaffold frontend (Next.js 15) | 6 |
| Add scripts + env validation | 2 |
| **Total** | **24 hours (3 days)** |

---

## Phase 2: Database Layer

**Week:** 1-2  
**Effort:** 4 days  
**Dependencies:** Phase 1  

### Goal

Set up PostgreSQL with Drizzle ORM, create all database schemas, migrations, and seed data. Establish repository pattern for database access.

### Deliverables

1. Drizzle ORM configuration with Neon driver
2. All 13 table schemas defined
3. Migration files generated
4. Seed data (VARK questions, brain questions, admin user)
5. Repository layer for all entities
6. Database health check in `/health` endpoint
7. NPM scripts for DB operations

### Files to Create

```
apps/backend/src/
├── config/
│   └── database.ts                       # Drizzle + Neon config
├── models/
│   ├── schema/
│   │   ├── users.ts                      # Users table
│   │   ├── profiles.ts                   # Profiles table
│   │   ├── assessments.ts                # Assessments table
│   │   ├── study-sessions.ts             # Study sessions table
│   │   ├── daily-activities.ts           # Daily activities table
│   │   ├── ai-conversations.ts           # AI conversations table
│   │   ├── ai-messages.ts                # AI messages table
│   │   ├── refresh-tokens.ts             # Refresh tokens table
│   │   ├── vark-questions.ts             # VARK questions table
│   │   ├── brain-questions.ts            # Brain questions table
│   │   ├── learning-resources.ts         # Learning resources table
│   │   ├── life-skills.ts                # Life skills table
│   │   └── audit-logs.ts                 # Audit logs table
│   ├── relations.ts                      # Drizzle relations
│   └── index.ts                          # Schema barrel export
├── repositories/
│   ├── user.repository.ts
│   ├── assessment.repository.ts
│   ├── session.repository.ts
│   ├── activity.repository.ts
│   ├── token.repository.ts
│   ├── content.repository.ts
│   └── index.ts
│
└── drizzle/
    ├── migrations/                       # Auto-generated migrations
    ├── seed/
    │   ├── vark-questions.ts             # 16 VARK questions
    │   ├── brain-questions.ts            # 21 brain questions
    │   ├── admin-user.ts                 # Default admin account
    │   └── index.ts                      # Seed runner
    └── config.ts                         # Drizzle Kit config
```

### Table Schemas (13 total)

| Table | Key Fields | Relationships |
|-------|-----------|---------------|
| `users` | id, name, email, password_hash, role | → profiles, assessments, sessions, activities, conversations, tokens |
| `profiles` | id, user_id, bio, avatar_url, timezone | → users (1:1) |
| `assessments` | id, user_id, type, scores (JSONB), result | → users (1:N) |
| `study_sessions` | id, user_id, type, duration_mins | → users (1:N) |
| `daily_activities` | id, user_id, date, hours | → users (1:N) |
| `ai_conversations` | id, user_id, title, style | → users (1:N), → messages (1:N) |
| `ai_messages` | id, conv_id, role, content, tokens_used | → conversations (1:N) |
| `refresh_tokens` | id, user_id, token_hash, expires_at | → users (1:N) |
| `vark_questions` | id, question_text, options (JSONB), scoring_map (JSONB) | Standalone |
| `brain_questions` | id, group_key, option_a/b text/value, correct_answer | Standalone |
| `learning_resources` | id, vark_style, title, description, url, type | Standalone |
| `life_skills` | id, category, title, content, vark_adapted (JSONB) | Standalone |
| `audit_logs` | id, user_id, action, entity_type, old/new values | → users (1:N) |

### Database Indexes (18 total)

```sql
-- Users
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- Refresh Tokens
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at) WHERE is_revoked = false;

-- Assessments
CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_type ON assessments(type);

-- Sessions
CREATE INDEX idx_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_sessions_started ON study_sessions(started_at);

-- Activities
CREATE INDEX idx_activities_user_date ON daily_activities(user_id, date);

-- AI
CREATE INDEX idx_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_messages_conversation ON ai_messages(conv_id);
CREATE INDEX idx_conversations_updated ON ai_conversations(updated_at);

-- Audit
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Content
CREATE INDEX idx_vark_questions_active ON vark_questions(is_active);
CREATE INDEX idx_brain_questions_active ON brain_questions(is_active);
CREATE INDEX idx_resources_style ON learning_resources(vark_style);
CREATE INDEX idx_resources_active ON learning_resources(is_active);
CREATE INDEX idx_life_skills_category ON life_skills(category);
```

### Seed Data

| Seed | Records | Source |
|------|---------|--------|
| VARK Questions | 16 | `/old/frontend/src/data/varkQuestions.js` |
| Brain Questions | 21 | `/old/frontend/src/data/brainQuestions.js` |
| Admin User | 1 | Hardcoded (email/password configured via env) |
| Learning Resources | 20 | Static (4 per VARK style) |
| Life Skills Categories | 6 | Money, Rights, Health, Career, Digital, Environment |

### Repository Methods Per Entity

| Repository | Methods |
|-----------|---------|
| `user.repository.ts` | findById, findByEmail, create, update, softDelete, existsByEmail, countByRole |
| `assessment.repository.ts` | findByUserId, findByUserIdAndType, create, findLatestByType |
| `session.repository.ts` | findByUserId, findByUserIdAndDateRange, create, countByUserId, sumDurationByUserId |
| `activity.repository.ts` | findByUserId, findByUserIdAndDateRange, upsert, findStreak, getLast7Days |
| `token.repository.ts` | create, findByHash, revoke, revokeAllByUserId, cleanupExpired |
| `content.repository.ts` | findActiveVarkQuestions, findActiveBrainQuestions, findByStyle, findByCategory |

### Acceptance Criteria

- [ ] `npm run db:generate` creates migration files
- [ ] `npm run db:migrate` applies all 13 tables to Neon PostgreSQL
- [ ] `npm run db:seed` populates VARK questions, brain questions, admin user
- [ ] `npm run db:studio` opens Drizzle Studio GUI
- [ ] Repository methods return typed results (no `any`)
- [ ] Database health check returns response time in `/health`
- [ ] All indexes created and verifiable via `\di` in PostgreSQL
- [ ] Seed data matches V1 exactly (16 VARK questions, 21 brain questions)

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `feat: configure drizzle orm with neon` | DB config | database.ts, drizzle config |
| `feat: create user and profile schemas` | Models | users.ts, profiles.ts, relations |
| `feat: create assessment schemas` | Models | assessments.ts, vark/brain questions |
| `feat: create activity and session schemas` | Models | sessions.ts, activities.ts |
| `feat: create ai and content schemas` | Models | conversations.ts, messages.ts, resources.ts, life-skills.ts |
| `feat: create auth and audit schemas` | Models | refresh-tokens.ts, audit-logs.ts |
| `feat: implement repository layer` | Repositories | All 6 repository files |
| `feat: add seed data for questions and admin` | Seeds | vark-questions.ts, brain-questions.ts, admin-user.ts |
| `feat: generate and apply initial migrations` | Migrations | Generated migration files |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Configure Drizzle + Neon | 2 |
| Create all 13 table schemas | 6 |
| Define relations + indexes | 2 |
| Implement 6 repository classes | 6 |
| Create seed data (VARK, Brain, Admin) | 4 |
| Generate and test migrations | 2 |
| **Total** | **22 hours (~3 days)** |

---

## Phase 3: Authentication

**Week:** 2  
**Effort:** 5 days  
**Dependencies:** Phase 1, Phase 2  

### Goal

Implement complete authentication system with sign-up, sign-in, sign-out, token refresh, and role-based access control.

### Deliverables

1. Auth controller with 4 endpoints: sign-up, sign-in, sign-out, refresh
2. Auth service with business logic
3. Token service (JWT access + refresh generation, verification, rotation)
4. Password service (hashing, comparison)
5. Auth middleware (authenticate + authorize)
6. Zod validation schemas for auth
7. HTTP-only cookie management
8. Token repository (create, revoke, rotate)
9. User repository integration

### Files to Create

```
apps/backend/src/
├── controllers/
│   └── auth.controller.ts                # signUp, signIn, signOut, refresh
├── services/
│   ├── auth/
│   │   ├── auth.service.ts               # Registration, login, session management
│   │   ├── token.service.ts              # JWT generation, verification, rotation
│   │   └── password.service.ts           # bcrypt hash + compare
│   └── index.ts
├── repositories/
│   ├── user.repository.ts                # extend: findByEmailWithPassword
│   └── token.repository.ts               # create, findByHash, revoke, revokeAllByUserId
├── routes/
│   └── auth.routes.ts                    # POST /sign-up, /sign-in, /sign-out, /refresh
├── middleware/
│   ├── auth.middleware.ts                # authenticate + authorize(roles)
│   └── validate.middleware.ts            # Zod validation wrapper
├── validations/
│   └── auth.validation.ts                # signUpSchema, signInSchema
├── config/
│   ├── cookies.ts                        # Cookie configuration constants
│   └── cors.ts                           # CORS configuration
├── models/
│   └── schema/
│       └── refresh-tokens.ts             # Already created in Phase 2
└── types/
    └── express.d.ts                      # Extend: user property on Request
```

### Authentication Flow

```
POST /api/auth/sign-up
  Body: { name, email, password }
  Validation: Zod (name: 2-255, email, password: 6-128)
  Service:
    1. Check email not taken → 409 if duplicate
    2. Hash password (bcrypt, 10 rounds)
    3. Create user
    4. Generate access token (15 min, JWT_ACCESS_SECRET)
    5. Generate refresh token (7 days, JWT_REFRESH_SECRET)
    6. Store refresh token hash in DB
    7. Set both as HTTP-only cookies
  Response: 201 + user data

POST /api/auth/sign-in
  Body: { email, password }
  Validation: Zod (email, password)
  Service:
    1. Find user by email (active, not deleted)
    2. Compare password → 401 if invalid
    3. Revoke existing refresh tokens
    4. Generate new token pair
    5. Set cookies
  Response: 200 + user data

POST /api/auth/sign-out
  Cookie: refresh_token
  Service:
    1. Verify refresh token JWT
    2. Look up in DB by hash
    3. Revoke token (is_revoked = true)
    4. Clear cookies
  Response: 200

POST /api/auth/refresh
  Cookie: refresh_token
  Service:
    1. Verify refresh token JWT
    2. Look up in DB (not revoked, not expired)
    3. Check for token reuse:
       - If revoked → revoke ALL user tokens (compromised)
       - If valid → proceed
    4. Revoke old refresh token
    5. Create new refresh token
    6. Generate new access token
    7. Set new cookies
  Response: 200 + user data
```

### Cookie Configuration

```typescript
// Access token cookie
{
  name: 'access_token',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 900, // 15 minutes
}

// Refresh token cookie
{
  name: 'refresh_token',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth',
  maxAge: 604800, // 7 days
}
```

### Auth Middleware

```typescript
// authenticate(req, res, next)
// 1. Read access_token from cookies
// 2. Verify JWT signature (JWT_ACCESS_SECRET)
// 3. Decode payload: { userId, role }
// 4. Look up user in DB (active, not deleted)
// 5. Attach to req.user
// 6. next()

// authorize(...roles: string[]) => middleware
// 1. Check req.user.role ∈ roles
// 2. 403 if not authorized

// Usage:
// router.post('/admin/users', authenticate, authorize('admin'), adminController.listUsers)
```

### Zod Validation Schemas

```typescript
// signUpSchema
{
  name: z.string().min(2).max(255).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6).max(128),
}

// signInSchema
{
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1).max(128),
}
```

### Acceptance Criteria

- [ ] `POST /api/auth/sign-up` creates user and returns 201 with Set-Cookie headers
- [ ] `POST /api/auth/sign-up` returns 409 for duplicate email
- [ ] `POST /api/auth/sign-in` returns 200 with Set-Cookie headers
- [ ] `POST /api/auth/sign-in` returns 401 for invalid credentials
- [ ] `POST /api/auth/sign-out` clears cookies and revokes token
- [ ] `POST /api/auth/refresh` returns new token pair (rotation verified)
- [ ] Token reuse detection: using revoked token revokes ALL user tokens
- [ ] Access token expires after 15 minutes
- [ ] Refresh token expires after 7 days
- [ ] Auth middleware rejects requests without valid token (401)
- [ ] Auth middleware rejects requests with expired token (401)
- [ ] Authorize middleware rejects non-admin users (403)
- [ ] Cookies are httpOnly, secure (in production), sameSite=strict
- [ ] Refresh cookie path is restricted to `/api/auth`
- [ ] Rate limit: 5 attempts per email per minute on sign-in
- [ ] All auth endpoints return standardized response format
- [ ] Unit tests pass for all 4 auth flows
- [ ] Integration tests pass for happy + error paths

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `feat: implement password service` | Services | bcrypt hash + compare |
| `feat: implement token service` | Services | JWT generation, verification, rotation |
| `feat: implement auth service` | Services | sign-up, sign-in, sign-out, refresh logic |
| `feat: implement auth controller` | Controller | Request handling for 4 endpoints |
| `feat: create auth routes and validation` | Routes | /api/auth/* with Zod validation |
| `feat: implement auth middleware` | Middleware | authenticate + authorize |
| `feat: configure cors and cookies` | Config | CORS, cookie constants, helmet setup |
| `feat: implement token repository` | Repository | Refresh token CRUD |
| `test: add auth unit and integration tests` | Tests | All flows + error cases |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Implement password + token services | 4 |
| Implement auth service (business logic) | 6 |
| Implement auth controller + routes | 3 |
| Implement auth middleware | 2 |
| Implement token repository | 2 |
| Configure cookies, CORS, cookie-parser | 2 |
| Write unit + integration tests | 5 |
| **Total** | **24 hours (3 days)** |

---

## Phase 4: Frontend Foundation

**Week:** 3  
**Effort:** 5 days  
**Dependencies:** Phase 1, Phase 3  

### Goal

Set up the Next.js frontend with authentication flow, UI components, state management, API client, and protected route infrastructure.

### Deliverables

1. Shadcn UI component library initialized
2. Zustand stores (auth, UI, notifications)
3. TanStack Query setup
4. API client with interceptors + auto-refresh
5. Auth provider + auth guard component
6. Login and Register pages
7. Dashboard layout (sidebar + topbar)
8. Landing page (SSR)
9. Theme provider (dark/light mode)

### Files to Create

```
apps/web/src/
├── providers/
│   ├── auth-provider.tsx                # Auth state provider
│   ├── theme-provider.tsx               # Dark/light mode
│   └── query-provider.tsx               # TanStack Query
│
├── store/
│   ├── auth.store.ts                    # Zustand: user, login, logout, refresh
│   ├── ui.store.ts                      # Zustand: sidebar, modals, theme
│   └── index.ts
│
├── services/
│   ├── api-client.ts                    # Axios/fetch wrapper with interceptors
│   ├── auth.service.ts                  # signUp, signIn, signOut, refresh
│   ├── profile.service.ts              # getProfile, updateProfile
│   └── index.ts
│
├── hooks/
│   ├── use-auth.ts                      # Auth state shortcut
│   ├── use-theme.ts                     # Theme toggle
│   ├── use-debounce.ts                  # Debounce utility
│   └── index.ts
│
├── components/
│   ├── ui/                              # Shadcn UI (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── separator.tsx
│   ├── auth/
│   │   ├── login-form.tsx               # Email/password form
│   │   ├── register-form.tsx            # Name/email/password form
│   │   └── auth-guard.tsx               # Protected route wrapper
│   ├── layout/
│   │   ├── sidebar.tsx                  # Navigation sidebar
│   │   ├── topbar.tsx                   # Top bar with search, theme, user
│   │   ├── mobile-nav.tsx               # Mobile navigation
│   │   └── dashboard-layout.tsx         # Layout wrapper
│   └── shared/
│       ├── loading-spinner.tsx
│       ├── error-state.tsx
│       └── empty-state.tsx
│
├── app/
│   ├── layout.tsx                       # Root: providers, fonts, metadata
│   ├── page.tsx                         # Landing page (SSR)
│   ├── not-found.tsx                    # 404
│   ├── error.tsx                        # Error boundary
│   ├── (public)/
│   │   ├── login/
│   │   │   └── page.tsx                 # Login page
│   │   └── register/
│   │       └── page.tsx                 # Register page
│   └── (dashboard)/
│       ├── layout.tsx                   # DashboardLayout + AuthGuard
│       └── dashboard/
│           └── page.tsx                 # Placeholder dashboard
│
├── lib/
│   ├── utils.ts                         # cn(), formatDate(), etc.
│   └── constants.ts                     # Frontend constants
│
├── types/
│   ├── api.ts                           # API response types
│   └── user.ts                          # User type
│
└── styles/
    ├── globals.css                      # Tailwind directives
    └── shadcn.css                       # Shadcn UI theme variables
```

### API Client Architecture

```typescript
// services/api-client.ts
//
// Features:
// - Base URL from NEXT_PUBLIC_API_URL
// - Request interceptor: nothing needed (cookies sent automatically)
// - Response interceptor:
//   - 401 response → attempt refresh via /api/auth/refresh
//   - Refresh succeeds → retry original request
//   - Refresh fails → redirect to /login, clear auth store
// - Error normalization: catch → transform to AppError
// - Retry: exponential backoff for 5xx errors (max 3 retries)
// - AbortController support for request cancellation
// - Request deduplication for identical in-flight requests
//
// 401 Handling Flow:
// 1. Request returns 401
// 2. Interceptor catches 401
// 3. Check if already refreshing (prevent race condition)
// 4. Call POST /api/auth/refresh
// 5. On success: retry original request
// 6. On failure: clear auth store, redirect to /login
```

### Auth Guard Logic

```typescript
// components/auth/auth-guard.tsx
//
// Flow:
// 1. Read auth state from Zustand store
//    - Loading → render <LoadingSkeleton />
//    - No user → redirect to /login with returnUrl
//    - User exists but role insufficient → render <ForbiddenPage />
//    - Valid → render children
//
// Route Protection Matrix:
// ┌──────────────┬──────────┬───────────┐
// │ Route        │ Auth     │ Role      │
// ├──────────────┼──────────┼───────────┤
// │ /            │ ❌      │ —         │
// │ /login       │ ❌      │ —         │
// │ /register    │ ❌      │ —         │
// │ /dashboard/* │ ✅      │ user/admin│
// │ /admin/*     │ ✅      │ admin     │
// │ /quiz/*      │ ✅      │ user/admin│
// └──────────────┴──────────┴───────────┘
```

### Acceptance Criteria

- [ ] Landing page renders with SSR (check page source for content)
- [ ] Login page submits form → calls POST /api/auth/sign-in → redirects to dashboard
- [ ] Register page submits form → calls POST /api/auth/sign-up → redirects to dashboard
- [ ] Unauthenticated user visiting /dashboard → redirected to /login
- [ ] Login form shows validation errors (empty email, invalid email, short password)
- [ ] Register form shows validation errors (duplicate email)
- [ ] Dashboard layout renders sidebar + topbar
- [ ] Dark mode toggle works (persisted to localStorage)
- [ ] API client automatically refreshes on 401
- [ ] API client shows loading states during auth check
- [ ] TanStack Query caches profile data (staleTime: 5 min)
- [ ] Zustand auth state persists across page navigation
- [ ] Shadcn UI components render correctly (button, card, input, etc.)
- [ ] All pages have proper metadata (title, description)
- [ ] Error boundary catches React errors without full page crash

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `feat: initialize shadcn ui components` | UI | All shadcn components |
| `feat: implement api client with interceptors` | Services | Axios wrapper with auto-refresh |
| `feat: implement auth store and service` | Store/Service | Zustand + API calls |
| `feat: create auth provider and guard` | Providers | AuthProvider, AuthGuard |
| `feat: create login and register pages` | Pages | Forms with validation |
| `feat: create dashboard layout` | Layout | Sidebar, topbar, mobile nav |
| `feat: create landing page` | Page | SSR landing with hero |
| `feat: implement theme provider` | Provider | Dark/light mode toggle |
| `feat: add tanstack query provider` | Provider | QueryClient setup |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Initialize Shadcn UI + theme | 3 |
| Implement API client | 4 |
| Implement Zustand stores | 3 |
| Implement AuthProvider + AuthGuard | 3 |
| Create Login + Register pages | 6 |
| Create dashboard layout (sidebar + topbar) | 6 |
| Create landing page | 4 |
| Create theme provider | 1 |
| **Total** | **30 hours (~4 days)** |

---

## Phase 5: Assessments

**Week:** 3-4  
**Effort:** 4 days  
**Dependencies:** Phase 2, Phase 4  

### Goal

Implement VARK and Brain Dominance assessment engines, including quiz pages, scoring logic, results display, and retake functionality.

### Deliverables

1. VARK assessment service (scoring logic from V1)
2. Brain dominance service (A/B scoring from V1)
3. Assessment controller + routes
4. VARK quiz page (16 multi-select questions)
5. Brain quiz page (21 A/B choice questions)
6. Results page (radar chart, score, certificate)
7. Profile controller + routes (get/update)
8. Profile page (settings + preferences)

### Files to Create

```
apps/backend/src/
├── controllers/
│   ├── assessment.controller.ts          # submitVark, submitBrain, retake
│   └── profile.controller.ts             # getProfile, updateProfile
├── services/
│   ├── assessment/
│   │   ├── vark.service.ts              # VARK scoring logic
│   │   └── brain.service.ts             # Brain scoring logic
│   ├── profile.service.ts               # Profile management
│   └── index.ts
├── routes/
│   ├── assessment.routes.ts             # POST /vark, /brain, /retake
│   └── profile.routes.ts                # GET /me, PUT /me
├── validations/
│   ├── assessment.validation.ts         # VARK/brain answer schemas
│   └── profile.validation.ts            # Profile update schema
└── repositories/
    ├── user.repository.ts               # extend: updateProfile
    └── assessment.repository.ts         # create, findByUserIdAndType
```

```
apps/web/src/
├── app/
│   └── (quiz)/
│       ├── layout.tsx                   # Minimal quiz layout
│       ├── questions/
│       │   └── page.tsx                 # VARK quiz (16 questions)
│       ├── brain-quiz/
│       │   └── page.tsx                 # Brain quiz (21 questions)
│       └── results/
│           └── page.tsx                 # Results + certificate
├── components/
│   ├── quiz/
│   │   ├── vark-question.tsx            # Multi-select question card
│   │   ├── brain-question.tsx           # A/B choice card
│   │   ├── progress-bar.tsx             # Progress indicator
│   │   └── results-chart.tsx            # Radar + bar charts
│   └── profile/
│       ├── profile-form.tsx             # Edit profile form
│       └── profile-card.tsx             # Profile display card
├── services/
│   ├── assessment.service.ts            # submitVark, submitBrain, retake
│   └── profile.service.ts              # getProfile, updateProfile
└── app/
    └── (dashboard)/
        └── profile/
            └── page.tsx                 # Profile settings page
```

### VARK Scoring Logic

```typescript
// services/assessment/vark.service.ts
//
// Input: answers = { question1: ['option1','option3'], question2: ['option2'], ... }
//        16 questions, multi-select allowed
//
// Scoring:
//   option1 → Kinesthetic (+1)
//   option2 → Aural (+1)
//   option3 → Read/Write (+1)
//   option4 → Visual (+1)
//
// Output:
//   scores: { visual: number, aural: number, readWrite: number, kinesthetic: number }
//   preference: 'Visual' | 'Aural' | 'Read/Write' | 'Kinesthetic' (highest score)
//   note: Descriptive paragraph about the style
//
// Tie-breaking: If two styles have equal scores, the first in
// [Visual, Aural, Read/Write, Kinesthetic] order wins.
//
// Validation:
//   - Must have exactly 16 questions answered
//   - Each answer must be an array of valid options
//   - No empty arrays allowed
//   - Invalid options rejected
```

### Brain Dominance Scoring Logic

```typescript
// services/assessment/brain.service.ts
//
// Input: answers = { group_a: 'option1', group_b: 'option4', ... }
//        21 A/B choice questions
//
// Correct answers (right-brain indicators):
//   group_a: option1, group_b: option4, group_c: option6, ...
//   (same as V1: all 21 groups mapped to correct option)
//
// Scoring:
//   score = count of answers matching correctAnswers map
//   range: 0-21
//
// Brain Type Determination:
//   0-5:   'Strong Left Brain'
//   6-8:   'Moderate Left Brain'
//   9-13:  'Balanced Brain'
//   14-16: 'Moderate Right Brain'
//   17-21: 'Strong Right Brain'
//
// Validation:
//   - Must have exactly 21 questions answered
//   - Each answer must be one of the two valid options
//   - Invalid option values rejected
```

### Results Page Components

```markdown
Results page layout:
┌─────────────────────────────────────────────────┐
│  🎉 Congratulations, [name]!                     │
│  Your learning style is:                          │
│  ┌───────────────────────────────────────────┐   │
│  │           VISUAL LEARNER                   │   │
│  │           Score: 12/16                     │   │
│  │   [Radar Chart: Visual, Aural,             │   │
│  │    Read/Write, Kinesthetic]                │   │
│  └───────────────────────────────────────────┘   │
│                                                   │
│  VARK Breakdown:                                   │
│  Visual: ████████████ 12                            │
│  Aural:  ██████        6                            │
│  Read:   ████          4                            │
│  Kines:  ██████████   10                            │
│                                                   │
│  Brain Dominance:                                  │
│  Score: 15/21 — Moderate Right Brain               │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  📋 Download Certificate  🔄 Retake Quiz   │   │
│  └────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Acceptance Criteria

- [ ] `POST /api/assessment/vark` returns correct VARK scores matching V1 logic
- [ ] `POST /api/assessment/brain` returns correct brain score matching V1 logic
- [ ] `POST /api/assessment/retake` resets all scores to 0
- [ ] VARK quiz page shows 16 questions one at a time with progress bar
- [ ] Brain quiz page shows 21 A/B choices one at a time
- [ ] Results page displays radar chart + score breakdown
- [ ] Results page shows brain dominance type + score
- [ ] Results page has "Download Certificate" button
- [ ] Results page has "Retake Assessment" button
- [ ] `GET /api/profile/me` returns full user profile
- [ ] `PUT /api/profile/me` updates name and bio
- [ ] Profile page shows current values in form fields
- [ ] All validation errors display correctly in forms
- [ ] Loading states shown during quiz submission
- [ ] Zod validation rejects invalid answer formats

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `feat: implement vark scoring service` | Backend | VARK assessment logic |
| `feat: implement brain scoring service` | Backend | Brain dominance logic |
| `feat: create assessment routes and controller` | Backend | /api/assessment/* |
| `feat: create profile routes and controller` | Backend | /api/profile/* |
| `feat: create vark quiz page` | Frontend | Multi-select quiz flow |
| `feat: create brain quiz page` | Frontend | A/B choice quiz flow |
| `feat: create results page with charts` | Frontend | Radar chart, scores, certificate |
| `feat: create profile settings page` | Frontend | Edit name, bio |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Implement VARK + Brain services | 4 |
| Implement assessment controller + routes | 2 |
| Implement profile controller + routes | 2 |
| Create VARK quiz page | 6 |
| Create Brain quiz page | 4 |
| Create Results page with Recharts | 6 |
| Create profile page | 3 |
| **Total** | **27 hours (~3.5 days)** |

---

## Phase 6: Dashboard

**Week:** 4-5  
**Effort:** 5 days  
**Dependencies:** Phase 4, Phase 5  

### Goal

Build the main dashboard, analytics page, learn hub, smart search UI, study buddy UI, life skills hub, and Pomodoro timer.

### Deliverables

1. Dashboard page (welcome banner, stat cards, engagement chart, VARK radar)
2. Analytics page (metrics row, line chart, radar chart, focus bar chart)
3. Learn Hub page (VARK-specific recommendations)
4. Smart Search page (search bar, results, all-styles compare)
5. Study Buddy page (full-page AI chat)
6. Life Skills Hub page (6 categories)
7. Pomodoro Timer component
8. Session logging endpoints

### Files to Create

```
apps/backend/src/
├── controllers/
│   ├── analytics.controller.ts          # Dashboard/analytics aggregations
│   ├── sessions.controller.ts           # Session logging
│   └── content.controller.ts            # VARK questions, resources
├── services/
│   ├── analytics.service.ts             # Aggregate user stats
│   ├── sessions.service.ts              # Study session CRUD
│   └── cache.service.ts                 # Redis caching (stub)
├── routes/
│   ├── analytics.routes.ts              # GET /overview, /trends
│   ├── sessions.routes.ts              # POST /log-session, /log-time
│   └── content.routes.ts               # GET /vark-questions, /resources
├── repositories/
│   ├── session.repository.ts            # Already created in Phase 2
│   └── activity.repository.ts           # Already created in Phase 2
└── validations/
    └── sessions.validation.ts           # Log session schema
```

```
apps/web/src/
├── app/
│   └── (dashboard)/
│       ├── dashboard/
│       │   └── page.tsx                 # Main dashboard
│       ├── analytics/
│       │   └── page.tsx                 # Analytics page
│       ├── recommendations/
│       │   └── page.tsx                 # Learn Hub
│       ├── learn/
│       │   └── [style]/
│       │       └── page.tsx             # Style-specific resources
│       ├── study-buddy/
│       │   └── page.tsx                 # Study Buddy chat
│       ├── smart-search/
│       │   └── page.tsx                 # Smart Search
│       └── life-skills/
│           └── page.tsx                 # Life Skills Hub
├── components/
│   ├── dashboard/
│   │   ├── welcome-banner.tsx           # Greeting + personalized message
│   │   ├── stat-card.tsx                # Metric display card
│   │   ├── engagement-chart.tsx         # Recharts line chart
│   │   ├── vark-radar.tsx               # Recharts radar chart
│   │   └── quick-actions.tsx            # Quick navigation cards
│   ├── ai/
│   │   ├── chat-widget.tsx              # Floating chat button (Phase 7)
│   │   ├── chat-message.tsx             # Message bubble
│   │   ├── chat-input.tsx               # Message input with send
│   │   ├── style-badge.tsx              # VARK style indicator
│   │   └── search-results.tsx           # Search result display
│   └── timer/
│       └── pomodoro-timer.tsx           # 25/5/15 min timer
├── services/
│   ├── analytics.service.ts            # Fetch dashboard/analytics data
│   ├── sessions.service.ts             # Log study sessions
│   └── content.service.ts              # Fetch VARK questions, resources
└── hooks/
    └── use-pomodoro.ts                 # Timer state hook
```

### Dashboard Layout

```
┌──────────────────────────────────────────────────────────┐
│  🌅 Good morning, John! 👋                               │
│  Your dominant learning style is Visual.                 │
│  [View Results]  [View Schedule]                         │
├──────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Dominant │  │  Brain   │  │  Weekly  │  │Achieve-  │ │
│  │  Style   │  │  Score   │  │  Focus   │  │ ments    │ │
│  │  Visual  │  │  15/21   │  │  12.5h   │  │  24 ses  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
├──────────────────────────────────┬───────────────────────┤
│  📈 Learning Engagement          │  🎯 Your VARK Profile │
│  [Line Chart: hours over 7 days] │  [Radar Chart]        │
│                                  │  Visual: 12           │
│  🌍 Your Civic Learning Impact   │  Aural: 6             │
│  24 sessions · 5🔥 streak · Vis  │  Read: 4              │
│                                  │  Kines: 10            │
├──────────────────────────────────┼───────────────────────┤
│  Quick Actions                   │  ⏱️ Pomodoro Timer    │
│  📝 VARK Assessment              │  [25:00]              │
│  🧠 Brain Quiz                   │  [▶ Start] [Reset]   │
│  📊 View Results                 │                       │
└──────────────────────────────────┴───────────────────────┘
```

### Analytics Page Components

```markdown
- Metrics Row: Total Sessions, Streak Days, Total Hours, Avg Session Length
- Line Chart: Learning hours over last 30 days
- Radar Chart: VARK score comparison (current vs initial)
- Bar Chart: Focus time by day of week
- Activity Calendar: GitHub-style contribution heatmap
- Data range filter: 7d, 30d, 90d
```

### Learn Hub Content Structure

```typescript
// Static data per VARK style (will be moved to DB in Phase 10):
// Each style has 5 resource cards:
// - Video (Visual)
// - Podcast (Auditory)
// - Article (Read/Write)
// - Interactive Exercise (Kinesthetic)
// - Mixed (combines multiple styles)
```

### Life Skills Categories

| Category | Hindi Title | Topics |
|----------|-------------|--------|
| Money | Paisa Samajho | Budgeting, UPI, savings, taxes |
| Rights | Tumhare Adhikar | RTI, RTE, child rights, legal aid |
| Health | Mann aur Tan | Mental health, first aid, nutrition |
| Career | Career Seedha | Job skills, resume, interviews |
| Digital | Digital Duniya | Online safety, fake news, digital literacy |
| Environment | Prakriti | Climate change, conservation, sustainability |

### Acceptance Criteria

- [ ] Dashboard shows real data from API (no hardcoded values)
- [ ] Engagement chart shows last 7 days of activity
- [ ] VARK radar chart updates when assessment is retaken
- [ ] Stat cards show correct totals from backend
- [ ] Analytics page shows 30-day trends
- [ ] Analytics line chart is interactive (tooltip, hover)
- [ ] Learn Hub shows 5 resources per VARK style
- [ ] Smart Search input field exists (backend integration in Phase 7)
- [ ] Study Buddy page has chat interface (backend integration in Phase 7)
- [ ] Life Skills shows 6 category cards
- [ ] Pomodoro timer counts down 25 min, shows notification
- [ ] Pomodoro auto-logs session to backend on completion
- [ ] Session logging via `POST /api/sessions/log-session` works
- [ ] Time-on-app tracking logs via visibilitychange events
- [ ] Quick actions navigate to correct pages
- [ ] All charts use Recharts with consistent styling

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `feat: implement dashboard page` | Frontend | Welcome, stats, charts, quick actions |
| `feat: implement analytics page` | Frontend | Metrics, line/radar/bar charts |
| `feat: create learn hub page` | Frontend | VARK-specific resources |
| `feat: create life skills hub` | Frontend | 6 categories with content |
| `feat: implement pomodoro timer` | Frontend | Timer with auto-logging |
| `feat: create session logging endpoints` | Backend | /api/sessions/* |
| `feat: implement analytics aggregation` | Backend | /api/analytics/* |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Dashboard page (welcome, stats, charts) | 8 |
| Analytics page (metrics, 3 charts, filters) | 8 |
| Learn Hub page (VARK resources) | 4 |
| Life Skills page (6 categories) | 4 |
| Pomodoro Timer component | 3 |
| Session logging endpoints | 2 |
| Analytics aggregation endpoints | 3 |
| **Total** | **32 hours (4 days)** |

---

## Phase 7: AI Layer

**Week:** 5-6  
**Effort:** 5 days  
**Dependencies:** Phase 2, Phase 4  

### Goal

Implement the AI provider abstraction layer, VARK-adapted chat, smart search with Wikipedia integration, and all-styles compare mode.

### Deliverables

1. AI provider interface + factory pattern
2. Gemini provider implementation
3. OpenAI provider implementation
4. Prompt template system (YAML files)
5. VARK-adapted system prompts (4 styles)
6. Study Buddy chat endpoint (with streaming)
7. Smart Search endpoint (Wikipedia + AI)
8. All-styles compare endpoint (4 parallel AI calls)
9. AI response caching
10. Token counting + budgeting
11. Frontend chat widget + search UI

### Files to Create

```
apps/backend/src/
├── controllers/
│   ├── ai.controller.ts                 # studyBuddyChat
│   └── search.controller.ts             # smartSearch, allStyles
├── services/
│   ├── ai/
│   │   ├── ai.service.ts                # Orchestration, caching, fallback
│   │   ├── ai.factory.ts                # Provider factory
│   │   ├── providers/
│   │   │   ├── ai-provider.interface.ts # AIProvider interface
│   │   │   ├── gemini.provider.ts       # Gemini implementation
│   │   │   └── openai.provider.ts       # OpenAI implementation
│   │   ├── prompt.service.ts            # Template loading + rendering
│   │   └── token-counter.ts             # Token estimation
│   ├── search.service.ts                # Wikipedia fetch + AI reformat
│   └── cache.service.ts                 # Redis caching (extend)
├── routes/
│   ├── ai.routes.ts                     # POST /chat
│   └── search.routes.ts                # POST /query, /all-styles
├── validations/
│   ├── ai.validation.ts                 # Chat message schema
│   └── search.validation.ts             # Search query schema
├── constants/
│   └── style-prompts.ts                 # VARK style prompt templates
└── prompt-templates/                    # YAML template files
    ├── study-buddy/
    │   ├── visual.yaml
    │   ├── auditory.yaml
    │   ├── readwrite.yaml
    │   └── kinesthetic.yaml
    └── smart-search/
        ├── visual.yaml
        ├── auditory.yaml
        ├── readwrite.yaml
        ├── kinesthetic.yaml
        └── all-styles.yaml
```

```
apps/web/src/
├── components/
│   ├── ai/
│   │   ├── chat-widget.tsx              # Floating widget (already exists)
│   │   ├── chat-message.tsx             # Message bubble with streaming
│   │   ├── chat-input.tsx               # Input with send + quick prompts
│   │   ├── style-badge.tsx              # VARK badge on messages
│   │   └── search-results.tsx           # Wiki source + AI answer
│   └── search/
│       ├── search-bar.tsx               # Input with style toggle
│       └── style-compare.tsx            # 4-column style comparison
├── services/
│   ├── ai.service.ts                    # sendChatMessage, streamChat
│   └── search.service.ts               # searchQuery, searchAllStyles
└── app/
    └── (dashboard)/
        ├── study-buddy/
        │   └── page.tsx                 # Full-page chat (already exists)
        └── smart-search/
            └── page.tsx                 # Search page (already exists)
```

### AI Provider Interface

```typescript
// services/ai/providers/ai-provider.interface.ts

interface ChatParams {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ChatResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface AIProvider {
  chat(params: ChatParams): Promise<ChatResponse>;
  streamChat?(params: ChatParams): AsyncIterable<string>;
  generate?(prompt: string, options?: GenOptions): Promise<ChatResponse>;
}
```

### Wikipedia + AI Search Flow

```typescript
// services/search.service.ts
//
// 1. Receive query + learningStyle from client
// 2. Check Redis cache for wiki:{query} → skip fetch if cached
// 3. Fetch Wikipedia REST API summary (/page/summary/{query})
//    - Success: extract title, extract, URL
//    - Fallback: search API → get first result → fetch summary
//    - Both fail: return null context
// 4. Cache Wikipedia result in Redis (TTL: 24 hours)
// 5. Build prompt: style template + Wikipedia context + user query
// 6. Check AI cache for prompt hash → return cached if exists
// 7. Call AI provider (gemini or openai)
// 8. Cache AI response in Redis (TTL: 1 hour)
// 9. Return { answer, style, wikiTitle, wikiUrl, query }
```

### All-Styles Compare Flow

```typescript
// POST /api/search/all-styles
//
// 1. Fetch Wikipedia content once (cached)
// 2. Build 4 prompts (visual, auditory, readwrite, kinesthetic)
// 3. Check cache for each style individually
// 4. Call AI provider 4x in parallel via Promise.allSettled()
//    - Handle partial failures (return error for failed style)
// 5. Return { results: [{ style, answer }], wikiTitle, wikiUrl }
//
// Performance optimization:
// - Wikipedia fetch cached 24h
// - Individual style responses cached 1h
// - Max 4 concurrent AI calls
// - Timeout: 15 seconds per call
```

### Prompt Template Examples

```yaml
# prompt-templates/study-buddy/visual.yaml
system_prompt: |
  You are Brainify AI Study Buddy — a friendly, intelligent, and encouraging learning assistant.

  The user is a VISUAL learner. Adapt your response accordingly:
  - Use spatial language: "imagine", "picture this", "visualize"
  - Describe diagrams using words (flowcharts, mind maps, tables)
  - Use clear visual hierarchy: bullet points, indentation, sections
  - Reference colors, shapes, layouts in analogies
  - End with a "Visual Summary" section

  Keep answers concise but complete. Use simple language.
  Never be condescending. Always encourage.
  End with a follow-up question to deepen understanding.

# prompt-templates/study-buddy/kinesthetic.yaml
system_prompt: |
  You are Brainify AI Study Buddy — a friendly, intelligent, and encouraging learning assistant.

  The user is a KINESTHETIC learner. Adapt your response accordingly:
  - Use action verbs and practical language
  - Give real-world examples and hands-on analogies
  - Provide step-by-step "try this" instructions
  - Use phrases like "in practice", "a real example", "try this"
  - End with a mini-activity or experiment the user can try

  Keep answers concise but complete. Use simple language.
  Never be condescending. Always encourage.
  End with a follow-up question to deepen understanding.
```

### Acceptance Criteria

- [ ] `POST /api/ai/chat` returns VARK-adapted responses (4 styles verified)
- [ ] `POST /api/ai/chat` accepts `{ message, learningStyle, chatHistory }`
- [ ] `POST /api/search/query` returns Wikipedia-sourced AI response
- [ ] `POST /api/search/all-styles` returns 4 style-adapted responses
- [ ] Wikipedia fetch falls back to search API gracefully
- [ ] AI responses are cached in Redis (verified by 2nd identical request)
- [ ] Gemini provider returns content correctly
- [ ] OpenAI provider returns content correctly (if API key configured)
- [ ] AI provider fallback works (primary fails → secondary succeeds)
- [ ] Token counting prevents oversized requests
- [ ] Rate limiting: 15 AI requests/minute per user
- [ ] Study Buddy frontend shows streaming responses (if supported)
- [ ] Smart Search frontend shows wiki source + AI answer
- [ ] All-styles compare shows 4 columns with style labels
- [ ] Chat history maintained (last 8 messages sent with each request)
- [ ] Empty chat history gracefully handled on first message
- [ ] Error state shown when AI service is unavailable

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `feat: create ai provider interface and factory` | Backend | Interface, factory, types |
| `feat: implement gemini provider` | Backend | Gemini SDK integration |
| `feat: implement openai provider` | Backend | OpenAI SDK integration |
| `feat: implement prompt template system` | Backend | YAML loading + rendering |
| `feat: implement chat service and controller` | Backend | /api/ai/chat with streaming |
| `feat: implement smart search service` | Backend | Wikipedia + AI + all-styles |
| `feat: implement search routes and controller` | Backend | /api/search/* |
| `feat: integrate ai caching with redis` | Backend | Response caching |
| `feat: create study buddy chat frontend` | Frontend | Chat UI with streaming |
| `feat: create smart search frontend` | Frontend | Search + all-styles compare |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Create AI provider interface + factory | 3 |
| Implement Gemini provider | 3 |
| Implement OpenAI provider | 3 |
| Implement prompt template system | 3 |
| Implement chat service + controller | 4 |
| Implement search service (Wikipedia) | 4 |
| Implement all-styles (parallel AI) | 3 |
| Implement frontend chat UI | 6 |
| Implement frontend search UI | 4 |
| Integrate Redis caching for AI | 2 |
| **Total** | **35 hours (~4.5 days)** |

---

## Phase 8: Redis

**Week:** 6-7  
**Effort:** 3 days  
**Dependencies:** Phase 2, Phase 7  

### Goal

Integrate Redis for API caching, AI response caching, distributed rate limiting, and background job processing.

### Deliverables

1. Redis client configuration (Upstash)
2. Cache service (generic get/set/invalidate)
3. API response caching middleware
4. AI response caching integration
5. Distributed rate limiter (replacing memory limiter)
6. Bull/BullMQ job queue setup
7. Audit log processor (async)
8. Cache warm-up job

### Files to Create

```
apps/backend/src/
├── config/
│   └── redis.ts                           # Upstash Redis client
├── services/
│   └── cache.service.ts                   # Generic cache operations
├── middleware/
│   └── rate-limit.middleware.ts           # Redis-backed rate limiter
├── jobs/
│   ├── queue.ts                           # BullMQ queue setup
│   ├── processors/
│   │   ├── audit-log.processor.ts         # Async audit log writer
│   │   └── cache-warm.processor.ts        # Pre-cache popular queries
│   └── schedules/
│       └── streak-calc.schedule.ts        # Periodic streak recalculation
└── utils/
    └── cache-keys.ts                      # Redis key naming constants
```

### Redis Key Naming Convention

```
# Pattern: {service}:{type}:{identifier}

# API Cache
api:get:/api/profile/me:{userId}
api:get:/api/analytics/*:{userId}
api:get:/api/sessions:*:{userId}

# AI Cache
ai:{provider}:{prompt_hash}:{style}
ai:{provider}:{prompt_hash}:{style}:v{version}

# Wikipedia Cache
wiki:{normalized_query}

# Rate Limiting
ratelimit:{tier}:{identifier}:{window}
ratelimit:user:user_123:1718612345
ratelimit:guest:ip_1.2.3.4:1718612345
ratelimit:auth:email@example.com:1718612345

# Login Attempts
login:attempts:{email}
login:blocked:{email}

# Job Queues
bull:audit-log:*
bull:cache-warm:*
```

### Cache Configuration

```typescript
// Cache TTLs:
// ┌──────────────────────┬──────────┬────────────────────────┐
// │ Cache Type           │ TTL      │ Strategy               │
// ├──────────────────────┼──────────┼────────────────────────┤
// │ API: User Profile    │ 5 min    │ Cache-aside            │
// │ API: Analytics       │ 5 min    │ Cache-aside            │
// │ API: Sessions        │ 2 min    │ Cache-aside            │
// │ AI: Chat Response    │ 1 hour   │ Cache-aside + hash key │
// │ AI: Smart Search     │ 1 hour   │ Cache-aside + hash key │
// │ Wikipedia            │ 24 hours │ Cache-aside            │
// │ Rate Limit Windows   │ 1 min    │ Sliding window counter │
// │ Login Attempts       │ 15 min   │ Simple counter + TTL   │
// └──────────────────────┴──────────┴────────────────────────┘

// Cache Invalidation:
// ┌──────────────────────┬────────────────────────────────────┐
// │ Trigger              │ Keys to Invalidate                 │
// ├──────────────────────┼────────────────────────────────────┤
// │ Profile Update       │ api:get:/api/profile/me:{userId}   │
// │ Session Logged       │ api:get:/api/analytics/*:{userId}  │
// │                      │ api:get:/api/sessions:*:{userId}   │
// │ Assessment Submitted │ api:get:/api/analytics/*:{userId}  │
// │ AI Chat Completed    │ (no invalidation, let TTL expire)  │
// └──────────────────────┴────────────────────────────────────┘
```

### Rate Limiting Strategy

```typescript
// middleware/rate-limit.middleware.ts
//
// Tiers (configurable via constants):
// ┌──────────┬───────────────┬────────────────────────────────┐
// │ Tier     │ Requests/min  │ Applied To                     │
// ├──────────┼───────────────┼────────────────────────────────┤
// │ admin    │ 20            │ Authenticated admin users      │
// │ user     │ 10            │ Authenticated regular users    │
// │ guest    │ 5             │ Unauthenticated requests        │
// │ auth     │ 5/email/min   │ POST /api/auth/sign-in         │
// │ ai       │ 15            │ POST /api/ai/*, /api/search/*  │
// └──────────┴───────────────┴────────────────────────────────┘
//
// Algorithm: Sliding Window Counter
// - Key: ratelimit:{tier}:{identifier}:{current_minute}
// - Current minute: Math.floor(Date.now() / 60000)
// - Value: request count (INCR)
// - TTL: 120 seconds (covers current + next window)
//
// On rate limit hit:
// - Status: 429
// - Headers: Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
```

### Job Queue Architecture

```typescript
// jobs/queue.ts
//
// BullMQ queues:
//
// 1. audit-log
//    - Purpose: Write non-critical audit records asynchronously
//    - Concurrency: 5
//    - Retry: 3 attempts, exponential backoff
//    - Jobs: recordAction(userId, entityType, entityId, oldValues, newValues)
//
// 2. cache-warm
//    - Purpose: Pre-cache popular queries during low traffic
//    - Concurrency: 2
//    - Schedule: Every 6 hours
//    - Jobs: warmAnalyticsCache(), warmPopularSearchQueries()
//
// 3. notifications (future)
//    - Purpose: Send push notifications
//    - Concurrency: 10
//    - Jobs: sendStudyReminder(), sendStreakAlert()
```

### Acceptance Criteria

- [ ] Redis connection verified in /health endpoint
- [ ] Cache service: set/get/delete operations work
- [ ] API response caching reduces database queries (verified by logs)
- [ ] AI response caching returns cached response for identical queries
- [ ] Wikipedia fetch caching reduces external API calls
- [ ] Rate limiting blocks requests after tier limit exceeded
- [ ] Rate limiting headers present in response
- [ ] Different tiers have different limits (admin > user > guest)
- [ ] Auth rate limit blocks brute force per email
- [ ] AI rate limit is separate from API rate limit
- [ ] Cache invalidation triggers on profile/session updates
- [ ] BullMQ queue processes audit log jobs asynchronously
- [ ] Cache warm job runs on schedule without errors
- [ ] TTLs are enforced (cached entries expire)
- [ ] Redis failure doesn't crash the app (graceful fallback)

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `feat: configure redis client` | Config | Upstash Redis setup |
| `feat: implement cache service` | Service | Generic get/set/invalidate |
| `feat: implement distributed rate limiter` | Middleware | Redis-backed sliding window |
| `feat: add api response caching` | Middleware | Cache GET responses |
| `feat: add ai response caching` | Service | Cache AI responses in Redis |
| `feat: setup bullmq job queue` | Jobs | Queue + audit log processor |
| `feat: add cache warm job` | Jobs | Periodic cache warming |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Configure Redis client | 1 |
| Implement cache service | 3 |
| Implement distributed rate limiter | 4 |
| Add API response caching middleware | 2 |
| Add AI response caching | 2 |
| Setup BullMQ job queue | 3 |
| Implement audit log processor | 2 |
| **Total** | **17 hours (~2 days)** |

---

## Phase 9: Security

**Week:** 7  
**Effort:** 2 days  
**Dependencies:** Phase 3, Phase 8  

### Goal

Harden the application with Arcjet, Helmet, input sanitization, and comprehensive security testing.

### Deliverables

1. Arcjet integration (bot detection, shield, SQLi/XSS)
2. Helmet security headers
3. CORS hardening
4. Input sanitization middleware
5. Security headers audit
6. Penetration test script

### Files to Create

```
apps/backend/src/
├── config/
│   ├── arcjet.ts                          # Arcjet configuration
│   └── helmet.ts                          # Helmet configuration
├── middleware/
│   └── arcjet.middleware.ts               # Arcjet security middleware
└── utils/
    └── sanitize.ts                        # XSS sanitization
```

### Arcjet Configuration

```typescript
// config/arcjet.ts
//
// Arcjet provides:
// 1. Bot Detection: Block automated traffic (scrapers, crawlers)
//    - Allow legitimate search engines (Google, Bing)
//    - Block known bad bots
//    - Custom allow/block lists
//
// 2. Shield: Detect and block common web attacks
//    - Path traversal attempts
//    - Parameter pollution
//    - Protocol violations
//
// 3. SQL Injection: Detect SQLi in query params and body
//    - Block requests containing SQL injection attempts
//    - Log blocked requests for analysis
//
// 4. XSS: Detect cross-site scripting attempts
//    - Block requests containing XSS payloads
//    - Sanitize reflected XSS in responses
//
// 5. Email Validation: Block disposable emails
//    - Reject sign-ups with temporary email domains
//    - Configurable allow/block domains
//
// Environment:
// - ARCJET_KEY: required in production
// - ARCJET_ENV: 'development' | 'production'
//
// Applied as global middleware:
// app.use(arcjetMiddleware);
```

### Helmet Configuration

```typescript
// config/helmet.ts
//
// Security headers applied:
//
// Content-Security-Policy:
//   default-src 'self'
//   script-src 'self' 'unsafe-inline' 'unsafe-eval'  (Next.js needs inline)
//   style-src 'self' 'unsafe-inline'                   (Tailwind needs inline)
//   img-src 'self' data: blob:                          (User avatars, charts)
//   font-src 'self' fonts.googleapis.com
//   connect-src 'self' api.brainify.app *.sentry.io
//   frame-ancestors 'none'
//
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
// X-XSS-Protection: 0                                      (redundant with CSP)
// Referrer-Policy: strict-origin-when-cross-origin
// Permissions-Policy:
//   geolocation=(), microphone=(), camera=(),
//   payment=(), usb=(), magnetometer=(), gyroscope=()
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Embedder-Policy: require-corp
```

### CORS Configuration

```typescript
// config/cors.ts
//
// Allowed origins:
//   Production: https://brainify.app, https://www.brainify.app
//   Staging:    https://*.vercel.app (preview deployments)
//   Dev:        http://localhost:3000
//
// Options:
//   origin: (origin, callback) => {
//     const allowed = [FRONTEND_URL, ...PREVIEW_DOMAINS]
//     if (!origin || allowed.includes(origin)) callback(null, true)
//     else callback(new Error('Not allowed by CORS'))
//   }
//   credentials: true
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
//   allowedHeaders: ['Content-Type', 'Authorization']
//   exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
//   maxAge: 86400
```

### Input Sanitization

```typescript
// utils/sanitize.ts
//
// Sanitize user input before dangerous operations:
//
// 1. API responses (content that includes user input):
//    - Strip <script>, <iframe>, <object>, <embed> tags
//    - Remove on* event handlers (onclick, onload, onerror, etc.)
//    - Encode HTML entities (&, <, >, ", ')
//
// 2. AI responses (Gemini/OpenAI output):
//    - Same sanitization as above
//    - Used before dangerouslySetInnerHTML
//
// 3. Input validation (via Zod):
//    - Strip leading/trailing whitespace
//    - Normalize Unicode
//    - Reject null bytes
//    - Limit string lengths (already in Zod schemas)
```

### Acceptance Criteria

- [ ] Arcjet blocks known bot traffic (test with curl -A "BadBot")
- [ ] Arcjet blocks SQL injection attempts in query params
- [ ] Arcjet blocks XSS attempts in request body
- [ ] Arcjet blocks disposable email domains on sign-up
- [ ] Helmet headers present in all responses (verify via curl -I)
- [ ] Content-Security-Policy prevents inline script execution (except Next.js)
- [ ] Strict-Transport-Security header present in production
- [ ] CORS blocks requests from unauthorized origins
- [ ] CORS allows requests from FRONTEND_URL
- [ ] XSS sanitization strips script tags from user content
- [ ] Rate limiting applied globally (Phase 8) with correct tiers
- [ ] All Zod validation schemas reject invalid input
- [ ] Security headers pass Mozilla Observatory test (score A+)
- [ ] No sensitive data leaked in error responses (stack traces hidden)
- [ ] All passwords are hashed (verified in DB dump)

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `feat: integrate arcjet security` | Backend | Bot detection, shield, SQLi/XSS |
| `feat: configure helmet security headers` | Backend | CSP, HSTS, permissions |
| `feat: harden cors configuration` | Backend | Strict origin validation |
| `feat: implement input sanitization` | Backend | XSS sanitizer utility |
| `test: add security penetration tests` | Tests | Automated security testing |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Integrate Arcjet | 3 |
| Configure Helmet | 1 |
| Harden CORS | 1 |
| Implement input sanitization | 2 |
| Security testing + verification | 3 |
| **Total** | **10 hours (~1.5 days)** |

---

## Phase 10: Docker

**Week:** 7-8  
**Effort:** 2 days  
**Dependencies:** Phase 1  

### Goal

Containerize the application with multi-stage Dockerfiles and Docker Compose for development and production environments.

### Deliverables

1. Multi-stage Dockerfile (deps → builder → runner)
2. Docker Compose for development
3. Docker Compose for production
4. .dockerignore
5. Health check configuration
6. Development and production scripts

### Files to Create

```
docker/
├── Dockerfile                           # Multi-stage build
├── docker-compose.dev.yml               # Dev infrastructure
├── docker-compose.prod.yml              # Production stack
└── .dockerignore                        # Docker ignore rules
```

### Dockerfile Stages

```dockerfile
# STAGE 1: deps
# Purpose: Install ALL dependencies (including dev)
# Base: node:20-alpine
# Cache: package-lock.json + node_modules
# Used for: development hot-reload

# STAGE 2: builder
# Purpose: Build TypeScript → JavaScript
# Base: deps stage
# Output: dist/ directories for all packages
# Used for: production build

# STAGE 3: runner
# Purpose: Production runtime
# Base: node:20-alpine
# User: appuser (non-root, UID 1001)
# Health check: GET /health every 30s
# Port: 8080
# CMD: node apps/backend/dist/server.js
```

### Development Docker Compose Services

| Service | Image | Ports | Purpose |
|---------|-------|-------|---------|
| `postgres` | postgres:16-alpine | 5432 | Local PostgreSQL |
| `redis` | redis:7-alpine | 6379 | Local Redis |
| `app` | Build from Dockerfile (deps target) | 8080 | Backend with hot-reload |

### Production Docker Compose Services

| Service | Config | Purpose |
|---------|--------|---------|
| `app` | Build from Dockerfile (runner target) | Production backend |
| - | Resource limits: 1 CPU, 512MB RAM | Prevent resource exhaustion |
| - | Restart: unless-stopped | Self-healing |
| - | Logging: json-file, 10MB max, 3 files | Log rotation |
| - | Health check: 30s interval, 3 retries | Monitoring |

### Acceptance Criteria

- [ ] `docker build -t brainify .` succeeds (all 3 stages)
- [ ] Final image runs as non-root user (UID 1001)
- [ ] Final image size < 200MB
- [ ] `docker compose -f docker/docker-compose.dev.yml up -d` starts all services
- [ ] PostgreSQL container passes health check
- [ ] Redis container passes health check
- [ ] Backend container passes health check (`GET /health` returns 200)
- [ ] Hot reload works in development (change file → restart)
- [ ] `docker compose -f docker/docker-compose.prod.yml up -d` starts production stack
- [ ] Production container has resource limits applied
- [ ] Production container has restart policy
- [ ] Log rotation works (verify log files rotate)
- [ ] `.dockerignore` excludes node_modules, .git, .env
- [ ] `scripts/dev.sh` and `scripts/prod.sh` are executable
- [ ] `npm run dev` works without Docker (for simple development)

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `feat: create multi-stage dockerfile` | Docker | deps → builder → runner |
| `feat: create dev docker compose` | Docker | PostgreSQL + Redis + app |
| `feat: create prod docker compose` | Docker | Production with resource limits |
| `feat: add dev and prod scripts` | Scripts | dev.sh, prod.sh |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Create multi-stage Dockerfile | 3 |
| Create dev Docker Compose | 2 |
| Create prod Docker Compose | 2 |
| Create startup scripts | 1 |
| **Total** | **8 hours (1 day)** |

---

## Phase 11: CI/CD

**Week:** 8  
**Effort:** 3 days  
**Dependencies:** Phase 10  

### Goal

Implement comprehensive CI/CD pipeline with GitHub Actions for linting, testing, building, security scanning, and deployment.

### Deliverables

1. Lint workflow
2. Type Check workflow
3. Test workflow
4. Build workflow
5. Docker Build workflow
6. Security Scan workflow
7. Deploy workflow
8. Branch protection rules

### Files to Create

```
.github/
└── workflows/
    ├── lint.yml                          # ESLint + Prettier
    ├── type-check.yml                    # tsc --noEmit
    ├── test.yml                          # Vitest (with PG + Redis services)
    ├── build.yml                         # npm run build
    ├── docker-build.yml                  # Docker build + push
    ├── security-scan.yml                 # Trivy vulnerability scan
    └── deploy.yml                        # Railway + Vercel deploy
```

### Workflow Details

| Workflow | Trigger | Jobs | Time |
|----------|---------|------|------|
| **Lint** | push/PR to main | ESLint, Prettier check | 2 min |
| **Type Check** | push/PR to main | tsc --noEmit on all workspaces | 3 min |
| **Test** | push/PR to main | Vitest with PG + Redis services | 5 min |
| **Build** | push/PR to main | Build all packages | 4 min |
| **Docker Build** | push to main, tags | Buildx, push to DockerHub | 6 min |
| **Security Scan** | push to main, weekly Mon | Trivy filesystem scan | 3 min |
| **Deploy** | push to main | Railway (backend) → Vercel (frontend) | 8 min |

### Branch Protection Rules

```
Branch: main
───────────────────────────────────
✔ Require pull request before merging
  - Required approvals: 1
  - Dismiss stale reviews: yes
✔ Require status checks (all must pass)
  - Lint
  - Type Check
  - Test
  - Build
  - Security Scan
✔ Require branches to be up to date
✔ Do not allow bypassing
✔ Linear history (no merge commits)
```

### Acceptance Criteria

- [ ] Lint workflow runs on push/PR to main
- [ ] Type Check workflow catches TypeScript errors
- [ ] Test workflow runs Vitest with PostgreSQL + Redis services
- [ ] Build workflow produces production bundles
- [ ] Docker Build workflow builds and pushes to DockerHub
- [ ] Security Scan runs Trivy and uploads SARIF results
- [ ] Deploy workflow deploys backend to Railway
- [ ] Deploy workflow deploys frontend to Vercel
- [ ] All workflows show green checkmark on PR
- [ ] Failed workflow blocks PR merge
- [ ] Branch protection rules enforced
- [ ] Deploy workflow runs only on main branch pushes
- [ ] Docker Build runs only on main pushes and version tags
- [ ] Security Scan runs on schedule (weekly)
- [ ] Test workflow is fastest possible (cached dependencies)

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `ci: add lint workflow` | CI | ESLint + Prettier checks |
| `ci: add type check workflow` | CI | TypeScript compilation check |
| `ci: add test workflow` | CI | Vitest with services |
| `ci: add build workflow` | CI | Production build |
| `ci: add docker build workflow` | CI | Buildx + push |
| `ci: add security scan workflow` | CI | Trivy vulnerability scanner |
| `ci: add deploy workflow` | CI | Railway + Vercel deployment |
| `chore: configure branch protection` | Repo | Branch rules |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Create lint workflow | 1 |
| Create type check workflow | 1 |
| Create test workflow | 3 |
| Create build workflow | 1 |
| Create Docker build workflow | 2 |
| Create security scan workflow | 1 |
| Create deploy workflow | 3 |
| Configure branch protection | 1 |
| **Total** | **13 hours (~1.5 days)** |

---

## Phase 12: Production Deployment

**Week:** 8-9  
**Effort:** 3 days  
**Dependencies:** Phase 9, Phase 10, Phase 11  

### Goal

Deploy the complete application to production, configure all services, run V1 data migration, and verify everything works end-to-end.

### Deliverables

1. Railway project configured (backend)
2. Vercel project configured (frontend)
3. Neon PostgreSQL database provisioned
4. Upstash Redis instance provisioned
5. Environment variables configured in all services
6. Custom domains configured (brainify.app, api.brainify.app)
7. SSL certificates provisioned (automatic via Railway/Vercel)
8. V1 data migration script executed
9. Production smoke tests passed
10. Monitoring dashboards verified

### Deployment Configuration

```markdown
# Railway (Backend)
- Service: brainify-api
- Build: docker/Dockerfile (runner target)
- Port: 8080
- Domains: api.brainify.app
- Environment variables:
  - NODE_ENV: production
  - DATABASE_URL: (Neon connection string)
  - REDIS_URL: (Upstash connection string)
  - JWT_ACCESS_SECRET: (generated, min 32 chars)
  - JWT_REFRESH_SECRET: (generated, min 32 chars)
  - GEMINI_API_KEY: (from Google AI Studio)
  - OPENAI_API_KEY: (from OpenAI)
  - ARCJET_KEY: (from Arcjet dashboard)
  - SENTRY_DSN: (from Sentry project)
  - FRONTEND_URL: https://brainify.app
  - LOG_LEVEL: info

# Vercel (Frontend)
- Project: brainify
- Framework: Next.js
- Root directory: apps/web
- Build command: npm run build
- Domains: brainify.app, www.brainify.app
- Environment variables:
  - NEXT_PUBLIC_API_URL: https://api.brainify.app

# Neon (Database)
- Project: brainify-prod
- Region: ap-south-1 (Mumbai)
- Compute: 0.25 vCPU, 1GB RAM (auto-suspend after 5 min idle)
- Branch: main (production)

# Upstash (Redis)
- Database: brainify-prod
- Region: ap-south-1 (Mumbai)
- Eviction: allkeys-lru
- Max connections: 1000
```

### V1 Data Migration Script

```typescript
// scripts/migrate-v1-data.ts
//
// Steps:
// 1. Connect to V1 MongoDB
// 2. Count total users (for progress tracking)
// 3. Batch process users (100 at a time):
//    a. Read user document
//    b. Transform to V2 schema:
//       - _id → id (keep as UUID string)
//       - username → name (migration mapping)
//       - password → password_hash (preserve existing hash)
//       - varkPreference → assessments entry (type: 'vark')
//       - brainScore → assessments entry (type: 'brain')
//       - dailyActivity → daily_activities entries
//       - totalSessions → study_sessions summary
//    c. Insert into PostgreSQL via Drizzle
//    d. Log progress
// 4. Verify counts match (MongoDB count vs PostgreSQL count)
// 5. Generate migration report:
//    - Total users migrated
//    - Total assessments migrated
//    - Total activity entries migrated
//    - Errors (if any)
//    - Duration
// 6. Dry-run mode: --dry-run flag for testing
//
// Safety:
// - Idempotent: checks for existing IDs before insert
// - Rollback: logs all inserted IDs for reverse mapping
// - Validation: validates each record before insert
```

### Production Smoke Tests

```markdown
# Pre-Deployment Verification
- [ ] All CI/CD checks passing
- [ ] Database migrations reviewed and tested
- [ ] Environment variables configured in Railway
- [ ] Environment variables configured in Vercel
- [ ] Neon database created with SSL
- [ ] Upstash Redis created with TLS
- [ ] Arcjet key configured
- [ ] Sentry project created
- [ ] Custom domains configured

# Post-Deployment Smoke Tests
- [ ] https://api.brainify.app/health returns 200 with all services healthy
- [ ] https://brainify.app loads in browser
- [ ] User registration works end-to-end
- [ ] User login works end-to-end
- [ ] Token refresh works (wait 15 min, verify still logged in)
- [ ] VARK assessment submission works
- [ ] Brain quiz submission works
- [ ] Results page loads with correct scores
- [ ] AI Study Buddy chat works
- [ ] Smart Search returns Wikipedia-sourced results
- [ ] Dashboard shows real data
- [ ] Analytics page renders charts
- [ ] Dark mode toggle works
- [ ] Mobile responsive layout works
- [ ] Rate limiting blocks excessive requests (429 received)
- [ ] CORS blocks unauthorized origins
- [ ] Sentry captures errors (test by triggering 500)
- [ ] Winston logs are being written (check Railway logs)
- [ ] PWA manifest loads (check Lighthouse)
- [ ] Lighthouse score > 80 for performance, > 90 for accessibility

# Rollback Plan
1. Railway: Click "Rollback" to previous deployment
2. Vercel: Deploy previous production deployment
3. Database: Restore from Neon point-in-time backup
4. DNS: Point to old infrastructure if needed
```

### Post-Deployment Monitoring

```markdown
# First 24 Hours
- Monitor Railway dashboard for CPU/memory spikes
- Check Sentry for any errors
- Verify log volume is reasonable
- Confirm all background jobs are processing

# First Week
- Review user sign-up analytics
- Monitor AI API costs
- Check rate limit hit rates
- Verify cache hit ratios
- Review performance metrics

# Ongoing
- Weekly security scan results review
- Monthly dependency updates
- Quarterly architecture review
- Continuous monitoring via Sentry alerts
```

### Acceptance Criteria

- [ ] All production services are running and healthy
- [ ] `GET /health` returns healthy status for DB, Redis, AI
- [ ] User registration + login works in production
- [ ] All 26 V1 features are functional in V2
- [ ] V1 data migration completes with zero data loss
- [ ] SSL certificates are valid (no browser warnings)
- [ ] Domain (brainify.app) resolves to Vercel deployment
- [ ] API domain (api.brainify.app) resolves to Railway deployment
- [ ] PWA manifest loads, service worker registers
- [ ] Lighthouse scores: Performance > 80, Accessibility > 90
- [ ] Sentry receives error events (tested)
- [ ] Winston logs are available in Railway dashboard
- [ ] Rollback plan is documented and tested
- [ ] All CI/CD workflows pass
- [ ] Branch protection rules are enforced

### Git Commit Milestones

| Commit | Scope | Description |
|--------|-------|-------------|
| `chore: add production env example` | Config | Production env template |
| `feat: add v1 data migration script` | Scripts | MongoDB → PostgreSQL |
| `chore: configure railway and vercel` | Infra | Platform configuration docs |
| `docs: add deployment checklist` | Docs | Deployment verification steps |
| `chore: update readme with production urls` | Docs | README update |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Configure Railway + Vercel projects | 3 |
| Provision Neon + Upstash | 1 |
| Configure custom domains + SSL | 2 |
| Deploy first production build | 2 |
| Run V1 data migration | 3 |
| Execute smoke tests | 3 |
| Monitor post-deployment | 2 |
| **Total** | **16 hours (2 days)** |

---

## Full Project Summary

### Timeline by Phase

```
Week 1:    Phase 1 (Foundation)           ████████░░░░░░░░░░░░
Week 1-2:  Phase 2 (Database)             ░░░░████░░░░░░░░░░░░
Week 2:    Phase 3 (Authentication)       ░░░░░░░░████░░░░░░░░
Week 3:    Phase 4 (Frontend Foundation)  ░░░░░░░░░░░████░░░░
Week 3-4:  Phase 5 (Assessments)          ░░░░░░░░░░░░░████░░
Week 4-5:  Phase 6 (Dashboard)            ░░░░░░░░░░░░░░████░░
Week 5-6:  Phase 7 (AI Layer)             ░░░░░░░░░░░░░░░░████
Week 6-7:  Phase 8 (Redis)               ░░░░░░░░░░░░░░░░░░██
Week 7:    Phase 9 (Security)             ░░░░░░░░░░░░░░░░░░░░
Week 7-8:  Phase 10 (Docker)             ░░░░░░░░░░░░░░░░░░░░
Week 8:    Phase 11 (CI/CD)              ░░░░░░░░░░░░░░░░░░░░
Week 8-9:  Phase 12 (Production)         ░░░░░░░░░░░░░░░░░░░░

Total: 9-10 weeks (1 developer full-time)
```

### Cumulative Effort

| Phase | Hours | Days | Cumulative |
|-------|-------|------|------------|
| 1. Foundation | 24 | 3.0 | 3.0 |
| 2. Database | 22 | 2.8 | 5.8 |
| 3. Authentication | 24 | 3.0 | 8.8 |
| 4. Frontend Foundation | 30 | 3.8 | 12.5 |
| 5. Assessments | 27 | 3.4 | 15.9 |
| 6. Dashboard | 32 | 4.0 | 19.9 |
| 7. AI Layer | 35 | 4.4 | 24.3 |
| 8. Redis | 17 | 2.1 | 26.4 |
| 9. Security | 10 | 1.3 | 27.6 |
| 10. Docker | 8 | 1.0 | 28.6 |
| 11. CI/CD | 13 | 1.6 | 30.3 |
| 12. Production | 16 | 2.0 | 32.3 |

**Total: ~260 hours (32 working days, ~6.5 weeks with buffer)**

### Risk Factors

| Factor | Impact | Mitigation |
|--------|--------|------------|
| **Developer unfamiliar with Drizzle** | Phase 2 may take longer | Allocate extra day for Drizzle learning curve |
| **Next.js 15 App Router nuances** | Phase 4 may have hiccups | Start with simple pages, add complexity iteratively |
| **AI provider API changes** | Phase 7 regression | Abstracted layer isolates changes; fallback provider |
| **Redis learning curve** | Phase 8 may be underestimated | Start with simple caching before rate limiting |
| **V1 data migration edge cases** | Phase 12 data issues | Extensive dry-run testing before live migration |
| **Concurrent 4x AI calls (all-styles)** | Rate limit / timeout issues | Add timeout handling, partial success response |

### Key Milestones

| Milestone | Phase | Date (target) | Verification |
|-----------|-------|---------------|-------------|
| ✅ Dev servers running | Phase 1 | Week 1 | `npm run dev` starts both servers |
| ✅ Database migrated + seeded | Phase 2 | Week 2 | `npm run db:studio` shows 13 tables |
| ✅ Auth working end-to-end | Phase 3 | Week 2 | Register → Login → Dashboard |
| ✅ Frontend with auth flow | Phase 4 | Week 3 | Login form → Dashboard redirect |
| ✅ VARK + Brain quizzes working | Phase 5 | Week 4 | Submit 16 questions → Get radar chart |
| ✅ Dashboard with real data | Phase 6 | Week 5 | Charts show live data from API |
| ✅ AI Study Buddy chat working | Phase 7 | Week 6 | Send message → Get VARK-adapted response |
| ✅ Redis caching + rate limiting | Phase 8 | Week 7 | Rate limit test returns 429 |
| ✅ Security hardened | Phase 9 | Week 7 | Observatory score A+ |
| ✅ Docker images building | Phase 10 | Week 8 | `docker build` produces <200MB image |
| ✅ CI/CD passing | Phase 11 | Week 8 | All workflow checks green |
| 🚀 Production deployment live | Phase 12 | Week 9 | https://brainify.app loads |

---

*This roadmap represents the complete implementation plan for Brainify v2. Each phase is designed to produce a deployable, testable increment. Phases can be parallelized with 2+ developers (e.g., Phase 2 + Phase 4 simultaneously). Total timeline assumes 1 developer full-time with no significant interruptions.*