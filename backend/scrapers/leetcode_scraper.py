import aiohttp
from typing import Dict

async def scrape_leetcode(username: str) -> Dict:
    """
    Scrape LeetCode profile data using GraphQL API
    """
    try:
        query = """
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    ranking
                    reputation
                }
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
        """
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://leetcode.com/graphql",
                json={"query": query, "variables": {"username": username}},
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status != 200:
                    return {"error": "User not found"}
                
                data = await response.json()
                user_data = data.get('data', {}).get('matchedUser', {})
                
                if not user_data:
                    return {"error": "User not found"}
                
                # Parse submission stats
                submissions = user_data.get('submitStats', {}).get('acSubmissionNum', [])
                easy = next((s['count'] for s in submissions if s['difficulty'] == 'Easy'), 0)
                medium = next((s['count'] for s in submissions if s['difficulty'] == 'Medium'), 0)
                hard = next((s['count'] for s in submissions if s['difficulty'] == 'Hard'), 0)
                
                return {
                    "username": username,
                    "ranking": user_data.get('profile', {}).get('ranking', 0),
                    "reputation": user_data.get('profile', {}).get('reputation', 0),
                    "easy_solved": easy,
                    "medium_solved": medium,
                    "hard_solved": hard,
                    "total_solved": easy + medium + hard
                }
    
    except Exception as e:
        print(f"LeetCode scraping error: {str(e)}")
        return {"error": str(e)}
