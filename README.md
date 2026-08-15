# Naulej

A full-stack job platform connecting students with recruiters (HRs), featuring AI-powered ATS resume scoring.

Students upload a resume, score it against any job description, and apply to openings. Recruiters post jobs and review applicants from a separate dashboard.

## Stack

- **Frontend:** React 19, Vite 7, Redux Toolkit, React Router 7, Tailwind CSS 4, Axios, Framer Motion
- **Backend:** Node.js (ESM), Express 5, MongoDB via Mongoose 8
- **Auth:** JWT (24h expiry), bcrypt, Passport + Google OAuth 2.0
- **Services:** OpenAI `gpt-4o-mini` (ATS scoring), AWS S3 (file storage), Razorpay (payments)
- **Parsing:** `pdf-extraction` for resume text, Multer (memory storage) for uploads

## Features

**Students** — email/password or Google login; profile with basic, academic, and social-link sections; PDF resume upload; ATS checker returning score, keyword-match percentage, missing keywords, and suggestions; job listing and apply; premium upgrade via Razorpay.

**Recruiters** — separate login and dashboard; post job openings; view applications per job; open applicant resumes via signed URLs; soft-delete postings.

## Structure

```
backend/
  config/       db, passport, s3Client, razorpay
  controllers/  ats, apply, job, hrDashboard, payment, profile, student, upload
  middleware/   authMiddleware (JWT + authorizeRole), uploadMiddleware (multer)
  models/       Student, HR, Jobs, Application, PaymentDetails, Developer
  routes/       one router per feature, mounted in server.js
frontend/src/
  components/   Home, Login, Register, Dashboard, Profile, AtsPage,
                JobPortal, BuyPremium, HR/*, route guards
  redux/        store, authSlice, verifyToken
```

## How it works

- **Auth** — register/login read the role from a `role` request header and return a JWT holding `{ id, email, role }`. The frontend re-validates on load via `GET /authenticate`. `authMiddleware` verifies the token; `authorizeRole` gates each route to `student` or `hr`. Client-side, `ProtectedRoute` mirrors this and `NonPremium` blocks the upgrade page for existing premium users.
- **Files** — uploads go to memory, then to S3; only the key is stored (`resumes/{id}.pdf`, `profiles/{id}.img`). Files are served through presigned GET URLs (300s, or 3000s for ATS resume previews).
- **ATS** — resume text is extracted once at upload and cached on the student document, so each check is a single LLM call. The model is prompted to return strict JSON.
- **Payments** — order amount comes from the singleton `Developer` document. Verification recomputes the HMAC-SHA256 signature server-side and only then sets `isPremium` and records the payment.
- **Jobs** — new postings default to `approvalStatus: false` and stay hidden from the job portal until approved. Deletes are soft (`deleteStatus`). Applying requires an uploaded resume and blocks duplicates.

## Setup

```bash
# Backend
cd backend && npm install && npm start   # nodemon server.js → port 5000

# Frontend
cd frontend && npm install && npm run dev  # vite → port 5173
```

Confirm the API is up:

```bash
curl http://localhost:5000/test   # → API is working
```

`backend/.env`:

```ini
PORT=5000
MONGO_URL=
JWT_SECRET=
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
AWS_REGION=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
OPENAI_API_KEY=
```

`frontend/.env`:

```ini
VITE_API_BASE_URL=
VITE_RAZORPAY_KEY_ID=
```

Seed one `Developer` document with a `price` field — the payment routes read from it. Job approval has no UI; set `approvalStatus` in the database.

## API

Protected routes expect `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/test` | Public | Health check |
| `POST` | `/students/register` | Public | Register (role from `role` header) |
| `POST` | `/students/login` | Public | Log in, returns JWT |
| `GET` | `/auth/google?role=` | Public | Start Google OAuth |
| `GET` | `/auth/google/callback` | Public | Callback → redirects to frontend with token |
| `GET` | `/authenticate` | Any | Validate token, return identity + premium status |
| `GET` | `/dashboard` | Student | Profile summary with signed resume/avatar URLs |
| `GET` `PUT` | `/profile` | Student | Read / update profile |
| `POST` | `/upload/pdf` | Student | Upload resume, extract text, store in S3 |
| `POST` | `/upload/image` | Student | Upload avatar |
| `POST` | `/ats` | Student | Score stored resume against `{ jobDesc }` |
| `GET` | `/ats/resume` | Student | Signed URL for stored resume |
| `GET` | `/jobs` | Student | List approved, non-deleted openings |
| `POST` | `/jobs` | HR | Create a job opening |
| `POST` | `/apply/job/:jobId` | Student | Apply to a job |
| `GET` | `/hr/job-posted` | HR | Own postings with application counts |
| `GET` | `/hr/applications` | HR | Applications received |
| `GET` | `/hr/checkresume?key=` | HR | Signed URL for an applicant's resume |
| `GET` | `/hr/delete-job?jobId=` | HR | Soft-delete a posting |
| `POST` | `/payment/order` | Public | Create a Razorpay order |
| `POST` | `/payment/verify` | Public | Verify signature, grant premium |
| `GET` | `/payment/premium-price` | Public | Current premium price |

## Deployment

`frontend/vercel.json` rewrites all paths to `/` for client-side routing. `FRONTEND_URL` on the backend drives both the CORS allowlist and the OAuth redirect target.

## Tradeoffs

- **AI ATS scoring** improves match quality but adds latency, API cost, and third-party dependence; caching resume text keeps each check to one call.
- **MongoDB** gives schema flexibility for evolving job and profile data, at the cost of weaker relational integrity.
- **JWT auth** is stateless and scalable, but tokens can't be revoked before their 24h expiry.
- **S3 + presigned URLs** avoid proxying downloads through the app, at the cost of external config and storage spend.
- **Manual job approval** keeps listing quality high but currently requires direct database access.
