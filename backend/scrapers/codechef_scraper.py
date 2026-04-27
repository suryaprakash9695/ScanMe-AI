import aiohttp
from bs4 import BeautifulSoup
from typing import Dict

async def scrape_codechef(username: str) -> Dict:
    """
    Scrape CodeChef profile data
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"https://www.codechef.com/users/{username}") as response:
                if response.status != 200:
                    return {"error": "User not found"}
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract rating
                rating_div = soup.find('div', class_='rating-number')
                rating = int(rating_div.text.strip()) if rating_div else 0
                
                # Extract stars
                stars_div = soup.find('span', class_='rating')
                stars = stars_div.text.count('★') if stars_div else 0
                
                # Extract problems solved
                problems_div = soup.find('h3', string='Problems Solved')
                problems_solved = 0
                if problems_div:
                    problems_text = problems_div.find_next('div').text.strip()
                    problems_solved = int(''.join(filter(str.isdigit, problems_text)))
                
                return {
                    "username": username,
                    "rating": rating,
                    "stars": stars,
                    "problems_solved": problems_solved,
                    "rank": "N/A"
                }
    
    except Exception as e:
        print(f"CodeChef scraping error: {str(e)}")
        return {"error": str(e)}
