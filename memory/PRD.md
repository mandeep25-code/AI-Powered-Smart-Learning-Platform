# SmartLearn — Product Requirements Document

## Original Problem Statement
Build **SmartLearn**, a premium, fully functional AI-Powered Smart Learning Platform.
STRICT STACK: React + Node.js + Express + MongoDB (Mongoose) + JWT + bcrypt + OpenRouter. JavaScript only. **NO Python/FastAPI/Firebase/Supabase/PostgreSQL.**

## User Choices (this build)
- AI kept **inactive** until user adds `OPENROUTER_API_KEY` — AI runs in graceful **offline/fallback** mode now.
- Build **ALL** features at a functional level, modular architecture.
- Premium purchases are **simulated** (entitlement system ready for a real gateway later).
- Design: premium, modern, distinctive dark/light UI (design agent guidelines followed).
- OpenRouter model configurable via `OPENROUTER_MODEL` (.env).

## Architecture
- **Backend (Node/Express)** on `:8001` via supervisor (uvicorn replaced). Routes under `/api`.
  - `src/models/index.js` (Mongoose), `src/routes/*` (auth, users, dashboard, ai, courses, quizzes, flashcards, studyplanner, resources, resume, premium, instructor, content, gamification, search), `src/services/aiService.js` (OpenRouter wrapper + fallback), `src/middleware/auth.js` (JWT Bearer + role guard), `src/utils/gamify.js` (XP/streak/achievements), `src/data/content.js` (static domain content), `src/utils/seed.js`.
  - `express-async-errors` + process guards prevent crashes on bad input.
- **Frontend (React)**: React Router, TanStack Query, AuthContext (JWT in localStorage `sl_token`), ThemeContext, AppShell (sidebar + topbar + Cmd+K search + gamification bar), 25 pages, shadcn/ui + framer-motion + recharts + lucide.

## User Personas
- **Student**: learns via courses, AI tutor, quizzes, flashcards, plans; preps for placements; builds resume; tracks streak/XP.
- **Teacher**: creates courses/topics, uploads notes, views student progress (Instructor Studio).
- **Admin**: seeded superuser.

## Core Requirements (static)
Auth & RBAC · Student Dashboard · AI suite (tutor, roadmap, skill assessment, gap detection, planner, quiz gen, adaptive quizzes, notes, flashcards+spaced-rep, coding mentor, voice tutor, resume analysis, interview simulator, doc Q&A) · Learning Hub · Career Tracks/Roadmaps · Coding Arena + DSA + System Design · Placement Hub + Aptitude · Resource Vault + QuickRev · Resume Studio (ATS + PDF) · Future Path · Premium Vault (locked/entitlement) · Instructor Studio · Gamification (streak, XP, badges, leaderboard).

## Implemented (2026-09-20)
- Full JWT auth (register/login/logout/me/profile), role-based access, 3 seeded users.
- Student Dashboard (streak, study time, quiz perf chart, XP/level, recommendations, activity, badges, start-session).
- All AI endpoints with OpenRouter integration + graceful offline fallback content that persists (roadmap/quiz/flashcards/plan). Voice tutor via browser SpeechRecognition + speechSynthesis.
- Learning Hub + course detail + enroll + topic completion (XP/progress). Career Tracks + track detail.
- Roadmaps (generate + node status), Quizzes (generate/take/submit/review), Flashcards (generate + Leitner review), Study Planner (generate + task toggle).
- Coding Arena (DSA problems/sheets/system design), Placement Hub (companies), Aptitude Arena, Interview Simulator, Resume Studio (builder + ATS analysis + PDF), Resource Vault + Document Q&A, QuickRev, Future Path.
- Premium Vault (locked content, simulated purchase, server-side entitlement, library).
- Instructor Studio (dashboard, create course/topic, student progress) with RBAC.
- Gamification (achievements, leaderboard, session), Global search (Cmd+K), Analytics, Profile, dark/light theme, toasts, loading/empty states.
- Verified: 41/41 backend tests pass; frontend critical flows pass (~95%).

## Backlog / Remaining
- **P1**: Activate live AI (user adds `OPENROUTER_API_KEY`, set a real free `OPENROUTER_MODEL`). Add Joi/Zod input validation → 400s. Rate-limit login.
- **P2**: Real payment gateway for Premium (Stripe/Razorpay). PDF/file upload storage (object storage) for Resource Vault & instructor notes. Password reset flow. Adaptive quiz difficulty using attempt history. Pagination for large lists.

## Notes
- AI is MOCKED/offline until key added (returns `configured:false` + fallback). Premium purchases are SIMULATED.
- Test credentials in `/app/memory/test_credentials.md`.
