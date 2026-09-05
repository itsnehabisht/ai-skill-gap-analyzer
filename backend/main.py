import sys
import json
import io
import csv
import uuid
from datetime import datetime
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

USERS_HISTORY_PATH = BASE_DIR / "data" / "users_history.csv"


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
# USER ID
# ============================================================

def create_user_id():
    """
    Create a unique user ID.
    """

    return f"USR-{uuid.uuid4().hex[:8].upper()}"


def get_or_create_user_id(profile):
    """
    Return the existing user ID.

    If the profile does not have a user ID yet,
    create a new unique ID and add it to the profile.
    """

    user_id = profile.get("user_id")

    if user_id:
        return user_id

    user_id = create_user_id()

    profile["user_id"] = user_id

    return user_id


# ============================================================
# HISTORICAL USER STORAGE
# ============================================================

HISTORY_FIELDNAMES = [
    "user_id",
    "archived_at",
    "name",
    "education",
    "experience_years",
    "skills",
    "completed_skills",
    "selected_job",
]


def normalize_history_row(row):
    """
    Convert a CSV row into the format used by the application.

    Also supports older history records that do not yet
    contain user_id or selected_job.
    """

    user_id = (row.get("user_id") or "").strip()

    if not user_id:
        user_id = create_user_id()

    experience = row.get(
        "experience_years",
        "0"
    )

    try:
        experience = int(experience)
    except (TypeError, ValueError):
        experience = 0

    skills = [
        skill.strip()
        for skill in (row.get("skills") or "").split(",")
        if skill.strip()
    ]

    completed_skills = [
        skill.strip()
        for skill in (row.get("completed_skills") or "").split(",")
        if skill.strip()
    ]

    selected_job = (
        row.get("selected_job") or ""
    ).strip()

    return {
        "user_id": user_id,
        "archived_at": row.get(
            "archived_at",
            ""
        ),
        "name": row.get(
            "name",
            ""
        ),
        "education": row.get(
            "education",
            ""
        ),
        "experience_years": experience,
        "skills": skills,
        "completed_skills": completed_skills,
        "selected_job": selected_job or None,
    }


def read_raw_history_rows():
    """
    Read the raw CSV rows.

    This is separated from read_user_history()
    so old CSV files can be migrated safely.
    """

    if not USERS_HISTORY_PATH.exists():
        return [], []

    try:
        with open(
            USERS_HISTORY_PATH,
            "r",
            newline="",
            encoding="utf-8"
        ) as file:

            reader = csv.DictReader(file)

            fieldnames = reader.fieldnames or []
            rows = list(reader)

        return fieldnames, rows

    except (OSError, csv.Error):
        return [], []


def migrate_history_file():
    """
    Make sure users_history.csv uses the current schema.

    Older versions did not store user_id or selected_job.

    Missing IDs are permanently generated and written back
    so they remain stable.

    Missing selected_job values are stored as empty values.
    """

    if not USERS_HISTORY_PATH.exists():
        return

    fieldnames, raw_rows = read_raw_history_rows()

    if not raw_rows and not fieldnames:
        return

    needs_migration = (
        fieldnames != HISTORY_FIELDNAMES
        or any(
            not (row.get("user_id") or "").strip()
            for row in raw_rows
        )
        or any(
            "selected_job" not in row
            for row in raw_rows
        )
    )

    if not needs_migration:
        return

    users = [
        normalize_history_row(row)
        for row in raw_rows
    ]

    USERS_HISTORY_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    temp_path = USERS_HISTORY_PATH.with_suffix(
        ".csv.tmp"
    )

    try:
        with open(
            temp_path,
            "w",
            newline="",
            encoding="utf-8"
        ) as file:

            writer = csv.DictWriter(
                file,
                fieldnames=HISTORY_FIELDNAMES
            )

            writer.writeheader()

            for user in users:

                writer.writerow({
                    "user_id": user["user_id"],
                    "archived_at": user["archived_at"],
                    "name": user["name"],
                    "education": user["education"],
                    "experience_years": user[
                        "experience_years"
                    ],
                    "skills": ", ".join(
                        user["skills"]
                    ),
                    "completed_skills": ", ".join(
                        user["completed_skills"]
                    ),
                    "selected_job": user[
                        "selected_job"
                    ] or ""
                })

        temp_path.replace(USERS_HISTORY_PATH)

    except OSError:

        if temp_path.exists():
            temp_path.unlink()


