"""
ScanMe AI — FastAPI Backend
Analyzes developer profiles across multiple platforms and generates a readiness report.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid, os, asyncio
from typing import Optional
from datetime import datetime

from scrapers.github_scraper     import scrape_github
from scrapers.leetcode_scraper   import scrape_leetcode
from scrapers.codeforces_scraper import scrape_codeforces
from scrapers.codechef_scraper   import scrape_codechef
from scrapers.linkedin_scraper   import scrape_linkedin
from scrapers.portfolio_scraper  import scrape_portfolio
from scrapers.gfg_scraper        import scrape_gfg
from scrapers.hackerrank_scraper import scrape_hackerrank
from parsers.resume_parser       import parse_resume
from scoring.score_engine        import calculate_scores, generate_analysis

app = FastAPI(title="ScanMe AI API", version="1.0.0", docs_url="/docs")

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory report cache (stateless; no DB required) ────────────────────────
reports_cache: dict = {}

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"message": "ScanMe AI API is running", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat(), "reports_cached": len(reports_cache)}


@app.post("/api/analyze")
async def analyze_profile(
    github:     Optional[str] = Form(None),
    linkedin:   Optional[str] = Form(None),
    leetcode:   Optional[str] = Form(None),
    codeforces: Optional[str] = Form(None),
    codechef:   Optional[str] = Form(None),
    gfg:        Optional[str] = Form(None),
    hackerrank: Optional[str] = Form(None),
    portfolio:  Optional[str] = Form(None),
    resume:     Optional[UploadFile] = File(None),
):
    """
    Main analysis endpoint.
    Scrapes all provided platforms concurrently, parses resume, calculates scores.
    """
    # Validate at least one input
    inputs = [github, linkedin, leetcode, codeforces, codechef, gfg, hackerrank, portfolio]
    if not any(v and v.strip() for v in inputs):
        raise HTTPException(status_code=400, detail="Please provide at least one profile username or URL.")

    report_id = str(uuid.uuid4())[:8]
    profile_data: dict = {}

    # ── Concurrent scraping ───────────────────────────────────────────────────
    async def safe_scrape(key, coro):
        try:
            profile_data[key] = await coro
        except Exception as e:
            print(f"[scraper:{key}] {e}")
            profile_data[key] = {"error": str(e)}

    tasks = []
    if github:     tasks.append(safe_scrape("github",     scrape_github(github.strip())))
    if leetcode:   tasks.append(safe_scrape("leetcode",   scrape_leetcode(leetcode.strip())))
    if codeforces: tasks.append(safe_scrape("codeforces", scrape_codeforces(codeforces.strip())))
    if codechef:   tasks.append(safe_scrape("codechef",   scrape_codechef(codechef.strip())))
    if linkedin:   tasks.append(safe_scrape("linkedin",   scrape_linkedin(linkedin.strip())))
    if portfolio:  tasks.append(safe_scrape("portfolio",  scrape_portfolio(portfolio.strip())))
    if gfg:        tasks.append(safe_scrape("gfg",        scrape_gfg(gfg.strip())))
    if hackerrank: tasks.append(safe_scrape("hackerrank", scrape_hackerrank(hackerrank.strip())))

    await asyncio.gather(*tasks)

    # ── Resume parsing ────────────────────────────────────────────────────────
    resume_data: dict = {}
    if resume:
        # Validate file type
        if not resume.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Resume must be a PDF file.")

        # Save to temp
        os.makedirs("/tmp", exist_ok=True)
        temp_path = f"/tmp/{report_id}_{resume.filename}"
        try:
            content = await resume.read()
            if len(content) > 10 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="Resume file too large (max 10 MB).")
            with open(temp_path, "wb") as f:
                f.write(content)
            resume_data = parse_resume(temp_path)
        except HTTPException:
            raise
        except Exception as e:
            print(f"[resume] {e}")
            resume_data = {"error": str(e)}
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    # ── Scoring & analysis ────────────────────────────────────────────────────
    scores   = calculate_scores(profile_data, resume_data)
    analysis = generate_analysis(profile_data, resume_data, scores)

    # Determine candidate name / email from resume or GitHub
    name  = resume_data.get("name")  or profile_data.get("github", {}).get("name")  or "Developer"
    email = resume_data.get("email") or "N/A"

    report = {
        "report_id":    report_id,
        "timestamp":    datetime.now().isoformat(),
        "candidate":    {"name": name, "email": email, "github": github or "N/A"},
        "scores":       scores,
        "analysis":     analysis["analysis"],
        "suggestions":  analysis["suggestions"],
        "action_plan":  analysis["action_plan"],
        "profile_data": profile_data,
        "resume_data":  resume_data,
    }

    reports_cache[report_id] = report
    return JSONResponse(content=report)


@app.get("/api/report/{report_id}")
async def get_report(report_id: str):
    if report_id not in reports_cache:
        raise HTTPException(status_code=404, detail="Report not found or expired.")
    return JSONResponse(content=reports_cache[report_id])


@app.post("/api/compare")
async def compare_candidates(
    report_id_1: str = Form(...),
    report_id_2: str = Form(...),
):
    r1 = reports_cache.get(report_id_1)
    r2 = reports_cache.get(report_id_2)
    if not r1 or not r2:
        raise HTTPException(status_code=404, detail="One or both reports not found.")

    s1, s2 = r1["scores"], r2["scores"]
    return JSONResponse(content={
        "candidate_1": {"name": r1["candidate"]["name"], "overall_score": s1["overall_score"]},
        "candidate_2": {"name": r2["candidate"]["name"], "overall_score": s2["overall_score"]},
        "score_differences": {
            "github":      s1["github_score"]      - s2["github_score"],
            "dsa":         s1["dsa_score"]         - s2["dsa_score"],
            "resume":      s1["resume_score"]      - s2["resume_score"],
            "linkedin":    s1["linkedin_score"]    - s2["linkedin_score"],
            "portfolio":   s1["portfolio_score"]   - s2["portfolio_score"],
            "consistency": s1["consistency_score"] - s2["consistency_score"],
        },
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
