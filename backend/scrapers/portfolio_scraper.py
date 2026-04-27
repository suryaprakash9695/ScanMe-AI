import aiohttp
from bs4 import BeautifulSoup
from typing import Dict

async def scrape_portfolio(url: str) -> Dict:
    """
    Scrape portfolio website for basic info
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                if response.status != 200:
                    return {"error": "Website not accessible"}
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Check for HTTPS
                is_secure = url.startswith('https://')
                
                # Check for meta viewport (mobile friendly)
                viewport = soup.find('meta', attrs={'name': 'viewport'})
                is_mobile_friendly = viewport is not None
                
                # Count projects (look for common project section indicators)
                project_keywords = ['project', 'portfolio', 'work']
                projects_found = 0
                for keyword in project_keywords:
                    projects_found += len(soup.find_all(string=lambda text: keyword in text.lower() if text else False))
                
                # Extract title
                title = soup.find('title')
                site_title = title.text.strip() if title else "Portfolio"
                
                return {
                    "url": url,
                    "title": site_title,
                    "is_live": True,
                    "is_secure": is_secure,
                    "is_mobile_friendly": is_mobile_friendly,
                    "has_projects": projects_found > 0,
                    "estimated_projects": min(projects_found // 3, 10)
                }
    
    except Exception as e:
        print(f"Portfolio scraping error: {str(e)}")
        return {"error": str(e), "is_live": False}
