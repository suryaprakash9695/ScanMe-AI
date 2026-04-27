# 🛠️ Complete Setup Guide - ScanMe AI

Step-by-step guide to set up and run ScanMe AI locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd scanme-ai
```

## Step 2: Frontend Setup

### Install Dependencies

```bash
# Install all npm packages
npm install
```

This will install:
- React & React DOM
- React Router DOM
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- jsPDF & html2canvas
- Lucide React
- Vite

### Configure Environment (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

### Start Development Server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Step 3: Backend Setup

### Navigate to Backend Directory

```bash
cd backend
```

### Create Virtual Environment

#### On Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

#### On macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI
- Uvicorn
- BeautifulSoup4
- Playwright
- pdfplumber
- PyPDF2
- aiohttp
- python-multipart
- And more...

### Install Playwright Browsers (Optional)

For JavaScript-heavy page scraping:

```bash
playwright install
```

### Configure Environment (Optional)

Create a `.env` file in the backend directory:

```env
PORT=8000
HOST=0.0.0.0
ALLOWED_ORIGINS=http://localhost:3000
```

### Start Backend Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`

## Step 4: Verify Installation

### Check Frontend

1. Open browser to `http://localhost:3000`
2. You should see the ScanMe AI homepage
3. Navigate through pages (Home, Analyze, About)

### Check Backend

1. Open browser to `http://localhost:8000`
2. You should see: `{"message": "ScanMe AI API is running", "version": "1.0.0"}`
3. Check API docs: `http://localhost:8000/docs`

### Test Full Flow

1. Go to Analyze page
2. Enter test data:
   - GitHub: `torvalds`
   - LeetCode: `leetcode` (any valid username)
3. Upload a sample PDF resume
4. Click "Analyze Me"
5. Wait for results
6. View dashboard

## Step 5: Project Structure

```
scanme-ai/
├── backend/
│   ├── scrapers/
│   │   ├── github_scraper.py
│   │   ├── leetcode_scraper.py
│   │   ├── codeforces_scraper.py
│   │   ├── codechef_scraper.py
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
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Common Issues & Solutions

### Issue 1: Port Already in Use

**Frontend:**
```bash
# Change port in vite.config.js
server: {
  port: 3001  // Change to any available port
}
```

**Backend:**
```bash
# Run on different port
uvicorn main:app --port 8001
```

### Issue 2: Module Not Found

**Frontend:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Backend:**
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 3: CORS Errors

Update `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 4: Resume Upload Fails

Ensure `/tmp` directory exists or update path in `backend/main.py`:

```python
# For Windows, use:
temp_path = f"temp/{report_id}_{resume.filename}"

# Create temp directory if it doesn't exist
import os
os.makedirs("temp", exist_ok=True)
```

### Issue 5: Scraping Fails

Some platforms may block requests. Solutions:
- Add delays between requests
- Use rotating user agents
- Implement retry logic
- Use official APIs where available

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh
- Backend: Use `--reload` flag with uvicorn

### Debugging

**Frontend:**
- Use React DevTools browser extension
- Check browser console for errors
- Use `console.log()` for debugging

**Backend:**
- Check terminal for error messages
- Use `print()` statements
- Check FastAPI docs at `/docs`

### Code Formatting

**Frontend:**
```bash
npm run lint
```

**Backend:**
```bash
# Install black formatter
pip install black

# Format code
black .
```

## Testing

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Analyze form accepts input
- [ ] File upload works
- [ ] Analysis completes successfully
- [ ] Dashboard displays data
- [ ] Charts render properly
- [ ] PDF download works
- [ ] Mobile responsive
- [ ] Error handling works

### Test Data

Use these for testing:

**GitHub:**
- `torvalds` (Linus Torvalds)
- `gaearon` (Dan Abramov)
- `tj` (TJ Holowaychuk)

**LeetCode:**
- Any valid username

**Codeforces:**
- `tourist` (Gennady Korotkevich)
- `Benq` (Benjamin Qi)

## Next Steps

1. ✅ Complete setup
2. 🎨 Customize branding
3. 🔧 Add more features
4. 🚀 Deploy to production
5. 📊 Add analytics
6. 🔒 Implement security features

## Getting Help

- Check `README.md` for overview
- Check `DEPLOYMENT.md` for deployment guide
- Open an issue on GitHub
- Check FastAPI docs: https://fastapi.tiangolo.com/
- Check React docs: https://react.dev/

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)

---

**Happy Coding! 🚀**
