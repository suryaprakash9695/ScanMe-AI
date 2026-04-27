import aiohttp
from bs4 import BeautifulSoup
from typing import Dict

async def scrape_gfg(username: str) -> Dict:
    """
    Scrape GeeksforGeeks profile data
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"https://auth.geeksforgeeks.org/user/{username}") as response:
                if response.status != 200:
                    return {"error": "User not found"}
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract coding score
                score_div = soup.find('span', class_='score_card_value')
                coding_score = int(score_div.text.strip()) if score_div else 0
                
                # Extract problems solved
                problems_div = soup.find('div', class_='score_card_value')
                problems_solved = 0
                if problems_div:
                    problems_text = problems_div.text.strip()
                    problems_solved = int(''.join(filter(str.isdigit, problems_text)))
                
                return {
                    "username": username,
                    "coding_score": coding_score,
                    "problems_solved": problems_solved,
                    "rank": "N/A"
                }
    
    except Exception as e:
        print(f"GFG scraping error: {str(e)}")
        return {"error": str(e)}
