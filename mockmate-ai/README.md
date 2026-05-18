# 🧠 MockMate AI — AI-Powered Interview Preparation Platform

<div align="center">

**The world's most intelligent interview coach. Master technical rounds, coding challenges, and behavioral interviews with real-time AI feedback.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Usage Guide](#-usage-guide)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [License](#-license)

---

## Overview

MockMate AI is a full-stack, production-grade interview preparation platform that combines the power of **Google Gemini AI** with a premium, modern UI inspired by platforms like [Final Round AI](https://finalroundai.com), [Huru AI](https://huru.ai), [Pramp](https://pramp.com), and [Interviewing.io](https://interviewing.io).

It provides end-to-end interview preparation — from AI-generated questions and real-time voice transcription to code evaluation and resume analysis — all in one unified platform.

---

## ✨ Features

### 🎯 AI Mock Interviews
- **Dynamic Question Generation** — Gemini AI generates unique, role-specific questions every session with high temperature randomness (no repeating questions)
- **Real-Time AI Feedback** — Each answer is evaluated with scores, strengths, areas for improvement, and model answers
- **Configurable Sessions** — Choose your target role, focus topic, and difficulty level (Beginner / Intermediate / Expert)
- **Session Persistence** — All completed interviews are saved and tracked for analytics

### 🤖 AI Hint Chatbot
- **Floating Coach Widget** — A beautiful glassmorphic chatbot panel appears during interviews
- **Contextual Hints** — Click "Give Me a Hint" to receive AI-generated guidance without revealing the full answer
- **Chat History** — Conversation persists throughout the interview session
- **Rate-Limit Resilient** — Graceful fallback hints if API quota is exceeded

### 🎤 Voice Interview Mode
- **Web Speech API Integration** — Real-time speech-to-text transcription using browser's built-in speech recognition
- **AI-Generated Questions** — Questions are dynamically created via the Gemini API (not hardcoded)
- **Hands-Free Experience** — Speak your answers naturally and get AI feedback on content quality
- **Chrome/Edge Optimized** — Full support for Chromium-based browsers

### 💻 Coding Round (LeetCode-Style)
- **5 Real Problems** — Two Sum, Longest Substring, Valid Parentheses, Reverse Linked List, Maximum Subarray
- **Monaco Code Editor** — Professional IDE experience with syntax highlighting, auto-completion, and multiple language support (JavaScript, Python, Java, C++)
- **Run Code** — Client-side JavaScript execution with sandboxed `console.log` capture
- **AI Code Evaluation** — Submit code for Gemini AI analysis with scores for correctness, efficiency, code quality, time/space complexity
- **Problem Navigation** — Browse problems with difficulty badges (Easy/Medium) and numbered navigation

### 📄 Resume Analyzer
- **PDF Upload & Parsing** — Upload your resume and extract text using PyPDF2
- **ATS Score** — AI-generated Applicant Tracking System compatibility score out of 100
- **Skill Detection** — Automatic identification of key technical and soft skills
- **Improvement Suggestions** — Actionable feedback to optimize your resume
- **Target Role Matching** — AI recommends suitable job roles based on your experience

### 🧩 Aptitude Quiz
- **36+ Questions** — Curated across 4 categories
- **Category Selector** — Web Dev, Data Structures, System Design, General CS
- **Dynamic Shuffling** — Each quiz loads 5 randomized questions from the selected category pool
- **Instant Feedback** — Visual correct/incorrect indicators with smooth animations
- **Unlimited Retries** — "Try Again" and "Change Topic" options without page reloads

### ⌨️ Typing Speed Test
- **8 Diverse Passages** — Technical quotes, programming wisdom, and motivational text
- **Real-Time Metrics** — Words per minute (WPM), accuracy percentage, countdown timer
- **Character Highlighting** — Live color-coded feedback (white = correct, red = incorrect)
- **Random Selection** — New passage on each attempt and reset

### 📊 Analytics Dashboard
- **Real Data** — Connected to session history API (not hardcoded)
- **Score Progression Chart** — Line chart tracking performance over time
- **Topic Distribution** — Bar chart showing practice focus areas
- **AI Job Readiness** — Doughnut chart with percentage readiness prediction
- **Aggregate Stats** — Total sessions, average score, practice hours, questions answered

### 🏠 Command Center (Dashboard)
- **Live Stats** — Real-time session count, average score, practice time from API
- **Session History** — Recent interview and coding sessions with scores
- **Quick Actions** — One-click navigation to all platform modules
- **Personalized Greeting** — Displays user name from sign-up

### 🔐 Authentication
- **Sign In / Sign Up Toggle** — Seamless switching between login and registration
- **User Profile** — Name, email stored in localStorage
- **Protected Routes** — All modules require authentication
- **Social Login UI** — GitHub and Google buttons (UI ready)

### 🎬 Landing Page
- **Demo Video** — Embedded platform walkthrough recording
- **Smooth Scroll** — "Watch Demo" button scrolls to video section
- **Working Navigation** — All nav links route to actual platform pages
- **Premium Design** — Vibrant gradients, glassmorphism, Framer Motion animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with hooks and functional components |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS v4** | Utility-first styling with custom glassmorphism classes |
| **Framer Motion** | Smooth page transitions and micro-animations |
| **Monaco Editor** | VS Code-quality code editor for coding rounds |
| **Chart.js + react-chartjs-2** | Interactive analytics charts |
| **Lucide React** | Premium icon library |
| **Axios** | HTTP client for API communication |
| **React Router v6** | Client-side routing with protected routes |
| **React Toastify** | Notification system |
| **Web Speech API** | Browser-native speech-to-text |

### Backend
| Technology | Purpose |
|------------|---------|
| **Flask** | Python web framework serving API + static frontend |
| **Google Gemini AI (2.5 Flash)** | Question generation, feedback, hints, code evaluation, resume analysis |
| **PyPDF2** | Resume PDF text extraction |
| **Flask-CORS** | Cross-origin resource sharing |
| **python-dotenv** | Environment variable management |

---

## 📁 Project Structure

```
mockmate-ai/
├── run_mockmate.py              # Unified launcher script
├── README.md
│
├── backend/
│   ├── app.py                   # Flask app factory + SPA routing
│   ├── .env                     # GEMINI_API_KEY
│   ├── requirements.txt
│   ├── data/
│   │   └── sessions.json        # Session history store (auto-created)
│   ├── routes/
│   │   ├── interview.py         # /generate, /feedback, /hint, /evaluate-code, /save-session, /history
│   │   ├── resume.py            # /analyze
│   │   └── general.py           # /status
│   └── utils/
│       ├── gemini_helper.py     # AI functions (questions, feedback, hints, code eval, resume)
│       └── pdf_helper.py        # PDF text extraction
│
├── frontend/
│   ├── public/
│   │   └── demo.webp            # Platform demo video
│   ├── src/
│   │   ├── App.jsx              # Router + protected routes
│   │   ├── main.jsx             # Entry point
│   │   ├── index.css            # Global styles + glassmorphism
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Sidebar wrapper layout
│   │   │   └── Sidebar.jsx      # Navigation sidebar
│   │   └── pages/
│   │       ├── Landing.jsx      # Home page with demo video
│   │       ├── Login.jsx        # Sign In / Sign Up
│   │       ├── Dashboard.jsx    # Command center with real stats
│   │       ├── Interview.jsx    # AI interview + voice + chatbot
│   │       ├── VoiceInterview.jsx # Dedicated voice mode
│   │       ├── CodingRound.jsx  # 5 problems + Monaco editor + AI eval
│   │       ├── ResumeAnalyzer.jsx # PDF upload + ATS analysis
│   │       ├── Quiz.jsx         # 36+ questions, 4 categories
│   │       ├── TypingTest.jsx   # Speed test with 8 passages
│   │       └── Analytics.jsx    # Charts from real session data
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.9+
- **Google Gemini API Key** — Get one free at [ai.google.dev](https://ai.google.dev)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mockmate-ai.git
cd mockmate-ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run build
```

### 4. Launch the Platform
From the project root:
```bash
.\backend\venv\Scripts\python run_mockmate.py
```

Open **http://localhost:5000** in your browser.

---

## 🎮 Usage Guide

1. **Sign Up** — Create an account with your name and email
2. **Dashboard** — View your stats, recent sessions, and quick-launch any module
3. **AI Interview** — Configure role + topic + difficulty → answer questions → get AI feedback
4. **Coding Round** — Pick a problem → write code → Run to test → Submit for AI evaluation
5. **Voice Mode** — Click the mic → speak your answer → get transcription + feedback
6. **Quiz** — Choose a category → answer 5 randomized questions
7. **Resume** — Upload PDF → get ATS score + skill analysis + improvement suggestions
8. **Analytics** — Track your score progression, topic coverage, and job readiness

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/interview/generate` | Generate AI interview questions |
| `POST` | `/api/interview/feedback` | Get AI feedback on an answer |
| `POST` | `/api/interview/hint` | Get a contextual hint for a question |
| `POST` | `/api/interview/evaluate-code` | AI evaluation of code submission |
| `POST` | `/api/interview/save-session` | Save completed session data |
| `GET`  | `/api/interview/history` | Retrieve session history + stats |
| `POST` | `/api/resume/analyze` | Analyze uploaded resume PDF |
| `GET`  | `/api/status` | Health check |

---

## 🚀 Deployment

### Option 1: Unified Server (Recommended)
Build the frontend and serve everything from Flask:
```bash
cd frontend && npm run build
cd .. && python run_mockmate.py
```

### Option 2: Separate Deployment
- **Frontend** → Deploy `frontend/dist` to **Vercel** or **Netlify**
- **Backend** → Deploy to **Render**, **Railway**, or **Heroku**
- Set `GEMINI_API_KEY` in your hosting platform's environment variables
- Update API base URL in the frontend if deploying separately

---

## 🛡️ License

MIT License. Built with ❤️ for job seekers everywhere.
