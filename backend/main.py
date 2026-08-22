import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

sys.path.append(str(PROJECT_ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from ml.predict import predict_job_readiness


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
    skill_match_percentage: int = Field(ge=0, le=100)

app = FastAPI()


# Allow the Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.post("/api/predict")
def predict(student: StudentData):
    student_data = student.model_dump()

    readiness = predict_job_readiness(student_data)

    return {
        "job_readiness": readiness
    }