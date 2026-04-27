import pdfplumber
import re
from typing import Dict

def parse_resume(file_path: str) -> Dict:
    """
    Parse resume PDF and extract key information
    """
    try:
        with pdfplumber.open(file_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        email = emails[0] if emails else "N/A"
        
        # Extract name (usually first line or near top)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        name = lines[0] if lines else "Developer"
        
        # Extract phone
        phone_pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
        phones = re.findall(phone_pattern, text)
        phone = phones[0] if phones else "N/A"
        
        # Count sections
        education_keywords = ['education', 'degree', 'university', 'college', 'bachelor', 'master']
        experience_keywords = ['experience', 'work', 'employment', 'intern']
        skills_keywords = ['skills', 'technologies', 'technical']
        projects_keywords = ['projects', 'portfolio']
        
        text_lower = text.lower()
        
        has_education = any(keyword in text_lower for keyword in education_keywords)
        has_experience = any(keyword in text_lower for keyword in experience_keywords)
        has_skills = any(keyword in text_lower for keyword in skills_keywords)
        has_projects = any(keyword in text_lower for keyword in projects_keywords)
        
        # Count projects (rough estimate)
        project_count = text_lower.count('project')
        
        # Extract skills (common programming languages and technologies)
        common_skills = [
            'python', 'java', 'javascript', 'c++', 'react', 'node', 'angular',
            'vue', 'django', 'flask', 'spring', 'sql', 'mongodb', 'aws', 'docker',
            'kubernetes', 'git', 'html', 'css', 'typescript', 'go', 'rust'
        ]
        
        found_skills = [skill for skill in common_skills if skill in text_lower]
        
        # Calculate ATS score
        ats_score = 0
        if has_education: ats_score += 20
        if has_experience: ats_score += 25
        if has_skills: ats_score += 20
        if has_projects: ats_score += 15
        if len(found_skills) >= 5: ats_score += 10
        if email != "N/A": ats_score += 5
        if phone != "N/A": ats_score += 5
        
        return {
            "name": name,
            "email": email,
            "phone": phone,
            "has_education": has_education,
            "has_experience": has_experience,
            "has_skills": has_skills,
            "has_projects": has_projects,
            "project_count": min(project_count, 10),
            "skills": found_skills,
            "skill_count": len(found_skills),
            "ats_score": min(ats_score, 100),
            "word_count": len(text.split())
        }
    
    except Exception as e:
        print(f"Resume parsing error: {str(e)}")
        return {
            "name": "Developer",
            "email": "N/A",
            "error": str(e)
        }