def archive_current_user():
    """
    Save the current user's complete state into
    users_history.csv before starting or restoring
    another user.

    Stored information:

    - user_id
    - profile
    - resume skills
    - selected career
    - learning progress
    """

    profile = load_profile()

    if profile is None:
        return False

    progress = load_progress()

    user_id = get_or_create_user_id(profile)

    # Save the ID to the active profile.
    save_profile(profile)

    USERS_HISTORY_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    # Migrate older history files before appending.
    migrate_history_file()

    file_exists = USERS_HISTORY_PATH.exists()

    fieldnames = HISTORY_FIELDNAMES

    with open(
        USERS_HISTORY_PATH,
        "a",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        if (
            not file_exists
            or USERS_HISTORY_PATH.stat().st_size == 0
        ):
            writer.writeheader()

        writer.writerow({
            "user_id": user_id,

            "archived_at": datetime.now().isoformat(
                timespec="seconds"
            ),

            "name": profile.get(
                "name",
                ""
            ),

            "education": profile.get(
                "education",
                ""
            ),

            "experience_years": profile.get(
                "experience_years",
                0
            ),

            "skills": ", ".join(
                profile.get(
                    "skills",
                    []
                )
            ),

            "completed_skills": ", ".join(
                progress.get(
                    "completed_skills",
                    []
                )
            ),

            "selected_job": profile.get(
                "selected_job",
                ""
            ) or ""
        })

    return True


def clear_current_user():
    """
    Remove the active user's profile and reset
    learning progress so the next user starts fresh.
    """

    if PROFILE_PATH.exists():
        PROFILE_PATH.unlink()

    save_progress({
        "completed_skills": []
    })


def read_user_history():
    """
    Read all archived users from users_history.csv.

    Old records are migrated first so their user IDs
    remain stable between history and restore requests.
    """

    if not USERS_HISTORY_PATH.exists():
        return []

    migrate_history_file()

    _, raw_rows = read_raw_history_rows()

    users = []

    for row in raw_rows:
        users.append(
            normalize_history_row(row)
        )

    return users


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
    skills: list[str] = []

    # Selected career is stored so it can be restored
    # when switching back to a previous user.
    selected_job: str | None = None


class ProgressRequest(BaseModel):
    skill: str
    completed: bool


class RestoreUserRequest(BaseModel):
    user_id: str


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
            "error": (
                "Could not read this PDF. "
                "Please try a different file."
            )
        }

    if not resume_text.strip():
        return {
            "error": "No readable text found in this PDF."
        }

    extracted_skills = extract_skills(resume_text)

    profile = load_profile()

    if profile is None:
        return {
            "error": (
                "Please create your profile "
                "before uploading a resume."
            )
        }

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

    skills = profile.get(
        "skills",
        []
    )

    return {
        "skills": skills,
        "skills_found": len(skills)
    }


# ============================================================
# PROFILE
# ============================================================

@app.post("/api/profile")
def create_profile(profile: StudentProfile):

    # Keep previously extracted resume skills.
    existing_profile = load_profile()

    existing_skills = []
    existing_user_id = None
    existing_selected_job = None

    if existing_profile is not None:

        existing_skills = existing_profile.get(
            "skills",
            []
        )

        existing_user_id = existing_profile.get(
            "user_id"
        )

        existing_selected_job = existing_profile.get(
            "selected_job"
        )

    # Existing users keep their ID.
    # A genuinely new profile gets a new ID.
    user_id = existing_user_id

    if not user_id:
        user_id = create_user_id()

    # --------------------------------------------------------
    # IMPORTANT:
    # Profile page does not send selected_job.
    #
    # Therefore, if selected_job is missing from the request,
    # preserve the already selected career.
    # --------------------------------------------------------

    selected_job = profile.selected_job

    if selected_job is None:
        selected_job = existing_selected_job

    profile_data = {
        "user_id": user_id,
        "name": profile.name,
        "education": profile.education,
        "experience_years": profile.experience_years,
        "skills": existing_skills,
        "selected_job": selected_job
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
# SWITCH / START NEW USER
# ============================================================

@app.post("/api/users/switch")
def switch_user():

    archived = archive_current_user()

    clear_current_user()

    return {
        "message": (
            "Current user archived successfully. "
            "Ready for a new user."
            if archived
            else "No current user found. Ready for a new user."
        ),
        "archived": archived
    }


# ============================================================
# PREVIOUS USERS / USER HISTORY
# ============================================================

@app.get("/api/users/history")
def get_user_history():

    users = read_user_history()

    return {
        "users": users
    }


# ============================================================
# RESTORE PREVIOUS USER
# ============================================================

@app.post("/api/users/restore")
def restore_user(request: RestoreUserRequest):

    users = read_user_history()

    selected_user = None

    # Find the requested previous user by stable ID.
    for user in users:

        if user["user_id"] == request.user_id:
            selected_user = user
            break

    if selected_user is None:
        return {
            "error": "Previous user not found."
        }

    # --------------------------------------------------------
    # Archive the currently active user before switching.
    # --------------------------------------------------------

    current_profile = load_profile()

    if current_profile is not None:

        current_user_id = current_profile.get(
            "user_id"
        )

        if current_user_id != selected_user["user_id"]:
            archive_current_user()

    # --------------------------------------------------------
    # Restore selected user's COMPLETE profile.
    # --------------------------------------------------------

    restored_profile = {
        "user_id": selected_user["user_id"],
        "name": selected_user["name"],
        "education": selected_user["education"],
        "experience_years": selected_user[
            "experience_years"
        ],
        "skills": selected_user["skills"],
        "selected_job": selected_user.get(
            "selected_job"
        )
    }

    save_profile(restored_profile)

    # --------------------------------------------------------
    # Restore selected user's learning progress.
    # --------------------------------------------------------

    restored_progress = {
        "completed_skills": selected_user[
            "completed_skills"
        ]
    }

    save_progress(restored_progress)

    return {
        "message": (
            f"User '{selected_user['name']}' "
            "restored successfully."
        ),
        "profile": restored_profile,
        "progress": restored_progress
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
            completed_skills.append(
                request.skill
            )

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