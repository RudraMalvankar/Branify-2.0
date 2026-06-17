# Brainify v2 — Solo Developer MVP Implementation Roadmap

> **Document Version:** 1.1.0  
> **Date:** June 17, 2026  
> **Status:** Ready for Execution  
> **Target:** Solo Developer  
> **Total Estimated Effort:** 4–6 weeks (full-time)  
> **Total Estimated Files:** ~120

---

## Table of Contents

- [Phase 1: Project Foundation](#phase-1-project-foundation)
- [Phase 2: Database + Authentication](#phase-2-database--authentication)
- [Phase 3: VARK Assessment](#phase-3-vark-assessment)
- [Phase 4: Brain Assessment](#phase-4-brain-assessment)
- [Phase 5: Dashboard + Analytics](#phase-5-dashboard--analytics)
- [Phase 6: AI Study Buddy (Gemini)](#phase-6-ai-study-buddy-gemini)
- [Phase 7: Smart Search](#phase-7-smart-search)
- [Phase 8: Redis + Performance](#phase-8-redis--performance)
- [Phase 9: Security Hardening](#phase-9-security-hardening)
- [Phase 10: Docker + CI/CD](#phase-10-docker--cicd)
- [Phase 11: Production Deployment](#phase-11-production-deployment)

---

## Phase 1: Project Foundation

**Effort:** 3–4 days  
**Dependencies:** None  

### Goal

Initialize the monorepo structure, TypeScript configurations, developer tooling, and scaffold both backend (Express v5) and frontend (Next.js 15) skeletons.

### Deliverables

1. Root monorepo with Turborepo + npm workspaces
2. TypeScript base config + per-app configs
3. ESLint + Prettier configurations
4. Shared package (types, validations, constants)
5. Environment validation with Zod
6. Winston + Morgan logger setup
7. Express v5 app skeleton (health check, error handler, CORS)
8. Next.js 15 app skeleton (root layout, Tailwind, Shadcn UI)
9. Dark mode theme provider
10. Root npm scripts + Husky pre-commit hooks

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
│           │   ├── api.ts
│           │   ├── user.ts
│           │   └── index.ts
│           ├── validations/
│           │   ├── auth.ts
│           │   └── common.ts
│           └── constants/
│               ├── vark.ts
│               ├── brain.ts
│               ├── roles.ts
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
│           ├── providers/
│           │   └── theme-provider.tsx    # Dark/light mode
│           ├── app/
│           │   ├── layout.tsx            # Root layout
│           │   ├── page.tsx              # Landing placeholder
│           │   ├── not-found.tsx         # 404 page
│           │   └── error.tsx             # Error boundary
│           ├── lib/
│           │   └── utils.ts              # cn(), formatDate()
│           └── styles/
│               ├── globals.css
│               └── shadcn.css
│
└── scripts/
    └── dev.sh                            # Dev startup script
```

### Acceptance Criteria

- [ ] `npm run dev` starts both backend (port 8080) and frontend (port 3000)
- [ ] `GET /health` returns `{ success: true, data: { status: "healthy" } }`
- [ ] `GET /` on frontend renders the landing placeholder
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run format:check` passes with zero errors
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run build` produces production bundles
- [ ] Missing env vars cause startup failure with clear error
- [ ] Winston logs structured JSON to console
- [ ] Morgan HTTP logs piped through Winston
- [ ] Husky pre-commit hook runs lint-staged
- [ ] Dark mode toggle works and persists

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `chore: initialize monorepo with turborepo` | Root configs |
| `chore: configure typescript, eslint, prettier` | TS, ESLint, Prettier, Husky |
| `feat: create shared package` | Types, validations, constants |
| `feat: scaffold backend with express v5` | Server, app, config, error handler |
| `feat: scaffold frontend with next.js 15` | App router, layout, Tailwind, Shadcn |
| `feat: add dark mode theme provider` | Theme provider, toggle |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Initialize monorepo + configs | 2 |
| TypeScript + ESLint + Prettier + Husky | 2 |
| Create shared package | 3 |
| Scaffold backend (Express v5) | 5 |
| Scaffold frontend (Next.js 15 + Shadcn) | 6 |
| Dev scripts + env validation | 2 |
| **Total** | **20 hours (~3 days)** |

---

## Phase 2: Database + Authentication

**Effort:** 4–5 days  
**Dependencies:** Phase 1  

### Goal

Set up PostgreSQL with Drizzle ORM, create the 6 MVP database tables, implement the complete authentication system (sign-up, sign-in, sign-out, refresh tokens), and create auth routes/controllers/services.

### Deliverables

1. Drizzle ORM + Neon PostgreSQL configuration
2. 6 table schemas (users, profiles, assessments, study_sessions, ai_conversations, ai_messages, refresh_tokens)
3. Migration files generated
4. Repository layer (4 repositories)
5. Auth service (sign-up, sign-in, sign-out, refresh)
6. Token service (JWT generation, verification, rotation)
7. Password service (bcrypt hashing)
8. Auth middleware (authenticate + authorize)
9. Auth routes with Zod validation
10. HTTP-only cookie management
11. In-memory rate limiting
12. Profile routes (GET/PUT /me)

### Files to Create

```
apps/backend/src/
├── config/
│   └── database.ts                       # Drizzle + Neon config
├── models/
│   ├── schema/
│   │   ├── users.ts                      # Users table
│   │   ├── profiles.ts                   # Profiles table
│   │   ├── assessments.ts               # Assessments table
│   │   ├── study-sessions.ts             # Study sessions table
│   │   ├── ai-conversations.ts           # AI conversations table
│   │   ├── ai-messages.ts                # AI messages table
│   │   └── refresh-tokens.ts             # Refresh tokens table
│   ├── relations.ts                      # Drizzle relations
│   └── index.ts                          # Schema barrel export
├── repositories/
│   ├── user.repository.ts
│   ├── assessment.repository.ts
│   ├── session.repository.ts
│   ├── token.repository.ts
│   └── index.ts
├── controllers/
│   └── auth.controller.ts
├── services/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── token.service.ts
│   │   └── password.service.ts
│   └── index.ts
├── routes/
│   ├── index.ts
│   ├── auth.routes.ts
│   └── profile.routes.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validate.middleware.ts
│   └── rate-limit.middleware.ts
├── validations/
│   └── auth.validation.ts
├── config/
│   └── cors.ts
├── utils/
│   └── response.ts                       # Already created in Phase 1
│
└── drizzle/
    ├── migrations/                       # Auto-generated
    └── config.ts                         # Drizzle Kit config
```

### Database Schema (6 Tables)

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `users` | id, name, email, password_hash, visual, aural, read_write, kinesthetic, vark_preference, brain_score, brain_type, total_sessions, streak_days, last_active, role | Denormalized VARK/brain scores for fast reads |
| `profiles` | id, user_id, bio, avatar_url, timezone | 1:1 with users |
| `assessments` | id, user_id, type, scores (JSONB), result, note | Each attempt = 1 row |
| `study_sessions` | id, user_id, type, duration_mins, started_at | Activity tracking |
| `ai_conversations` | id, user_id, title, style, message_count | Chat history |
| `ai_messages` | id, conv_id, role, content | Individual messages |
| `refresh_tokens` | id, user_id, token_hash, expires_at, is_revoked | Token rotation |

### Authentication Endpoints

```
POST /api/auth/sign-up     → 201 + Set-Cookie (access_token, refresh_token)
POST /api/auth/sign-in     → 200 + Set-Cookie
POST /api/auth/sign-out    → 200 + clear cookies
POST /api/auth/refresh     → 200 + new tokens (token rotation)
GET  /api/profile/me       → 200 + user profile
PUT  /api/profile/me       → 200 + updated profile
```

### Acceptance Criteria

- [ ] `npm run db:generate` creates migration files
- [ ] `npm run db:migrate` applies all 7 tables to Neon PostgreSQL
- [ ] Repository methods return typed results
- [ ] `POST /api/auth/sign-up` creates user, returns 201 + Set-Cookie
- [ ] `POST /api/auth/sign-up` returns 409 for duplicate email
- [ ] `POST /api/auth/sign-in` returns 200 + Set-Cookie
- [ ] `POST /api/auth/sign-in` returns 401 for invalid credentials
- [ ] `POST /api/auth/sign-out` clears cookies and revokes token
- [ ] `POST /api/auth/refresh` returns new token pair (rotation)
- [ ] Token reuse detection: revoked token usage revokes ALL user tokens
- [ ] Auth middleware rejects requests without valid token (401)
- [ ] Rate limiter enforces 5/min for auth, 10/min for authenticated
- [ ] `GET /api/profile/me` returns full profile
- [ ] `PUT /api/profile/me` updates name and bio
- [ ] Cookies are httpOnly, secure (production), sameSite=strict

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `feat: configure drizzle orm with neon` | Database config |
| `feat: create mvp table schemas (7 tables)` | All schemas + relations |
| `feat: implement repository layer` | 4 repositories |
| `feat: implement password and token services` | bcrypt + JWT |
| `feat: implement auth service` | Sign-up, sign-in, sign-out, refresh |
| `feat: create auth routes and controller` | Routers + validation |
| `feat: implement auth middleware and rate limiter` | Auth guard, RBAC, rate limit |
| `feat: create profile routes` | GET/PUT /me |
| `feat: generate initial migrations` | Drizzle migrations |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Configure Drizzle + Neon | 2 |
| Create 7 table schemas + relations | 4 |
| Implement 4 repository classes | 3 |
| Implement password + token services | 3 |
| Implement auth service | 4 |
| Implement auth controller + routes | 2 |
| Implement auth middleware + rate limiter | 2 |
| Implement profile routes | 1 |
| Generate + test migrations | 1 |
| **Total** | **22 hours (~3 days)** |

---

## Phase 3: VARK Assessment

**Effort:** 3–4 days  
**Dependencies:** Phase 2  

### Goal

Implement the VARK assessment engine (16-question, multi-select scoring). Build the frontend quiz page with progress tracking, results page with radar chart, and assessment API endpoints.

### Deliverables

1. VARK scoring service (port from V1 logic)
2. Assessment controller + routes
3. VARK quiz page (16 questions, one at a time, multi-select)
4. Results page (radar chart + score breakdown + certificate)
5. VARK seed data (16 questions from V1)
6. Zod validation schemas for assessment answers

### Files to Create

```
apps/backend/src/
├── controllers/
│   └── assessment.controller.ts          # submitVark, retake
├── services/
│   └── assessment/
│       └── vark.service.ts               # VARK scoring logic
├── routes/
│   └── assessment.routes.ts              # POST /vark, /retake
├── validations/
│   └── assessment.validation.ts          # Answer schemas
├── utils/
│   └── constants.ts                      # VARK constants
│
└── drizzle/seed/
    ├── vark-questions.ts                 # 16 VARK questions
    └── index.ts                          # Seed runner
```

```
apps/web/src/
├── app/
│   └── (quiz)/
│       ├── layout.tsx                    # Minimal quiz layout
│       ├── questions/
│       │   └── page.tsx                  # VARK quiz flow
│       └── results/
│           └── page.tsx                  # Results + radar chart
├── components/
│   └── quiz/
│       ├── vark-question.tsx             # Multi-select question card
│       ├── progress-bar.tsx              # Question progress indicator
│       └── results-chart.tsx             # Radar chart (Recharts)
├── services/
│   └── assessment.service.ts             # submitVark, retake
└── store/
    └── auth.store.ts                     # Extended: persist VARK results
```

### VARK Scoring Logic

```
Input:  16 questions, each with multi-select answers (options 1-4)
Mapping: option1 → Kinesthetic, option2 → Aural, option3 → Read/Write, option4 → Visual
Output:  { visual: N, aural: N, readWrite: N, kinesthetic: N }
         preference: highest-scoring style
         tie-break: [Visual, Aural, Read/Write, Kinesthetic] order
```

### Acceptance Criteria

- [ ] `POST /api/assessment/vark` returns correct VARK scores matching V1
- [ ] `POST /api/assessment/retake` resets all scores to 0
- [ ] VARK quiz page shows 16 questions one at a time
- [ ] Multi-select works (checkboxes per option)
- [ ] Progress bar updates as user progresses
- [ ] Results page displays radar chart (Recharts)
- [ ] Results page shows score breakdown (visual, aural, read/write, kinesthetic)
- [ ] Results page has "Download Certificate" button
- [ ] Results page has "Retake" button
- [ ] Loading states during submission
- [ ] Zod validation rejects invalid answer format
- [ ] VARK scores persisted to users table (denormalized)

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `feat: add vark seed questions` | Seed data from V1 |
| `feat: implement vark scoring service` | Scoring logic |
| `feat: create assessment routes and controller` | API endpoints |
| `feat: create vark quiz page` | Multi-select quiz flow |
| `feat: create results page with radar chart` | Results + Recharts |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Implement VARK scoring service | 3 |
| Create assessment routes + controller | 2 |
| Add VARK seed data | 1 |
| Create VARK quiz page | 6 |
| Create results page with Recharts | 5 |
| **Total** | **17 hours (~2 days)** |

---

## Phase 4: Brain Assessment

**Effort:** 2–3 days  
**Dependencies:** Phase 2  

### Goal

Implement the Brain Dominance assessment (21 A/B questions). Build quiz page, integrate results into the existing results page.

### Deliverables

1. Brain dominance scoring service (port from V1)
2. Brain quiz page (21 A/B choices)
3. Results page extension (brain score + type display)
4. Brain seed data (21 questions from V1)

### Files to Create

```
apps/backend/src/
├── services/
│   └── assessment/
│       └── brain.service.ts              # Brain scoring logic
│
└── drizzle/seed/
    └── brain-questions.ts               # 21 brain questions
```

```
apps/web/src/
├── app/
│   └── (quiz)/
│       └── brain-quiz/
│           └── page.tsx                  # Brain quiz flow (21 questions)
└── components/
    └── quiz/
        └── brain-question.tsx            # A/B choice card
```

### Brain Scoring Logic

```
Input:  21 A/B choices (group_a through group_u)
Correct answers: hardcoded map (same as V1)
Scoring: count matches → score 0-21
Type:
   0-5:   Strong Left Brain
   6-8:   Moderate Left Brain
   9-13:  Balanced Brain
   14-16: Moderate Right Brain
   17-21: Strong Right Brain
```

### Acceptance Criteria

- [ ] `POST /api/assessment/brain` returns correct score matching V1
- [ ] Brain quiz shows 21 A/B choices one at a time
- [ ] Single-select per question (A or B)
- [ ] Progress bar updates as user progresses
- [ ] Results page displays brain score + type
- [ ] Results shows left/right brain visualization
- [ ] Both VARK + Brain results shown if both completed

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `feat: add brain seed questions` | Seed data from V1 |
| `feat: implement brain scoring service` | Scoring logic |
| `feat: create brain quiz page` | A/B choice quiz flow |
| `feat: extend results page with brain data` | Combined results |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Implement Brain scoring service | 2 |
| Add brain seed data | 1 |
| Create brain quiz page | 4 |
| Extend results page | 2 |
| **Total** | **9 hours (~1.5 days)** |

---

## Phase 5: Dashboard + Analytics

**Effort:** 5–6 days  
**Dependencies:** Phase 3, Phase 4  

### Goal

Build the main dashboard, analytics page, learn hub, life skills hub, profile page, Pomodoro timer, and session logging. This is the largest frontend phase.

### Deliverables

1. Dashboard page (stats cards, radar, engagement chart)
2. Analytics page (30-day trends, retention, focus metrics)
3. Learn Hub (VARK-specific recommendations)
4. Life Skills Hub (6 categories with AI-generated lessons)
5. Profile settings page
6. Pomodoro timer (25/5/15 min)
7. Study session logging (auto + manual)
8. Activity/streak tracking

### Files to Create

```
apps/backend/src/
├── controllers/
│   ├── analytics.controller.ts           # Dashboard/analytics data
│   └── sessions.controller.ts            # Log study session
├── services/
│   ├── analytics.service.ts              # Aggregation queries
│   └── sessions.service.ts               # Session tracking + streak logic
├── routes/
│   ├── analytics.routes.ts               # GET /dashboard, /analytics
│   └── sessions.routes.ts               # POST /log
├── validations/
│   └── profile.validation.ts             # Profile update schema
│
└── config/
    └── database.ts                       # Extended: analytics queries
```

```
apps/web/src/
├── app/
│   └── (dashboard)/
│       ├── dashboard/
│       │   └── page.tsx                  # Main dashboard
│       ├── analytics/
│       │   └── page.tsx                  # Detailed analytics
│       ├── profile/
│       │   └── page.tsx                  # Profile settings
│       ├── learn/
│       │   └── [style]/
│       │       └── page.tsx              # VARK-specific learn hub
│       └── life-skills/
│           └── page.tsx                  # 6 categories hub
├── components/
│   ├── dashboard/
│   │   ├── welcome-banner.tsx
│   │   ├── stat-card.tsx
│   │   ├── engagement-chart.tsx          # Recharts line chart
│   │   ├── vark-radar.tsx                # Recharts radar
│   │   └── quick-actions.tsx
│   ├── layout/
│   │   ├── sidebar.tsx                   # Navigation sidebar
│   │   ├── topbar.tsx                    # Search, theme, avatar
│   │   └── dashboard-layout.tsx          # Layout wrapper
│   └── shared/
│       ├── loading-spinner.tsx
│       ├── error-state.tsx
│       └── empty-state.tsx
├── services/
│   ├── analytics.service.ts
│   └── profile.service.ts
├── store/
│   └── ui.store.ts                       # Sidebar state
└── hooks/
    ├── use-auth.ts
    ├── use-theme.ts
    ├── use-debounce.ts
    └── use-media-query.ts
```

### Dashboard Components

```
Dashboard layout:
┌────────────────────────────────────────────────────────┐
│  Welcome back, [name]!   [VARK Badge]  [Brain Badge]  │
├────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Sessions │ │  Streak  │ │  Hours   │ │  Brain   │ │
│  │    12    │ │   5 days │ │   8.5h   │ │ Balanced │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                        │
│  ┌─────────────────────────┐ ┌──────────────────────┐ │
│  │   Weekly Engagement     │ │   VARK Distribution  │ │
│  │   [Line Chart]          │ │   [Radar Chart]      │ │
│  └─────────────────────────┘ └──────────────────────┘ │
│                                                        │
│  Quick Actions:                                         │
│  [Start Study] [Take Quiz] [AI Buddy] [Learn Hub]      │
└────────────────────────────────────────────────────────┘
```

### Pomodoro Timer

```
- 25 min focus → 5 min break → 15 min long break
- SVG ring countdown animation
- Auto-logs session to backend (POST /api/sessions/log)
- Notification on timer completion
- Persistent across page navigation
```

### Acceptance Criteria

- [ ] Dashboard displays stat cards with real data
- [ ] Engagement chart shows 7-day activity trend
- [ ] VARK radar chart shows learning style breakdown
- [ ] Analytics page shows 30-day retention chart
- [ ] Analytics page shows focus time by day chart
- [ ] Learn Hub shows VARK-adapted resources
- [ ] Life Skills shows 6 categories with content
- [ ] Profile page loads + saves edits
- [ ] Pomodoro timer counts down 25/5/15 correctly
- [ ] Pomodoro auto-logs sessions to backend
- [ ] Session logging tracks streak correctly
- [ ] Streak resets if gap > 48 hours
- [ ] Sidebar navigation works on mobile + desktop
- [ ] Dark mode applies to all new components

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `feat: implement analytics service` | Aggregation queries |
| `feat: implement session tracking` | Log session + streak logic |
| `feat: create api services for analytics` | Frontend service layer |
| `feat: implement zustand stores and hooks` | Auth store, UI store, hooks |
| `feat: create dashboard layout` | Sidebar, topbar, mobile nav |
| `feat: create dashboard page` | Stats cards, charts, quick actions |
| `feat: create analytics page` | 30-day trends, Recharts |
| `feat: create learn hub page` | VARK-specific recommendations |
| `feat: create life skills page` | 6 categories hub |
| `feat: create profile settings page` | Edit form + save |
| `feat: implement pomodoro timer` | Timer + auto-log |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Implement analytics + session services | 4 |
| Create Zustand stores + hooks | 3 |
| Create dashboard layout | 4 |
| Create dashboard page | 5 |
| Create analytics page | 4 |
| Create learn hub page | 3 |
| Create life skills page | 3 |
| Create profile page | 2 |
| Implement Pomodoro timer | 4 |
| **Total** | **32 hours (~4 days)** |

---

## Phase 6: AI Study Buddy (Gemini)

**Effort:** 4–5 days  
**Dependencies:** Phase 2  

### Goal

Implement the AI Study Buddy chat feature using Gemini 2.0 Flash. Build VARK-adapted system prompts, conversation management, and the chat UI.

### Deliverables

1. Gemini service (direct API integration)
2. Prompt service (VARK-adapted system prompts)
3. Chat service (conversation orchestration)
4. AI controller + routes (POST /api/ai/chat)
5. AI conversation + message storage in DB
6. Chat UI page (full-page chat interface)
7. Style badge display in chat
8. Quick prompt buttons
9. Conversation history management

### Files to Create

```
apps/backend/src/
├── services/
│   └── ai/
│       ├── gemini.service.ts             # Gemini API client
│       ├── prompt.service.ts             # VARK-adapted prompts
│       └── chat.service.ts               # Conversation orchestration
├── controllers/
│   └── ai.controller.ts                  # POST /chat
├── routes/
│   └── ai.routes.ts                      # POST /api/ai/chat
├── validations/
│   └── ai.validation.ts                  # Chat message schema
└── utils/
    └── sanitize.ts                       # XSS sanitization
```

```
apps/web/src/
├── app/
│   └── (dashboard)/
│       └── study-buddy/
│           └── page.tsx                  # Full-page AI chat
├── components/
│   └── ai/
│       ├── chat-widget.tsx               # Main chat container
│       ├── chat-message.tsx              # Message bubble (user/AI)
│       ├── chat-input.tsx                # Input + send button
│       └── style-badge.tsx              # VARK style indicator
├── services/
│   └── ai.service.ts                     # Chat API calls
└── hooks/
    └── use-chat.ts                       # Chat state management
```

### VARK System Prompts

```
Visual:      "Use diagrams described in words, spatial analogies, tables,
              charts, 'imagine...', 'Visualize this as...'"

Auditory:    "Conversational tone, mnemonics, verbal analogies,
              'Listen to this...', 'Think of it as a rhythm...'"

Read/Write:  "Definitions, lists, summaries, notes-style headings,
              bullet points, 'The key points are...'"

Kinesthetic: "Real-world examples, step-by-step, 'Try this...',
              action verbs, practical applications, hands-on analogies"
```

### Chat UI Design

```
┌─────────────────────────────────────────────────────┐
│  Study Buddy  [Visual Learner Badge]  [New Chat ▼]  │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────┐     │
│  │  🤖 Hi! I'm your AI Study Buddy.            │     │
│  │  I adapt to your Visual learning style.      │     │
│  │  What would you like to learn today?         │     │
│  └─────────────────────────────────────────────┘     │
│                                                       │
│  Quick prompts:                                       │
│  [Explain photosynthesis] [Help with algebra]         │
│  [Summarize chapter] [Create study plan]              │
│                                                       │
│  ┌─────────────────────────────────────────────┐     │
│  │  🙋 Can you explain how batteries work?      │     │
│  └─────────────────────────────────────────────┘     │
│                                                       │
│  ┌─────────────────────────────────────────────┐     │
│  │  🤖 Imagine a battery as a tiny sandwich...  │     │
│  │  [Visual explanation with spatial analogy]    │     │
│  └─────────────────────────────────────────────┘     │
│                                                       │
│  ┌───────────────────────────────────────────┐       │
│  │  Type your message...              [Send] │       │
│  └───────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- [ ] `POST /api/ai/chat` returns Gemini response in user's VARK style
- [ ] Conversation history sent with each request (last 8 messages)
- [ ] System prompt adapts per VARK style (4 variants)
- [ ] Messages stored in ai_conversations + ai_messages tables
- [ ] Rate limit: 15 requests per minute
- [ ] Chat UI displays messages in proper order
- [ ] Style badge shows user's VARK type
- [ ] Quick prompts work (pre-filled messages)
- [ ] New Chat creates fresh conversation
- [ ] Conversation history persists across page refreshes
- [ ] Loading state shown during AI response
- [ ] Error handling for API failures (rate limit, downtime)
- [ ] XSS sanitization on user input
- [ ] Streaming response (optional MVP enhancement)

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `feat: implement gemini service` | Gemini API client |
| `feat: implement prompt service` | VARK-adapted system prompts |
| `feat: implement chat service` | Conversation orchestration |
| `feat: create ai routes and controller` | API endpoints |
| `feat: create study buddy chat page` | Chat UI with style badge |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Implement Gemini service | 4 |
| Implement prompt service | 3 |
| Implement chat service | 4 |
| Create AI routes + controller | 2 |
| Create chat UI page | 6 |
| **Total** | **19 hours (~2.5 days)** |

---

## Phase 7: Smart Search

**Effort:** 2–3 days  
**Dependencies:** Phase 2, Phase 6  

### Goal

Implement the Smart Search feature: Wikipedia lookup + Gemini reformatting in the user's VARK style, plus "All 4 Styles" compare mode.

### Deliverables

1. Search service (Wikipedia REST API + Gemini reformat)
2. Search controller + routes
3. Smart Search page (search bar + results)
4. "All 4 Styles" compare mode (4 parallel Gemini calls)
5. Wikipedia fallback to search API

### Files to Create

```
apps/backend/src/
├── services/
│   └── ai/
│       └── search.service.ts             # Wikipedia + Gemini search
├── controllers/
│   └── search.controller.ts              # POST /query, /all-styles
├── routes/
│   └── search.routes.ts                 # /api/search/*
├── validations/
│   └── search.validation.ts             # Query schema
```

```
apps/web/src/
├── app/
│   └── (dashboard)/
│       └── smart-search/
│           └── page.tsx                  # Search page
├── components/
│   └── ai/
│       └── search-results.tsx            # Search result display
└── services/
    └── search.service.ts                 # Search API calls
```

### Search Flow

```
1. User enters query: "photosynthesis"

2. POST /api/search/query
   ├── Try Wikipedia REST API: /api/rest_v1/page/summary/Photosynthesis
   │   ├── Success → extract title + extract + URL
   │   └── Fallback → Wikipedia Search API: /w/api.php?action=query&list=search
   │
   └── Inject Wikipedia content into Gemini prompt:
       "Here is factual content about photosynthesis from Wikipedia:
        [extract]. Reformat this for a Visual learner using diagrams,
        spatial analogies, and visual descriptions."

3. Response: VARK-adapted explanation

4. POST /api/search/all-styles (optional)
   ├── 4 parallel Gemini calls (Promise.all)
   │   ├── Visual prompt
   │   ├── Auditory prompt
   │   ├── Read/Write prompt
   │   └── Kinesthetic prompt
   └── Response: 4 explanations side by side
```

### Acceptance Criteria

- [ ] `POST /api/search/query` returns VARK-adapted response with Wikipedia context
- [ ] `POST /api/search/all-styles` returns 4 different style explanations
- [ ] Wikipedia API works with fallback to search API
- [ ] Smart Search page has search bar with submit
- [ ] Search results display styled explanation
- [ ] "Compare All 4 Styles" button triggers parallel mode
- [ ] All 4 styles rendered side by side (or scrollable tabs)
- [ ] Loading states shown during search
- [ ] Rate limited to 15/min
- [ ] Error handling for Wikipedia downtime

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `feat: implement search service` | Wikipedia + Gemini search |
| `feat: create search routes and controller` | /query, /all-styles |
| `feat: create smart search page` | Search bar + results |
| `feat: implement all-styles compare mode` | 4 parallel Gemini calls |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Implement search service | 4 |
| Create search routes + controller | 2 |
| Create Smart Search page | 4 |
| Implement all-styles compare UI | 2 |
| **Total** | **12 hours (~1.5 days)** |

---

## Phase 8: Redis + Performance

**Effort:** 2–3 days  
**Dependencies:** Phase 2  

### Goal

Add Redis caching to improve performance for expensive operations (AI responses, analytics aggregations, Wikipedia lookups). Implement distributed rate limiting.

### Deliverables

1. Upstash Redis client configuration
2. Cache service (generic get/set/invalidate)
3. AI response caching (1-hour TTL)
4. Wikipedia lookup caching (24-hour TTL)
5. Redis-backed rate limiting (replaces in-memory)
6. Cache invalidation on data updates

### Files to Create

```
apps/backend/src/
├── config/
│   └── redis.ts                          # Upstash Redis client
├── services/
│   └── cache.service.ts                  # Generic caching layer
└── middleware/
    └── rate-limit.middleware.ts           # Updated: Redis-backed
```

### Redis Key Naming

```
Cache keys:
  api:{method}:{path}:{user_id}
  ai:{model}:{prompt_hash}:{style}
  wiki:{query}

Rate limit keys:
  ratelimit:{tier}:{identifier}:{window}

TTL:
  API cache:     5 minutes
  AI cache:      1 hour
  Wikipedia:     24 hours
  Rate limit:    sliding window
```

### Acceptance Criteria

- [ ] Redis client connects successfully at startup
- [ ] `/health` endpoint reports Redis status
- [ ] Identical AI queries return cached response (faster)
- [ ] Wikipedia lookups cached for 24 hours
- [ ] Rate limiting works with Redis (distributed)
- [ ] Cache invalidated on profile/session updates
- [ ] Graceful degradation: Redis down → skip cache, fallback to in-memory rate limit

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `feat: configure upstash redis` | Redis client |
| `feat: implement cache service` | Generic caching |
| `feat: add ai and wiki caching` | Cache integration |
| `feat: implement redis-backed rate limiting` | Distributed rate limiter |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Configure Upstash Redis | 2 |
| Implement cache service | 3 |
| Add AI + Wikipedia caching | 2 |
| Implement Redis rate limiter | 3 |
| **Total** | **10 hours (~1.5 days)** |

---

## Phase 9: Security Hardening

**Effort:** 1–2 days  
**Dependencies:** Phase 2  

### Goal

Add Arcjet security layer (bot detection, SQLi/XSS shield), Sentry error tracking, CSP hardening, and XSS sanitization improvements.

### Deliverables

1. Arcjet middleware (bot detection + shield)
2. Sentry error tracking integration
3. Helmet CSP hardening
4. XSS sanitization improvements
5. Security headers audit

### Files to Create

```
apps/backend/src/
├── config/
│   └── arcjet.ts                         # Arcjet configuration
├── middleware/
│   └── arcjet.middleware.ts              # Arcjet security middleware
│
└── config/
    └── sentry.ts                         # Sentry configuration
```

### Acceptance Criteria

- [ ] Arcjet blocks known bot traffic
- [ ] Arcjet shield protects against common web attacks
- [ ] Sentry captures unhandled exceptions
- [ ] Sentry source maps uploaded
- [ ] CSP headers properly configured
- [ ] XSS sanitization strips script/iframe/object tags
- [ ] Security headers audited (SecurityHeaders.com score: A+)

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `feat: configure arcjet security` | Arcjet middleware |
| `feat: configure sentry error tracking` | Sentry integration |
| `feat: harden helmet csp and xss sanitization` | Security hardening |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Configure Arcjet | 3 |
| Configure Sentry | 2 |
| Harden security headers + XSS | 2 |
| **Total** | **7 hours (~1 day)** |

---

## Phase 10: Docker + CI/CD

**Effort:** 2–3 days  
**Dependencies:** Phase 1  

### Goal

Containerize the application with Docker, set up GitHub Actions CI/CD pipeline, and configure development infrastructure.

### Deliverables

1. Multi-stage Dockerfile (deps → builder → runner)
2. Docker Compose (development: PostgreSQL)
3. 5 GitHub Actions workflows (lint, type-check, test, build, deploy)
4. Husky pre-commit hooks
5. Dev startup script

### Files to Create

```
docker/
├── Dockerfile
├── docker-compose.dev.yml
└── .dockerignore

.github/workflows/
├── lint.yml
├── type-check.yml
├── test.yml
├── build.yml
└── deploy.yml

.husky/
└── pre-commit
```

### Docker Architecture

```
Multi-stage build:
  deps     → Install all dependencies
  builder  → Build TypeScript → dist/
  runner   → Production image (non-root user, health check)

Docker Compose (dev):
  postgres → PostgreSQL 16 (port 5432)
  (Redis in Phase 8)
```

### GitHub Actions Pipeline

```
On push/PR to main:
  1. Lint       → ESLint + Prettier (3 min)
  2. Type Check → tsc --noEmit (2 min)
  3. Test       → Vitest with PostgreSQL service (5 min)
  4. Build      → npm run build (3 min)
  5. Deploy     → Railway (API) + Vercel (Web)

Branch protection:
  - Require PR before merging
  - Require status checks (lint, type-check, test, build)
  - Require branch up to date
  - No direct pushes to main
```

### Acceptance Criteria

- [ ] `docker build` produces working image (~200MB)
- [ ] `docker compose up` starts PostgreSQL + app
- [ ] Health check works in Docker
- [ ] Non-root user in production image
- [ ] Lint workflow passes
- [ ] Type Check workflow passes
- [ ] Test workflow passes with PostgreSQL service
- [ ] Build workflow passes
- [ ] Deploy workflow deploys to Railway + Vercel
- [ ] Husky pre-commit runs lint-staged

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `feat: create multi-stage dockerfile` | Docker build |
| `feat: create docker compose for development` | Dev infrastructure |
| `feat: add github actions workflows` | CI/CD pipeline |
| `chore: add husky pre-commit hooks` | Git hooks |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Create multi-stage Dockerfile | 3 |
| Create Docker Compose | 2 |
| Create 5 GitHub Actions workflows | 5 |
| Configure Husky + lint-staged | 1 |
| **Total** | **11 hours (~1.5 days)** |

---

## Phase 11: Production Deployment

**Effort:** 2–3 days  
**Dependencies:** All previous phases  

### Goal

Deploy the complete application to production: Railway (backend), Vercel (frontend), Neon (database), and Upstash (Redis). Run smoke tests and verify all features.

### Deliverables

1. Railway project + service configuration
2. Vercel project + domain configuration
3. Neon PostgreSQL database provisioning
4. Upstash Redis provisioning (if Phase 8 completed)
5. Environment variables configured in all services
6. Production domain + SSL setup
7. Data migration from V1 (optional)
8. Smoke test execution
9. Production documentation update

### Deployment Configuration

```bash
# Railway (Backend)
Service: brainify-api
Build: Dockerfile
Port: 8080
Env vars:
  NODE_ENV=production
  DATABASE_URL=postgres://...neon.tech/...
  JWT_ACCESS_SECRET=<generated>
  JWT_REFRESH_SECRET=<generated>
  GEMINI_API_KEY=<gemini-key>
  FRONTEND_URL=https://brainify.app
  REDIS_URL=redis://...upstash.io/...  # If Phase 8 completed
  ARCJET_KEY=<arcjet-key>              # If Phase 9 completed
  SENTRY_DSN=<sentry-dsn>              # If Phase 9 completed

# Vercel (Frontend)
Framework: Next.js
Root: apps/web
Env vars:
  NEXT_PUBLIC_API_URL=https://api.brainify.app

# Neon (Database)
Region: Nearest to users
Compute: Auto-scaling (0-1 vCPU)
Autosuspend: After 5 minutes of inactivity
```

### Production Domain Setup

```
Frontend: https://brainify.app (Vercel)
Backend:  https://api.brainify.app (Railway)
Database: postgresql://...neon.tech/brainify (Neon)
Redis:    redis://...upstash.io (Upstash)
```

### Smoke Test Checklist

```markdown
# Production Smoke Tests

## Authentication
- [ ] Landing page loads (SSR, check page source)
- [ ] Sign-up creates account (201 + cookies)
- [ ] Sign-in with valid credentials (200 + cookies)
- [ ] Sign-in with wrong password (401)
- [ ] Duplicate email sign-up (409)
- [ ] Protected route redirects to login
- [ ] Token refresh works (auto on expiry)
- [ ] Sign-out clears cookies

## Assessments
- [ ] VARK quiz loads 16 questions
- [ ] VARK submission returns correct scores
- [ ] Brain quiz loads 21 A/B questions
- [ ] Brain submission returns correct scores
- [ ] Results page displays charts correctly
- [ ] Retake resets assessments

## Dashboard
- [ ] Dashboard loads with stat cards
- [ ] Engagement chart renders
- [ ] VARK radar chart renders
- [ ] Analytics page loads with 30-day trends

## AI Features
- [ ] Study Buddy responds in VARK style
- [ ] Conversation history preserved
- [ ] Smart Search returns Wikipedia + AI results
- [ ] All 4 Styles compare works

## Technical
- [ ] Health endpoint returns 200
- [ ] Lighthouse score 90+ (performance)
- [ ] Lighthouse score 90+ (accessibility)
- [ ] All pages load without console errors
- [ ] Backend logs to Winston
- [ ] No server errors in logs
```

### Rollback Plan

```markdown
1. Railway: Click "Rollback" in deployment dashboard
2. Vercel: Go to deployment history → "Promote to Production"
3. Database: Use Neon point-in-time recovery (last 7 days)
4. Redis: Cache will repopulate automatically
```

### Acceptance Criteria

- [ ] Frontend loads at https://brainify.app
- [ ] Backend serves at https://api.brainify.app
- [ ] Health check returns 200
- [ ] All smoke tests pass
- [ ] Lighthouse score 90+ (performance, accessibility, SEO)
- [ ] Backend logging to Winston
- [ ] SSL certificate valid
- [ ] CORS configured for production domain
- [ ] Rate limiting active
- [ ] V1 data migrated (if applicable)

### Git Commit Milestones

| Commit | Description |
|--------|-------------|
| `chore: configure production environment` | Railway + Vercel configs |
| `chore: add production deployment docs` | Deployment checklist |
| `chore: run smoke tests and verify deployment` | Final verification |

### Effort Breakdown

| Task | Hours |
|------|-------|
| Configure Railway + Vercel + Neon | 3 |
| Configure environment variables | 1 |
| Domain + SSL setup | 2 |
| Run smoke tests + fix issues | 4 |
| V1 data migration (optional) | 4 |
| Documentation updates | 2 |
| **Total** | **16 hours (~2 days)** |

---

## Summary

### Timeline

| Phase | Days | Effort (Hours) | Cumulative |
|-------|------|----------------|------------|
| 1. Project Foundation | 3 | 20 | 20 |
| 2. Database + Auth | 3 | 22 | 42 |
| 3. VARK Assessment | 2 | 17 | 59 |
| 4. Brain Assessment | 1.5 | 9 | 68 |
| 5. Dashboard + Analytics | 4 | 32 | 100 |
| 6. AI Study Buddy | 2.5 | 19 | 119 |
| 7. Smart Search | 1.5 | 12 | 131 |
| 8. Redis + Performance | 1.5 | 10 | 141 |
| 9. Security Hardening | 1 | 7 | 148 |
| 10. Docker + CI/CD | 1.5 | 11 | 159 |
| 11. Production Deployment | 2 | 16 | 175 |
| **Total** | **~24 days** | **175 hours** | **4–5 weeks** |

### Project Statistics

| Metric | Value |
|--------|-------|
| Total phases | 11 (MVP) |
| Total effort | ~175 hours |
| Timeline | 4–6 weeks (solo full-time) |
| Total files | ~120 |
| Backend files | ~50 |
| Frontend files | ~60 |
| Shared files | ~10 |
| Database tables | 7 (MVP) |
| API endpoints | 15 |
| GitHub Actions | 5 workflows |
| Docker stages | 3 (deps → builder → runner) |

### Key Milestones

| Milestone | Phase | Week |
|-----------|-------|------|
| Backend + frontend skeleton running | 1 | 1 |
| Auth working (sign-up → sign-in → dashboard) | 2 | 1–2 |
| VARK assessment complete | 3 | 2 |
| Brain assessment complete | 4 | 2–3 |
| Full dashboard with analytics | 5 | 3–4 |
| AI Study Buddy chat | 6 | 4 |
| Smart Search working | 7 | 4–5 |
| Redis + performance (optional) | 8 | 5 |
| Security hardening (optional) | 9 | 5 |
| Docker + CI/CD | 10 | 5–6 |
| Production deployment | 11 | 6 |

### Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Gemini API rate limits | Medium | High | Implement retry with backoff, cache responses |
| Database migration issues | Low | Critical | Test migrations on staging first |
| Frontend complexity (dashboard) | Medium | Medium | Use Shadcn templates, iterate quickly |
| Feature creep | High | Medium | Strict MVP scope, defer non-critical features |
| Solo developer burnout | Medium | High | Break work into daily deliverables, celebrate wins |
| Environment configuration issues | Low | Medium | Use .env.example, validate at startup |

### Post-MVP Features (Future Phases)

| Feature | Phase | Priority |
|---------|-------|----------|
| PWA Support | 12 | Low |
| Mobile App (React Native) | 13 | Medium |
| Multi-provider AI (OpenAI) | 14 | Low |
| Admin Dashboard | 15 | Low |
| Email Verification | 16 | Low |
| Password Reset | 17 | Low |
| Social OAuth (Google, GitHub) | 18 | Low |
| File Upload | 19 | Low |
| Real-time Collaboration | 20 | Low |
| i18n / Hindi Support | 21 | Medium |

---

*This roadmap represents the solo developer MVP implementation plan for Brainify v2. Each phase builds on the previous and produces a deployable, tested increment. Total estimated time: 4–6 weeks for the core MVP, with optional phases (8, 9) that can be deferred to post-launch.*