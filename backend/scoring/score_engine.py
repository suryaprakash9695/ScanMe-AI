from typing import Dict

def calculate_scores(profile_data: Dict, resume_data: Dict) -> Dict:
    """
    Calculate scores for all platforms and overall score
    Weights: GitHub=25, DSA=25, Resume=20, Professional=15, Diversity=10, Portfolio=5
    """
    
    # GitHub Score (0-100)
    github_score = 0
    if 'github' in profile_data and 'error' not in profile_data['github']:
        gh = profile_data['github']
        repos = gh.get('public_repos', 0)
        followers = gh.get('followers', 0)
        stars = gh.get('total_stars', 0)
        activity = gh.get('recent_activity', 0)
        
        github_score = min(100, (
            min(repos * 2, 30) +  # Up to 30 points for repos
            min(followers * 0.5, 25) +  # Up to 25 points for followers
            min(stars * 2, 25) +  # Up to 25 points for stars
            min(activity * 2, 20)  # Up to 20 points for activity
        ))
    
    # DSA Score (0-100) - Average of all coding platforms
    dsa_scores = []
    
    # LeetCode
    if 'leetcode' in profile_data and 'error' not in profile_data['leetcode']:
        lc = profile_data['leetcode']
        total = lc.get('total_solved', 0)
        easy = lc.get('easy_solved', 0)
        medium = lc.get('medium_solved', 0)
        hard = lc.get('hard_solved', 0)
        
        lc_score = min(100, (
            min(easy * 0.5, 20) +
            min(medium * 1.5, 40) +
            min(hard * 3, 40)
        ))
        dsa_scores.append(lc_score)
    
    # Codeforces
    if 'codeforces' in profile_data and 'error' not in profile_data['codeforces']:
        cf = profile_data['codeforces']
        rating = cf.get('rating', 0)
        problems = cf.get('problems_solved', 0)
        
        cf_score = min(100, (
            min(rating / 20, 60) +  # Rating contribution
            min(problems * 0.5, 40)  # Problems contribution
        ))
        dsa_scores.append(cf_score)
    
    # CodeChef
    if 'codechef' in profile_data and 'error' not in profile_data['codechef']:
        cc = profile_data['codechef']
        rating = cc.get('rating', 0)
        problems = cc.get('problems_solved', 0)
        
        cc_score = min(100, (
            min(rating / 20, 60) +
            min(problems * 0.5, 40)
        ))
        dsa_scores.append(cc_score)
    
    dsa_score = sum(dsa_scores) / len(dsa_scores) if dsa_scores else 0
    
    # Resume Score (0-100)
    resume_score = 0
    if resume_data and 'error' not in resume_data:
        ats = resume_data.get('ats_score', 0)
        skills = resume_data.get('skill_count', 0)
        projects = resume_data.get('project_count', 0)
        
        resume_score = min(100, (
            ats * 0.5 +  # ATS score contribution
            min(skills * 5, 30) +  # Skills contribution
            min(projects * 5, 20)  # Projects contribution
        ))
    
    # LinkedIn Score (0-100)
    linkedin_score = 0
    if 'linkedin' in profile_data and 'error' not in profile_data['linkedin']:
        linkedin_score = 60  # Base score for having LinkedIn
    
    # Portfolio Score (0-100)
    portfolio_score = 0
    if 'portfolio' in profile_data and 'error' not in profile_data['portfolio']:
        pf = profile_data['portfolio']
        if pf.get('is_live'):
            portfolio_score = 40
            if pf.get('is_secure'): portfolio_score += 20
            if pf.get('is_mobile_friendly'): portfolio_score += 20
            if pf.get('has_projects'): portfolio_score += 20
    
    # Consistency Score (based on platform diversity)
    platforms_used = sum([
        1 if 'github' in profile_data and 'error' not in profile_data['github'] else 0,
        1 if 'leetcode' in profile_data and 'error' not in profile_data['leetcode'] else 0,
        1 if 'codeforces' in profile_data and 'error' not in profile_data['codeforces'] else 0,
        1 if 'codechef' in profile_data and 'error' not in profile_data['codechef'] else 0,
        1 if 'linkedin' in profile_data and 'error' not in profile_data['linkedin'] else 0,
        1 if 'portfolio' in profile_data and 'error' not in profile_data['portfolio'] else 0,
        1 if resume_data and 'error' not in resume_data else 0
    ])
    consistency_score = min(100, platforms_used * 14)
    
    # Calculate overall score with weights
    overall_score = int(
        github_score * 0.25 +
        dsa_score * 0.25 +
        resume_score * 0.20 +
        linkedin_score * 0.15 +
        consistency_score * 0.10 +
        portfolio_score * 0.05
    )
    
    # Calculate hiring readiness percentage
    hiring_readiness = min(100, int(overall_score * 1.1))
    
    return {
        "overall_score": overall_score,
        "hiring_readiness": hiring_readiness,
        "github_score": int(github_score),
        "dsa_score": int(dsa_score),
        "resume_score": int(resume_score),
        "linkedin_score": int(linkedin_score),
        "portfolio_score": int(portfolio_score),
        "consistency_score": int(consistency_score)
    }

