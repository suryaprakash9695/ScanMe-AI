# ScanMe AI — Developer Profile Analyzer

> Scan your profiles. Know your value.

An AI-powered full-stack web app that evaluates a developer's complete online coding presence across 8+ platforms and generates a recruiter-ready score report — no login required.


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
