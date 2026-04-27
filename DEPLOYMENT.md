# 🚀 Deployment Guide - ScanMe AI

Complete guide to deploy ScanMe AI to production.

## Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

```bash
# Test production build locally
npm run build
npm run preview
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add Environment Variables (if any)
6. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Backend Deployment (Render)

### Step 1: Prepare Backend

Create `render.yaml` in backend directory:

```yaml
services:
  - type: web
    name: scanme-ai-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.9.0
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: scanme-ai-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or paid for better performance)
5. Add Environment Variables:
   - `ALLOWED_ORIGINS`: Your frontend URL
6. Click "Create Web Service"

### Step 3: Update Frontend API URL

Update `src/pages/Analyze.jsx` and other files:

```javascript
// Replace
const response = await axios.post('/api/analyze', formDataToSend)

// With
const response = await axios.post('https://your-backend-url.onrender.com/api/analyze', formDataToSend)
```

Or use environment variables:

```javascript
// .env.production
VITE_API_URL=https://your-backend-url.onrender.com

// In code
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

## Alternative Deployment Options

### Frontend Alternatives

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/scanme-ai",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

### Backend Alternatives

#### Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select backend directory
4. Add environment variables
5. Deploy

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create scanme-ai-api

# Deploy
git subtree push --prefix backend heroku main
```

#### AWS EC2
```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Clone repository
git clone your-repo-url
cd scanme-ai/backend

# Install Python packages
pip3 install -r requirements.txt

# Run with systemd or PM2
```

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend
```env
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
PORT=8000
```

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API is accessible
- [ ] CORS is configured properly
- [ ] File uploads work
- [ ] PDF generation works
- [ ] All scrapers function correctly
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (if applicable)

## Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize images
npm install -D vite-plugin-imagemin
```

### Backend
- Enable caching for API responses
- Use CDN for static assets
- Implement rate limiting
- Add Redis for session storage
- Use connection pooling

## Monitoring

### Frontend (Vercel)
- Built-in analytics
- Real-time logs
- Performance insights

### Backend (Render)
- Application logs
- Metrics dashboard
- Health checks

### Additional Tools
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: User analytics

## Troubleshooting

### Common Issues

**CORS Errors**
```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Build Failures**
- Check Node.js version
- Clear cache: `npm clean-cache --force`
- Delete node_modules and reinstall

**API Timeout**
- Increase timeout in Render settings
- Optimize scraping logic
- Add caching layer

## Scaling Considerations

### When to Scale
- Response time > 3 seconds
- Error rate > 1%
- CPU usage > 80%
- Memory usage > 80%

### Scaling Options
1. **Vertical**: Upgrade instance size
2. **Horizontal**: Add more instances
3. **Caching**: Redis/Memcached
4. **CDN**: CloudFlare, AWS CloudFront
5. **Database**: Add PostgreSQL for persistence

## Security Best Practices

- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Validate all inputs
- [ ] Sanitize file uploads
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Add security headers
- [ ] Regular dependency updates

## Cost Estimation

### Free Tier
- **Vercel**: Free for personal projects
- **Render**: Free tier available (with limitations)
- **Total**: $0/month

### Production Tier
- **Vercel Pro**: $20/month
- **Render Standard**: $7-25/month
- **Total**: ~$30-50/month

## Support

For deployment issues:
1. Check logs in deployment platform
2. Review error messages
3. Test locally first
4. Check environment variables
5. Verify API endpoints

---

**Happy Deploying! 🚀**
