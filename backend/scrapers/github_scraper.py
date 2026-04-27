import aiohttp
from bs4 import BeautifulSoup
from typing import Dict

async def scrape_github(username: str) -> Dict:
    """
    Scrape GitHub profile data
    """
    try:
        async with aiohttp.ClientSession() as session:
            # Fetch user profile
            async with session.get(f"https://api.github.com/users/{username}") as response:
                if response.status != 200:
                    return {"error": "User not found"}
                
                user_data = await response.json()
            
            # Fetch repositories
            async with session.get(f"https://api.github.com/users/{username}/repos?per_page=100") as response:
                repos_data = await response.json() if response.status == 200 else []
            
            # Calculate metrics
            total_stars = sum(repo.get('stargazers_count', 0) for repo in repos_data)
            languages = {}
            for repo in repos_data:
                lang = repo.get('language')
                if lang:
                    languages[lang] = languages.get(lang, 0) + 1
            
            # Get recent activity
            async with session.get(f"https://api.github.com/users/{username}/events/public?per_page=30") as response:
                events_data = await response.json() if response.status == 200 else []
            
            recent_activity = len([e for e in events_data if e.get('type') in ['PushEvent', 'PullRequestEvent', 'IssuesEvent']])
            
            return {
                "username": username,
                "name": user_data.get('name', username),
                "bio": user_data.get('bio', ''),
                "public_repos": user_data.get('public_repos', 0),
                "followers": user_data.get('followers', 0),
                "following": user_data.get('following', 0),
                "total_stars": total_stars,
                "languages": languages,
                "top_language": max(languages.items(), key=lambda x: x[1])[0] if languages else "None",
                "recent_activity": recent_activity,
                "created_at": user_data.get('created_at', ''),
                "repos": repos_data[:10]  # Top 10 repos
            }
    
    except Exception as e:
        print(f"GitHub scraping error: {str(e)}")
        return {"error": str(e)}
