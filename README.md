# Naulej

A full-stack job platform connecting students with HRs, featuring AI-powered ATS resume scoring.

## Stack
- **Frontend:** React 19, Vite, Redux Toolkit, Tailwind CSS, React Router
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT + Google OAuth
- **Services:** Gemini/OpenAI (ATS scoring), AWS S3 (resume storage), Razorpay (payments)

## Features
- Student and HR roles with separate dashboards
- Job posting, search, and applications
- AI ATS scoring of resumes against job descriptions (PDF parsing)
- Google login and JWT auth
- Resume upload to S3 and Razorpay-based payments

## Setup
```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm run dev
```

Set env vars in `backend/.env`: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, Google OAuth, AWS S3, Razorpay, and AI API keys.

## API
Base routes: `/students`, `/auth`, `/jobs`, `/ats`, `/profile`, `/dashboard`, `/payment`, `/upload`, `/apply`, `/hr`.

## Tradeoffs
- **AI ATS scoring** boosts match quality but adds latency, API cost, and dependence on a third-party LLM.
- **MongoDB** offers schema flexibility for evolving job/profile data, at the cost of weaker relational integrity.
- **JWT auth** is stateless and scalable but tokens can't be revoked server-side before expiry.
- **S3 storage** decouples files from the app but adds external config and cost over local storage.
