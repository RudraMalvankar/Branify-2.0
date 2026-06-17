# 🧠 Brainify

> **AI-powered adaptive learning platform** — discovers a student's VARK learning style and brain dominance, then adapts all content delivery accordingly.

Built originally for a civic hackathon targeting underserved Indian students. Now being rebuilt as a production-grade open-source SaaS platform.

---

## ✨ Features

- **VARK Learning Style Quiz** — 16 official v8.01 questions, multi-select scoring → Visual / Auditory / Read-Write / Kinesthetic
- **Brain Dominance Quiz** — 21 A/B questions, scored 0–21, maps to 5 brain types (Strong Left → Strong Right)
- **VARK-Adaptive AI** — completely different system prompts per learning style (Gemini & OpenAI)
- **Wikipedia + AI Hybrid Search** — factual context fetched from Wikipedia, reformatted via AI in the user's VARK style
- **All-4-Style Compare Mode** — same topic rendered in all 4 VARK styles side-by-side (parallel AI calls)
- **Activity & Streak Tracking** — rolling 30-day activity log, automatic streak logic
- **Time-on-App Tracking** — real session time via `visibilitychange` / `beforeunload`
- **Offline-First PWA** — Workbox caching for fonts and API calls

---

## 🏗️ Tech Stack

| Layer            | Tech                                                          |
| ---------------- | ------------------------------------------------------------ |
| Frontend         | Next.js 15 (App Router) · React · TypeScript · Tailwind · Shadcn UI |
| Backend          | Express · Node.js · TypeScript                               |
| Database         | PostgreSQL · Drizzle ORM · Neon                              |
| Auth             | JWT Access Tokens · Refresh Tokens · HTTP-only Cookies · bcrypt |
| Validation       | Zod                                                          |
| Caching          | Redis · Upstash                                              |
| AI               | OpenAI · Gemini · AI Service Abstraction Layer               |
| Security         | Arcjet · Helmet · CORS · Rate Limiting                       |
| Logging          | Winston · Morgan                                             |
| DevOps           | Docker · Docker Compose · GitHub Actions                     |
| Monitoring       | Health Checks · Error Tracking · Structured Logging          |

---

## 📁 Monorepo Structure

```
brainify/
├── backend/                # Express + TypeScript API
│   ├── src/
│   │   ├── config/         # env, db, redis, logger config
│   │   ├── controllers/    # request handlers
│   │   ├── middleware/     # auth, error, validation, rate-limit
│   │   ├── routes/         # route definitions
│   │   ├── services/       # business logic
│   │   ├── repositories/   # database access layer
│   │   ├── models/         # Drizzle schema
│   │   ├── validations/    # Zod schemas
│   │   ├── utils/          # helpers
│   │   ├── jobs/           # background jobs
│   │   └── types/          # shared types
│   └── drizzle/            # migrations
├── frontend/               # Next.js 15 frontend
│   └── src/
│       ├── app/            # App Router pages
│       ├── components/     # UI, layout, quiz, dashboard
│       ├── hooks/          # custom hooks
│       ├── lib/            # utilities
│       ├── services/       # API clients
│       ├── types/          # shared types
│       └── store/          # state management
├── docker/                 # Dockerfiles & compose
├── .github/workflows/      # CI/CD
└── docs/                   # documentation
```

### Architecture Flow

```
Route → Controller → Service → Repository → Database
```

- **Business logic never lives inside routes.**
- **All API responses use a standard response format.**
- **All endpoints include validation, error handling, and logging.**

---

## 🚀 Quick Start

### Prerequisites

- Node.js `>= 20`
- npm `>= 10`
- PostgreSQL 15+ (or a Neon account)
- Redis 7+ (or an Upstash account)
- Docker & Docker Compose (optional, for local infra)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit values in both .env files
```

### 3. Run the database (Postgres + Redis via Docker)

```bash
docker compose -f docker/docker-compose.dev.yml up -d
```

### 4. Run database migrations

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start the dev servers

```bash
npm run dev
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:8080
- Health check → http://localhost:8080/health

---

## 📜 Available Scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Run both backend & frontend concurrently |
| `npm run build`       | Build both workspaces                    |
| `npm run lint`        | Lint both workspaces                     |
| `npm run format`      | Format all files with Prettier           |
| `npm run db:generate` | Generate Drizzle migrations              |
| `npm run db:migrate`  | Run Drizzle migrations                   |
| `npm run db:studio`   | Open Drizzle Studio                      |

---

## 🗺️ Build Roadmap

This project is built in 10 phases:

- [x] **Phase 1** — Project Foundation
- [ ] **Phase 2** — Authentication Module
- [ ] **Phase 3** — User Profile, Dashboard, CRUD APIs
- [ ] **Phase 4** — Redis, Caching, Sessions, Background Jobs
- [ ] **Phase 5** — AI Layer (OpenAI, Gemini, Prompt Templates)
- [ ] **Phase 6** — Arcjet, Rate Limiting, Security
- [ ] **Phase 7** — Docker & Production Images
- [ ] **Phase 8** — GitHub Actions CI/CD
- [ ] **Phase 9** — Monitoring & Observability
- [ ] **Phase 10** — Production Deployment

---

## 📄 License

MIT — see [LICENSE](./LICENSE).
