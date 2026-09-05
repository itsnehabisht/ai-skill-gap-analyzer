import sys
import json
import io
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from fastapi import UploadFile, File

from ml.predict import predict_job_readiness
from backend.skill_gap import calculate_skill_gap
from backend.learning_recommendations import generate_recommendations
from backend.skill_extraction import extract_text_from_pdf, extract_skills


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="AI Skill Gap Analyzer API",
    description="Backend API for the AI Skill Gap Analyzer project.",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

JOBS_PATH = BASE_DIR / "data" / "jobs.json"
SKILLS_PATH = BASE_DIR / "data" / "skills.json"
PROFILE_PATH = BASE_DIR / "data" / "profile.json"
PROGRESS_PATH = BASE_DIR / "data" / "progress.json"


# ============================================================
# DATA LOADING
# ============================================================

def load_jobs():
    with open(JOBS_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def load_skills():
    with open(SKILLS_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


# ============================================================
# PROFILE STORAGE
# ============================================================

def load_profile():
    if not PROFILE_PATH.exists():
        return None

    try:
        with open(PROFILE_PATH, "r", encoding="utf-8") as file:
            return json.load(file)

    except (json.JSONDecodeError, OSError):
        return None


def save_profile(profile):
    PROFILE_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(PROFILE_PATH, "w", encoding="utf-8") as file:
        json.dump(
            profile,
            file,
            indent=4,
            ensure_ascii=False
        )


# ============================================================
# PROGRESS STORAGE
# ============================================================

def load_progress():
    """
    Load saved learning progress.

    If progress.json does not exist yet,
    return an empty progress structure.
    """

    if not PROGRESS_PATH.exists():
        return {
            "completed_skills": []
        }

    try:
        with open(PROGRESS_PATH, "r", encoding="utf-8") as file:
            data = json.load(file)

        if not isinstance(data, dict):
            return {
                "completed_skills": []
            }

        if "completed_skills" not in data:
            data["completed_skills"] = []

        return data

    except (json.JSONDecodeError, OSError):
        return {
            "completed_skills": []
        }


def save_progress(progress):
    """
    Save learning progress permanently.
    """

    PROGRESS_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(PROGRESS_PATH, "w", encoding="utf-8") as file:
        json.dump(
            progress,
            file,
            indent=4,
            ensure_ascii=False
        )


# ============================================================
# PYDANTIC MODELS
# ============================================================

class StudentData(BaseModel):
    python: int = Field(ge=0, le=1)
    sql: int = Field(ge=0, le=1)
    pandas: int = Field(ge=0, le=1)
    numpy: int = Field(ge=0, le=1)
    machine_learning: int = Field(ge=0, le=1)
    statistics: int = Field(ge=0, le=1)
    data_visualization: int = Field(ge=0, le=1)
    scikit_learn: int = Field(ge=0, le=1)

    experience_years: int = Field(ge=0, le=50)
    education_level: int = Field(ge=1, le=3)
    skill_match_percentage: float = Field(ge=0, le=100)


class SkillGapRequest(BaseModel):
    student_skills: list[str]
    job_id: str


class StudentProfile(BaseModel):
    name: str
    education: str
    experience_years: int = Field(ge=0, le=50)

    # Skills are extracted from the resume.
    # They are optional here so the Profile page
    # does not need to manually collect skills.
    skills: list[str] = []


class ProgressRequest(BaseModel):
    skill: str
    completed: bool


# ============================================================
# BASIC ROUTES
# ============================================================

@app.get("/")
def home():
    return {
        "message": "AI Skill Gap Analyzer Backend",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Backend connected successfully!"
    }


# ============================================================
# JOB ROUTES
# ============================================================

@app.get("/jobs")
def get_jobs():
    return load_jobs()


@app.get("/jobs/{job_id}")
def get_job(job_id: str):

    jobs = load_jobs()

    if job_id not in jobs:
        return {
            "error": "Job not found"
        }

    return jobs[job_id]


# ============================================================
# SKILLS
# ============================================================

@app.get("/skills")
def get_skills():
    return load_skills()


# ============================================================
# ML PREDICTION
# ============================================================

@app.post("/api/predict")
def predict(student: StudentData):

    student_data = student.model_dump()

    readiness = predict_job_readiness(student_data)

    return {
        "job_readiness": readiness
    }


# ============================================================
# SKILL GAP
# ============================================================

@app.post("/api/skill-gap")
def skill_gap(request: SkillGapRequest):

    result = calculate_skill_gap(
        request.student_skills,
        request.job_id
    )

    if result is None:
        return {
            "error": "Job not found"
        }

    return result


# ============================================================
# LEARNING RECOMMENDATIONS
# ============================================================

@app.post("/api/recommendations")
def recommendations(request: SkillGapRequest):

    result = calculate_skill_gap(
        request.student_skills,
        request.job_id
    )

    if result is None:
        return {
            "error": "Job not found"
        }

    recommendations_data = generate_recommendations(
        result["missing_skills"]
    )

    return {
        "job_title": result["job_title"],
        "missing_skills": result["missing_skills"],
        "recommendations": recommendations_data
    }


# ============================================================
# RESUME UPLOAD + SKILL EXTRACTION
# ============================================================

@app.post("/api/resume")
async def upload_resume(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        return {
            "error": "Only PDF files are supported."
        }

    file_bytes = await file.read()

    try:
        resume_text = extract_text_from_pdf(
            io.BytesIO(file_bytes)
        )
    except Exception:
        return {
            "error": "Could not read this PDF. Please try a different file."
        }

    if not resume_text.strip():
        return {
            "error": "No readable text found in this PDF."
        }

    extracted_skills = extract_skills(resume_text)

    profile = load_profile()

    if profile is None:
        return {
            "error": "Please create your profile before uploading a resume."
        }

    # --------------------------------------------------------
    # IMPORTANT:
    # Resume skills are now the canonical skill source.
    #
    # We REPLACE the previous extracted skill list instead
    # of merging it with manually selected profile skills.
    # --------------------------------------------------------

    profile["skills"] = sorted(
        set(extracted_skills)
    )

    save_profile(profile)

    return {
        "message": "Resume analyzed successfully!",
        "extracted_skills": profile["skills"],
        "skills_found": len(profile["skills"])
    }


# ============================================================
# RESUME SKILLS
# ============================================================

@app.get("/api/resume/skills")
def get_resume_skills():

    profile = load_profile()

    if profile is None:
        return {
            "skills": []
        }

    skills = profile.get("skills", [])

    return {
        "skills": skills,
        "skills_found": len(skills)
    }


# ============================================================
# PROFILE
# ============================================================

@app.post("/api/profile")
def create_profile(profile: StudentProfile):

    # --------------------------------------------------------
    # Keep previously extracted resume skills.
    #
    # The Profile page only collects:
    # name, education and experience.
    #
    # Saving the profile must NOT erase skills that were
    # already extracted from the resume.
    # --------------------------------------------------------

    existing_profile = load_profile()

    existing_skills = []

    if existing_profile is not None:
        existing_skills = existing_profile.get(
            "skills",
            []
        )

    profile_data = {
        "name": profile.name,
        "education": profile.education,
        "experience_years": profile.experience_years,
        "skills": existing_skills
    }

    save_profile(profile_data)

    return {
        "message": "Student profile saved successfully!",
        "profile": profile_data
    }


@app.get("/api/profile")
def get_profile():

    profile = load_profile()

    if profile is None:
        return {
            "error": "No profile found"
        }

    return {
        "profile": profile
    }


@app.delete("/api/profile")
def delete_profile():

    if PROFILE_PATH.exists():
        PROFILE_PATH.unlink()

    return {
        "message": "Student profile deleted successfully."
    }


# ============================================================
# PROGRESS
# ============================================================

@app.get("/api/progress")
def get_progress():

    progress = load_progress()

    return progress


@app.post("/api/progress")
def update_progress(request: ProgressRequest):

    progress = load_progress()

    completed_skills = progress.get(
        "completed_skills",
        []
    )

    if request.completed:

        if request.skill not in completed_skills:
            completed_skills.append(request.skill)

    else:

        completed_skills = [
            skill
            for skill in completed_skills
            if skill != request.skill
        ]

    progress["completed_skills"] = completed_skills

    save_progress(progress)

    return {
        "message": "Progress updated successfully!",
        "completed_skills": completed_skills
    }


@app.delete("/api/progress")
def clear_progress():

    progress = {
        "completed_skills": []
    }

    save_progress(progress)

    return {
        "message": "Learning progress cleared successfully.",
        "completed_skills": []
    }