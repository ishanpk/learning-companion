# 🎓 Learning Companion — AI-Powered Study Platform

> An interactive learning platform built with **Next.js 16 (App Router)**, **Tailwind CSS 4**, **Shadcn/UI**, **Zustand**, **Firebase**, and the **Google Gemini API**.

## ✨ Features

| Feature | Description |
|---|---|
| **AI Learning Paths** | Generate personalized curricula with modules & quizzes using Gemini 2.5 Flash |
| **Focus Timer** | Pomodoro-style 25-minute focus sessions with circular progress |
| **Skill Loadout** | Gamified micro-skill system (up to Lv.15) with evolved skill caps |
| **Daily Warm-Up** | Spaced-repetition flashcard review before each study session |
| **Scenario Mode** | "Broken System" debugging scenarios evaluated by AI |
| **Capstone Projects** | AI-generated final projects to apply learned concepts |
| **Achievements** | 12 milestones across skills, streaks, courses, and timer |
| **Firebase Sync** | Firestore persistence for skills, loadout, and generated courses |

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5.7 (strict mode)
- **Styling:** Tailwind CSS 4 + Shadcn/UI components
- **State:** Zustand (with Firestore sync)
- **AI:** Google Gemini 2.5 Flash (`@google/genai`)
- **Database:** Firebase Firestore
- **Analytics:** Vercel Analytics + custom event tracker
- **Testing:** Vitest (unit) + Playwright (E2E)
- **CI/CD:** GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud project with the Gemini API enabled
- A Firebase project with Firestore enabled

### Setup

```bash
# Clone the repository
git clone https://github.com/ishanpk/learning-companion.git
cd learning-companion

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your keys (see below)

# Run dev server
npm run dev
```

### Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GEMINI_API_KEY` | Server only | Google Gemini API key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client | Firebase app ID |

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate-path/     # Gemini learning path generation
│   │   ├── scenario-check/    # Gemini scenario evaluation
│   │   └── capstone/          # Gemini capstone project generation
│   ├── globals.css            # Tailwind + design tokens
│   ├── layout.tsx             # Root layout with Firebase provider
│   └── page.tsx               # Main SPA page
├── components/
│   ├── learning/              # Feature components
│   └── ui/                    # Shadcn/UI primitives
├── lib/
│   ├── achievements.ts        # Gamification milestones
│   ├── analytics.ts           # Custom event tracking
│   ├── firebase.ts            # Firebase initialization
│   ├── gemini.mock.ts         # Test mocks for AI
│   └── spaced-repetition.ts   # SM-2 review scheduler
├── store/
│   └── useStudyStore.ts       # Zustand state manager
├── middleware.ts               # Rate limiting for API routes
├── firestore.rules            # Firestore security rules
└── __tests__/                 # Unit + E2E tests
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npx playwright test

# Lint
npm run lint

# Type check
npm run type-check
```

## 📄 License

MIT
