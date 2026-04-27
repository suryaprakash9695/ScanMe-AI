import aiohttp
from typing import Dict

async def scrape_codeforces(handle: str) -> Dict:
    """
    Scrape Codeforces profile data using official API
    """
    try:
        async with aiohttp.ClientSession() as session:
            # Get user info
            async with session.get(f"https://codeforces.com/api/user.info?handles={handle}") as response:
                if response.status != 200:
                    return {"error": "User not found"}
                
                data = await response.json()
                if data.get('status') != 'OK':
                    return {"error": "User not found"}
                
                user_data = data['result'][0]
            
            # Get user submissions
            async with session.get(f"https://codeforces.com/api/user.status?handle={handle}&from=1&count=1000") as response:
                submissions_data = await response.json() if response.status == 200 else {}
                submissions = submissions_data.get('result', [])
            
            # Calculate solved problems
            solved_problems = len(set(
                f"{sub['problem']['contestId']}{sub['problem']['index']}"
                for sub in submissions
                if sub.get('verdict') == 'OK'
            ))
            
            return {
                "handle": handle,
                "rating": user_data.get('rating', 0),
                "max_rating": user_data.get('maxRating', 0),
                "rank": user_data.get('rank', 'unrated'),
                "max_rank": user_data.get('maxRank', 'unrated'),
                "contribution": user_data.get('contribution', 0),
                "problems_solved": solved_problems,
                "contests_participated": len(set(sub.get('contestId') for sub in submissions if 'contestId' in sub))
            }
    
    except Exception as e:
        print(f"Codeforces scraping error: {str(e)}")
        return {"error": str(e)}
