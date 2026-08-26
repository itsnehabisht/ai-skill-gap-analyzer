import sys
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

sys.path.append(str(PROJECT_ROOT))


from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pypdf import PdfReader

from ml.predict import predict_job_readiness
from backend.skill_gap import calculate_skill_gap
from backend.learning_recommendations import generate_recommendations
from backend.skill_extraction import extract_skills


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


app = FastAPI()


# Temporary storage while the backend is running
current_profile = None
current_resume_skills = []


BASE_DIR = Path(__file__).resolve().parent

JOBS_PATH = BASE_DIR / "data" / "jobs.json"
SKILLS_PATH = BASE_DIR / "data" / "skills.json"


def load_jobs():
    with open(JOBS_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def load_skills():
    with open(SKILLS_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


# Allow the Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SkillGapRequest(BaseModel):
    student_skills: list[str]
    job_id: str


class StudentProfile(BaseModel):
    name: str
    education: str
    experience_years: int = Field(ge=0, le=50)
    skills: list[str]


@app.get("/")
def home():
    return {
        "message": "AI Skill Gap Analyzer Backend"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Backend connected successfully!"
    }


@app.get("/jobs")
def get_jobs():
    jobs = load_jobs()
    return jobs


@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    jobs = load_jobs()

    if job_id not in jobs:
        return {
            "error": "Job not found"
        }

    return jobs[job_id]


@app.get("/skills")
def get_skills():
    skills = load_skills()
    return skills


@app.post("/api/predict")
def predict(student: StudentData):

    student_data = student.model_dump()

    readiness = predict_job_readiness(student_data)

    return {
        "job_readiness": readiness
    }


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

    recommendations = generate_recommendations(
        result["missing_skills"]
    )

    return {
        "job_title": result["job_title"],
        "missing_skills": result["missing_skills"],
        "recommendations": recommendations
    }


@app.post("/api/profile")
def create_profile(profile: StudentProfile):

    global current_profile

    current_profile = profile.model_dump()

    return {
        "message": "Student profile saved successfully!",
        "profile": current_profile
    }


@app.get("/api/profile")
def get_profile():

    if current_profile is None:
        return {
            "error": "No profile found"
        }

    return {
        "profile": current_profile
    }


@app.post("/api/resume")
async def upload_resume(file: UploadFile = File(...)):

    global current_resume_skills

    try:

        # Check file type
        if file.content_type != "application/pdf":
            return {
                "error": "Only PDF resumes are supported."
            }

        # Read uploaded file
        file_content = await file.read()

        # Maximum file size = 5 MB
        max_size = 5 * 1024 * 1024

        if len(file_content) > max_size:
            return {
                "error": "Resume must be smaller than 5 MB."
            }

        # Create temporary PDF path
        resume_path = BASE_DIR / "uploaded_resume.pdf"

        with open(resume_path, "wb") as output_file:
            output_file.write(file_content)

        # Read PDF
        reader = PdfReader(resume_path)

        extracted_text = ""

        for page in reader.pages:

            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

        # Check whether text was extracted
        if not extracted_text.strip():
            return {
                "error": "Could not extract text from this PDF. Please use a text-based PDF resume."
            }

        # Extract skills
        extracted_skills = extract_skills(extracted_text)

        # Store skills temporarily
        current_resume_skills = extracted_skills

        return {
            "message": "Resume analyzed successfully!",
            "filename": file.filename,
            "extracted_skills": extracted_skills,
            "skill_count": len(extracted_skills),
            "text_length": len(extracted_text)
        }

    except Exception as error:

        print("RESUME ERROR:", error)

        return {
            "error": f"Resume processing failed: {str(error)}"
        }


@app.get("/api/resume/skills")
def get_resume_skills():

    return {
        "skills": current_resume_skills,
        "skill_count": len(current_resume_skills)
    }