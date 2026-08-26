import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

JOBS_PATH = BASE_DIR / "data" / "jobs.json"


def load_jobs():
    with open(JOBS_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def calculate_skill_gap(student_skills, job_id):
    jobs = load_jobs()

    if job_id not in jobs:
        return None

    required_skills = jobs[job_id]["required_skills"]

    student_skills = {
        skill.lower().strip()
        for skill in student_skills
    }

    matching_skills = []
    missing_skills = []

    for skill in required_skills:
        if skill.lower() in student_skills:
            matching_skills.append(skill)
        else:
            missing_skills.append(skill)

    total_required = len(required_skills)

    if total_required == 0:
        skill_match_percentage = 0
    else:
        skill_match_percentage = round(
            (len(matching_skills) / total_required) * 100,
            2
        )

    return {
        "job_title": jobs[job_id]["title"],
        "required_skills": required_skills,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "skill_match_percentage": skill_match_percentage
    }