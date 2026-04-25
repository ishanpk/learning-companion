# <div align="center">🎓 StudyPal</div>
## <div align="center">**AI-Powered Personalized Learning Companion**</div>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

StudyPal is a high-performance, intelligent learning platform designed to help you master any skill. By combining the **Google Gemini 1.5 Flash** model with advanced educational theories like **Spaced Repetition** and **Gamified Micro-Learning**, StudyPal creates a unique, adaptive curriculum just for you.

## 🚀 Key Features

*   **✨ Dynamic AI Learning Paths**: Instantly generate structured courses for any topic.
*   **🧠 Spaced Repetition (SM-2)**: Smart "Daily Warm-Ups" that adapt to your performance.
*   **🛡️ Production-Grade Security**: Firebase Authentication (Anonymous & Google) with hardened Firestore rules.
*   **⚡ High-Performance Rendering**: Optimized with React Suspense, Lazy Loading, and Memoization.
*   **🎮 Gamified Progression**: Track micro-skills, earn levels (up to Lv.15), and unlock evolved skill caps.
*   **⏱️ Focus Timer**: Integrated Pomodoro timer with screen-reader accessible `aria-live` updates.
*   **🛠️ Scenario Mode**: Test your knowledge in "Broken System" debugging scenarios evaluated in real-time by AI.
*   **📊 Comprehensive Analytics**: Custom event tracking for learning outcomes and engagement.

## 🏗️ Architecture & Tech Stack

StudyPal follows a **BFF (Backend-for-Frontend)** pattern for secure AI orchestration and a **Sliced Store** architecture for state management.

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), [Tailwind CSS 4](https://tailwindcss.com/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) (Slices: Timer, Skills, Courses, Loadout) |
| **Backend / AI** | [Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/), Edge API Routes |
| **Database & Auth** | [Firebase Firestore](https://firebase.google.com/), Google & Anonymous Authentication |
| **Quality Control** | [Zod](https://zod.dev/) (Defensive Parsing), [GitHub Actions CI](.github/workflows/ci.yml) |
| **Testing** | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) |

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js **>= 20.0.0**
- A Google Cloud API Key for **Gemini API**
- A **Firebase** project with Firestore and Authentication enabled

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/ishanpk/learning-companion.git
cd learning-companion

# Install dependencies
npm install

# Configure Environment Variables
cp .env.example .env.local
```

### 3. Environment Variables
Create a `.env.local` file and add the following:
```env
GEMINI_API_KEY=your_gemini_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Locally
```bash
npm run dev
```

## 🔒 Security & Performance

- **Environment Validation**: All environment variables are validated at build-time using **Zod** to prevent runtime crashes.
- **Defensive API Design**: Every AI response is validated against a strict Zod schema before reaching the frontend.
- **Route Protection**: Firestore Security Rules ensure users can *only* read and write their own documents (`request.auth.uid == userId`).
- **Optimization**: All heavy views are lazy-loaded using `next/dynamic` to maintain a < 200KB initial JS bundle.

## 🧪 Testing

```bash
npm test                # Run unit tests with Vitest
npx playwright test     # Run E2E tests
npm run type-check      # Validate TypeScript types
npm run lint            # Enforce code quality
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by the StudyPal Team
</div>