def generate_analysis(profile_data: Dict, resume_data: Dict, scores: Dict) -> Dict:
    """
    Generate detailed analysis, suggestions, and action plan
    """
    strengths = []
    weaknesses = []
    
    # Analyze GitHub
    if scores['github_score'] >= 70:
        strengths.append("Strong GitHub presence with good repository activity")
    elif scores['github_score'] >= 40:
        strengths.append("Decent GitHub profile with room for improvement")
    else:
        weaknesses.append("Limited GitHub activity - need more projects and contributions")
    
    # Analyze DSA
    if scores['dsa_score'] >= 70:
        strengths.append("Excellent problem-solving skills across coding platforms")
    elif scores['dsa_score'] >= 40:
        strengths.append("Good DSA foundation with consistent practice")
    else:
        weaknesses.append("Need to improve DSA skills and solve more problems")
    
    # Analyze Resume
    if scores['resume_score'] >= 70:
        strengths.append("Well-structured resume with strong ATS compatibility")
    elif scores['resume_score'] >= 40:
        strengths.append("Decent resume with some optimization needed")
    else:
        weaknesses.append("Resume needs significant improvement for ATS systems")
    
    # Analyze Portfolio
    if scores['portfolio_score'] >= 60:
        strengths.append("Professional portfolio website showcasing projects")
    else:
        weaknesses.append("Missing or incomplete portfolio website")
    
    # Analyze Consistency
    if scores['consistency_score'] >= 70:
        strengths.append("Active across multiple platforms showing consistency")
    else:
        weaknesses.append("Limited platform diversity - expand your online presence")
    
    # Generate suggestions
    suggestions = {
        "high": [],
        "medium": [],
        "low": []
    }
    
    # High priority
    if scores['github_score'] < 60:
        suggestions["high"].append("Create 3-5 high-quality GitHub projects with detailed READMEs")
    if scores['dsa_score'] < 60:
        suggestions["high"].append("Solve at least 100 DSA problems across Easy/Medium difficulty")
    if scores['resume_score'] < 60:
        suggestions["high"].append("Optimize resume for ATS with proper formatting and keywords")
    
    # Medium priority
    if scores['linkedin_score'] < 60:
        suggestions["medium"].append("Create/update LinkedIn profile with professional headline")
    if scores['portfolio_score'] < 60:
        suggestions["medium"].append("Build a portfolio website showcasing your best projects")
    suggestions["medium"].append("Add detailed documentation to all GitHub repositories")
    
    # Low priority
    suggestions["low"].append("Write technical blog posts about your projects")
    suggestions["low"].append("Contribute to open source projects")
    suggestions["low"].append("Obtain relevant certifications in your tech stack")
    
    # Generate 6-week action plan
    action_plan = {
        "Week 1-2": [
            "Fix resume formatting and add missing sections",
            "Clean up GitHub profile and pin best repositories",
            "Update LinkedIn profile with current skills"
        ],
        "Week 3-4": [
            "Solve 30 DSA problems (mix of Easy and Medium)",
            "Start building portfolio website",
            "Add comprehensive READMEs to top 3 GitHub projects"
        ],
        "Week 5-6": [
            "Complete portfolio website with 3-5 projects",
            "Solve 20 more DSA problems focusing on Medium/Hard",
            "Write 2 technical blog posts about your projects"
        ]
    }
    
    return {
        "analysis": {
            "strengths": strengths,
            "weaknesses": weaknesses
        },
        "suggestions": suggestions,
        "action_plan": action_plan
    }
