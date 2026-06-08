# ResumeAI — Beat the ATS, Land the Interview

AI-powered resume analyzer that extracts text from PDFs, scores them against ATS (Applicant Tracking System) criteria, and provides actionable recommendations — all with no sign-up required.

## Tech Stack

**Frontend** — React 19, Vite 8, Tailwind CSS 3, Framer Motion, Chart.js, React Router, React Dropzone, Lucide Icons

**Backend** — Node.js, Express, Mongoose, Multer, pdf-parse, Winston, Helmet, express-rate-limit

**Database** — MongoDB

## Features

- **PDF Upload** — Drag & drop or file picker, 5 MB limit, validated by MIME type and magic bytes
- **ATS Scoring** — Analyzes structure, keywords, formatting, skill coverage, and experience depth
- **Readiness Score** — 0–100 normalized score across all weighted categories
- **Letter Grade** — A+ through F based on overall quality
- **Skill Extraction** — Categorizes detected skills into Languages, Frameworks, Databases, and Tools/DevOps
- **Scoring Breakdown** — Progress bars and radar/bar/doughnut charts per category
- **Recommendations** — Strengths, weaknesses, missing sections, and prioritized action items
- **Session History** — Stores past analyses in localStorage-bound anonymous sessions
- **Dark Theme** — Full slate-950 background with WCAG-compliant contrast throughout

## Architecture

```
resume-analyzer/
├── backend/
│   ├── config/db.js          — MongoDB connection
│   ├── controllers/          — Resume CRUD and analysis
│   ├── middlewares/
│   │   ├── errorHandler.js   — Global error + 404
│   │   ├── rateLimiter.js    — API rate limiting
│   │   └── upload.js         — Multer config + PDF content validation
│   ├── models/Resume.js      — Mongoose schema
│   ├── routes/               — Resume and health endpoints
│   ├── services/
│   │   └── analyzerService.js — Scoring engine
│   ├── utils/logger.js       — Winston logger
│   ├── validators/           — Request validation schemas
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/       — Doughnut, radar, bar chart wrappers
│   │   │   ├── layout/       — Navbar, Footer, PageLayout
│   │   │   ├── sections/     — Hero, Features, Stats, HowItWorks, etc.
│   │   │   └── ui/           — ScoreRing, ProgressBar, Badge, Uploader, etc.
│   │   ├── context/          — ResumeContext (upload, fetch, history state)
│   │   ├── pages/            — Home, Analyze, Report, History, About, etc.
│   │   ├── services/api.js   — Axios client with session ID interceptor
│   │   ├── utils/helpers.js  — Color, grade, date formatting utilities
│   │   ├── App.jsx           — Router + lazy page loading
│   │   └── main.jsx          — Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── uploads/                  — Uploaded PDFs (gitignored)
├── logs/                     — Winston log files (gitignored)
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev          # Starts on port 5000
```

Available scripts:

| Command | Description |
|---------|-------------|
| `npm start`    | Production start |
| `npm run dev`  | Dev with nodemon hot reload |

### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev        # Starts on port 5173
```

Available scripts:

| Command | Description |
|---------|-------------|
| `npm run dev`    | Dev server with HMR |
| `npm run build`  | Production build |
| `npm run preview`| Preview production build |
| `npm run lint`   | ESLint check |

> `--legacy-peer-deps` is needed because framer-motion v11 declares a React 18 peer dependency but works fine with React 19.

### Environment Variables

**Backend `.env`:**

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=info
JWT_SECRET=change-in-production
```

**Frontend** expects `VITE_API_URL` (defaults to `http://localhost:5000/api`).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST`   | `/api/resume/upload`        | Upload and analyze a PDF |
| `GET`    | `/api/resume/:id`           | Get analysis report by ID |
| `GET`    | `/api/resume/history/:sid`  | Get session history (paginated) |
| `GET`    | `/api/resume/stats/overview`| Aggregate statistics |
| `DELETE` | `/api/resume/:id`           | Delete a report |
| `GET`    | `/health`                   | Health check |

## Scoring System

| Grade | Score Range |
|-------|------------|
| A+    | 95–100     |
| A     | 85–94      |
| B     | 75–84      |
| C     | 60–74      |
| D     | 40–59      |
| F     | 0–39       |

The **ATS Score** evaluates five weighted categories: Structure (25), Keywords (25), Formatting (20), Skill Coverage (20), and Experience (10). The **Readiness Score** normalizes the sum of all category scores to a 0–100 scale.

## License

MIT
