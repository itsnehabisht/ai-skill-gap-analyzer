# AI Skill Gap Analyzer 🐰

A career-guidance web app that identifies the gap between a student's current
skills and the requirements of their target job — and builds a personalized
learning roadmap to close it.

Built as a final-year BCA project.

## What it does

1. **Student Profile** — enter your name, education, experience, and current skills.
2. **Resume Upload** — upload a PDF resume; the app extracts your skills from it automatically and merges them into your profile.
3. **Job Selection** — choose a target career (Data Scientist, Data Analyst, Frontend/Backend Developer, Business Analyst, Digital Marketing Specialist, Clinical Research Associate).
4. **Skill Gap Analysis** — see exactly which required skills you already have and which you're missing, with a match percentage.
5. **Learning Recommendations** — get a prioritized roadmap for each missing skill: what to learn, curated resources, and a practice challenge.
6. **Progress Tracker** — check off skills as you complete them; progress is saved and shown everywhere in the app.
7. **AI Job Readiness Score** — a trained machine learning model (not a hardcoded rule) predicts your overall readiness for the role based on your skill profile.
8. **Report Generation** — a printable, shareable summary bringing your profile, skill gap, recommendations, and progress together in one document.
9. **Dashboard** — an at-a-glance home screen with your key scores and next steps.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python) |
| Machine Learning | scikit-learn (`RandomForestRegressor`), trained separately from the API |
| Data storage | JSON files (`profile.json`, `progress.json`) — see *Design notes* below |
| Resume parsing | `pypdf` for text extraction, regex-based skill matching |

## Project structure

```
ai-skill-gap-analyzer/
├── frontend/                  Next.js app
│   ├── app/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── resume/
│   │   ├── jobs/
│   │   ├── skill-gap/
│   │   ├── learning/
│   │   ├── progress/
│   │   └── reports/
│   └── components/
│       ├── Sidebar.tsx
│       ├── BunnyGuide.tsx     Contextual in-app guide
│       └── BunnyIcon.tsx      App mascot / logo mark
│
├── backend/                   FastAPI application
│   ├── main.py                All API routes
│   ├── skill_gap.py           Skill gap calculation
│   ├── skill_extraction.py    Resume PDF text + skill extraction
│   ├── learning_recommendations.py
│   └── data/
│       ├── jobs.json          Career definitions
│       └── skills.json        Skill catalog
│
└── ml/                         Machine learning (trained independently of the API)
    ├── generate_data.py        Synthetic training data generation
    ├── eda.py                  Exploratory data analysis
    ├── train.py                Trains and saves the RandomForest model
    ├── predict.py              Loads the saved model for inference
    ├── data/                   Training datasets
    └── models/                 Saved trained model (.joblib)
```

## Running it locally

**1. Backend**

```bash
cd backend
pip install -r ../ml/requirements.txt
uvicorn main:app --reload
```

Runs at `http://127.0.0.1:8000`.

**2. Frontend**

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000`.

**3. (Optional) Retrain the ML model**

The trained model is already committed to the repo (`ml/models/job_readiness_model.joblib`), so this step isn't required to run the app. Retrain only if you change the training data or features:

```bash
cd ml
python generate_data.py   # regenerate synthetic training data
python train.py           # retrain and save the model
```

## Design notes

- **Data storage:** the app currently persists data to JSON files on disk (`profile.json`, `progress.json`) rather than a database. This was a deliberate scope decision — the required modules (profile, resume, skill gap, recommendations, progress, reports, dashboard) don't depend on the storage engine, and JSON files keep local setup to zero extra services. A PostgreSQL migration is a natural next step if the project continues past submission, since the FastAPI route layer already isolates all storage logic into `load_*`/`save_*` functions.
- **Why a real ML model:** job readiness isn't computed with an if/else rule — `ml/train.py` trains a `RandomForestRegressor` on a synthetic but structured dataset (skill flags, experience, education level, skill-match percentage), and `ml/predict.py` loads that trained model for every prediction.
