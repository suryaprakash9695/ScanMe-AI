# ScanMe AI — Developer Profile Analyzer

> Scan your profiles. Know your value.

An AI-powered full-stack web app that evaluates a developer's complete online coding presence across 8+ platforms and generates a recruiter-ready score report — no login required.

---

## Live Demo

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## What It Does

Recruiters don't have time to manually check GitHub, LeetCode, LinkedIn, and resumes one by one. ScanMe AI does it all in under 60 seconds:

1. Enter your platform usernames
2. Upload your resume PDF
3. Get a full scored dashboard with strengths, weaknesses, and a 6-week action plan
4. Download a PDF report or share a link

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS (glassmorphism dark theme)
- Framer Motion (animations)
- Recharts (radar, bar, pie charts)
- jsPDF + html2canvas (PDF export)
- Lucide React (icons)

**Backend**
- Python 3.9+ / FastAPI
- aiohttp (async concurrent scraping)
- BeautifulSoup4 + lxml (HTML parsing)
- pdfplumber + PyPDF2 (resume parsing)
- Uvicorn (ASGI server)

---

## Project Structure

```
scanme-ai/
├── backend/
│   ├── scrapers/
│   │   ├── github_scraper.py
│   │   ├── leetcode_scraper.py
│   │   ├── codeforces_scraper.py
│   │   ├── codechef_scraper.py
│   │   ├── gfg_scraper.py
│   │   ├── hackerrank_scraper.py
│   │   ├── linkedin_scraper.py
│   │   └── portfolio_scraper.py
│   ├── parsers/
│   │   └── resume_parser.py
│   ├── scoring/
│   │   └── score_engine.py
│   ├── main.py
│   └── requirements.txt
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Analyze.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Compare.jsx
│   │   └── About.jsx
│   ├── utils/api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+

### Frontend

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Backend

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
python main.py
# → http://localhost:8000
```

---

## Scoring System

| Dimension            | Weight |
|----------------------|--------|
| GitHub Activity      | 25%    |
| DSA Platforms        | 25%    |
| Resume Quality       | 20%    |
| Professional Presence| 15%    |
| Platform Diversity   | 10%    |
| Portfolio            | 5%     |

| Score  | Level             |
|--------|-------------------|
| 0–39   | 🎯 Beginner        |
| 40–59  | 🌱 Growing Developer|
| 60–74  | ✨ Placement Ready  |
| 75–89  | ⭐ Strong Candidate |
| 90–100 | 🏆 Elite Candidate  |

---

## API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | `/`                   | Root health check              |
| GET    | `/api/health`         | Detailed status + cache count  |
| POST   | `/api/analyze`        | Run full profile analysis      |
| GET    | `/api/report/{id}`    | Retrieve a cached report       |
| POST   | `/api/compare`        | Compare two report IDs         |

Full interactive docs at `/docs` (Swagger UI).

---

## Dashboard Features

- Circular score ring with animated fill
- Per-platform score cards with progress bars
- Radar chart (skills overview)
- Bar chart (platform comparison)
- Pie chart (GitHub language distribution)
- Strengths & weaknesses breakdown
- Prioritised action items (High / Medium / Low)
- 6-week improvement roadmap with timeline
- Best roles recommendation
- Estimated future score after completing the plan
- One-click PDF export
- Shareable report link

---

## Deployment

### Frontend → Vercel

```bash
npm run build
vercel --prod
```

Or connect the repo in the Vercel dashboard — framework preset: **Vite**, output dir: `dist`.

### Backend → Render

1. New Web Service → connect repo → set root to `backend/`
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add env var: `ALLOWED_ORIGINS=https://your-frontend.vercel.app`

After deploying, set `VITE_API_URL` in Vercel to your Render backend URL.

---

## Environment Variables

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:8000
```

**Backend** (`.env`):
```env
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Security

- No login, no database — all data is in-memory and discarded after the session
- Resume temp files deleted immediately after parsing
- File upload capped at 10 MB, PDF only
- CORS restricted to configured origins in production
- All inputs sanitised before scraping

---

## License

MIT — see [LICENSE](LICENSE).

---

*Built for final year projects, internships, and campus placements* 🎓
