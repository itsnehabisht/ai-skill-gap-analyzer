# 🎯 AI-Skill-Gap-Analyzer

Skill Gap Analyzer is a full-stack web application that analyzes a user's resume, compares their skills with the requirements of different career paths, identifies missing skills, predicts job readiness using Machine Learning, and provides personalized learning recommendations.

> 🚀 Built as a personal portfolio project using Python, FastAPI, Next.js, and Machine Learning.

---

## ✨ Features

### 📄 Resume Skill Extraction
- Upload your resume as a PDF.
- Automatically extract relevant technical and professional skills.
- Extracted skills become the main source for the rest of the application.

### 👤 User Profile
- Enter your name.
- Select your course / education.
- Enter years of experience.
- No manual skill selection is required.

### 💼 Career Selection
Choose from multiple career paths, including:

- Data Scientist
- Data Analyst
- Machine Learning Engineer
- AI Engineer
- Data Engineer
- Business Intelligence Analyst
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Software Developer
- UI/UX Designer
- QA Software Tester
- Business Analyst
- Digital Marketing Specialist
- Marketing Analyst
- HR Analyst
- Financial Analyst
- Clinical Research Associate
- Pharmacovigilance Associate
- Regulatory Affairs Associate
- Medical Writer
- Quality Assurance – Pharma

### 🧠 AI Skill Gap Analysis
The application compares the skills extracted from the resume with the skills required for the selected career.

It identifies:

- ✅ Skills you already have
- ⚠️ Skills you are missing
- 📊 Overall skill match percentage
- 🎯 Job readiness score

### 🤖 Machine Learning Prediction

SkillGap AI uses a **Random Forest Regression** model to predict job readiness.

The model considers factors such as:

- Skill match percentage
- Experience
- Education level
- Technical skills

### 📚 Personalized Learning Recommendations
Missing skills are converted into learning recommendations so users know what to learn next.

### 📈 Progress Tracking
Users can:

- Track learning progress
- Mark skills as completed
- View completed and remaining skills
- Monitor their improvement

### 📊 Dashboard
The dashboard provides an overview of:

- Profile information
- Selected career
- Skills
- Skill gap
- Job readiness
- Learning progress

### 📑 Career Report
The Reports section provides a summary of:

- Candidate profile
- Selected career
- Current skills
- Missing skills
- Skill match
- Job readiness
- Learning progress

### 👥 Previous Users
SkillGap AI supports switching between users.

When a new user is started:

- The current user's profile is archived.
- Previous user information is stored in `users_history.csv`.
- The current profile is cleared.
- Learning progress is reset.

---

## 🔄 How It Works

```text
Resume Upload
      ↓
PDF Skill Extraction
      ↓
User Profile
      ↓
Select Career
      ↓
Compare Resume Skills
      ↓
Skill Gap Analysis
      ↓
Machine Learning Prediction
      ↓
Job Readiness Score
      ↓
Learning Recommendations
      ↓
Progress Tracking
      ↓
Career Report
````

---

## 🤖 Machine Learning

SkillGap AI includes a Machine Learning component to predict job readiness.

### Model

**RandomForestRegressor**

### Dataset

The project uses a generated dataset containing:

* 300 rows
* 12 columns

### Model Performance

| Metric              | Result |
| ------------------- | -----: |
| Mean Absolute Error | 3.4558 |
| R² Score            | 0.8644 |

### Important Features

| Feature                |       Importance |
| ---------------------- | ---------------: |
| Skill Match Percentage |           ~0.581 |
| Experience Years       |           ~0.289 |
| Education Level        |           ~0.077 |
| Other Skills           | Lower importance |

The model is trained using the data in:

```text
ml/data/skill_gap_data.csv
```

The trained model is stored at:

```text
ml/models/job_readiness_model.joblib
```

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     Next.js UI      │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST API
                               ↓
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │       Backend       │
                    └───────┬─────┬───────┘
                            │     │
                ┌───────────┘     └────────────┐
                ↓                              ↓
      ┌─────────────────┐            ┌─────────────────┐
      │  Skill Analysis │            │ Machine Learning│
      │      Logic      │            │ Random Forest   │
      └─────────────────┘            └─────────────────┘
                │                              │
                └──────────────┬───────────────┘
                               ↓
                    ┌─────────────────────┐
                    │ JSON / CSV Storage  │
                    └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### Machine Learning

* Scikit-learn
* Pandas
* NumPy
* Joblib

### Resume Processing

* PDF text extraction
* Python-based skill extraction

### Storage

* JSON
* CSV

---

## 📁 Project Structure

```text
ai-skill-gap-analyzer/
│
├── backend/
│   ├── data/
│   │   ├── jobs.json
│   │   ├── profile.json
│   │   ├── progress.json
│   │   ├── skills.json
│   │   └── users_history.csv
│   │
│   ├── learning_recommendations.py
│   ├── main.py
│   ├── skill_extraction.py
│   └── skill_gap.py
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   ├── learning/
│   │   ├── profile/
│   │   ├── progress/
│   │   ├── reports/
│   │   ├── resume/
│   │   ├── skill-gap/
│   │   ├── users/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── components/
│       ├── BunnyGuide.tsx
│       ├── BunnyIcon.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
│
├── ml/
│   ├── data/
│   │   ├── skill_gap_data.csv
│   │   └── skill_gap_data_v1.csv
│   │
│   ├── models/
│   │   └── job_readiness_model.joblib
│   │
│   ├── eda.py
│   ├── generate_data.py
│   ├── predict.py
│   ├── train.py
│   ├── requirements.txt
│   └── __init__.py
│
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/itsnehabisht/ai-skill-gap-analyzer.git
```

Move into the project:

```bash
cd ai-skill-gap-analyzer
```

---

## 🐍 Backend Setup

Open a terminal and run:

```cmd
cd D:\Projects\ai-skill-gap-analyzer\backend
```

Activate the Python virtual environment:

```cmd
venv\Scripts\activate
```

Start the FastAPI server:

```cmd
uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 💻 Frontend Setup

Open a **second terminal**.

```cmd
cd D:\Projects\ai-skill-gap-analyzer\frontend
```

Install dependencies if required:

```cmd
npm install
```

Start the development server:

```cmd
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

> The Python virtual environment is only required for the backend. You do not need to activate it in the frontend terminal.

---

## 🔌 API Endpoints

### Health Check

```http
GET /health
```

Checks whether the backend is running correctly.

---

### Student Profile

```http
POST /api/profile
```

Creates or updates the user's profile.

---

### Resume Upload

```http
POST /api/resume
```

Uploads a PDF resume and extracts skills.

---

### Resume Skills

```http
GET /api/resume/skills
```

Returns skills extracted from the current resume.

---

### User Switch

```http
POST /api/users/switch
```

Archives the current user and starts a new user profile.

---

### Previous Users

```http
GET /api/users/history
```

Returns previously archived users.

---

## 👤 User Management

SkillGap AI supports multiple users without requiring a database.

When **Start New User** is selected:

```text
Current User
     ↓
Archive Profile + Progress
     ↓
Save to users_history.csv
     ↓
Clear Current Profile
     ↓
Reset Learning Progress
     ↓
New User
```

Previous users can be viewed from:

```text
Previous Users
```

in the sidebar.

---

## 📄 Resume Analysis

The resume workflow is:

```text
Upload PDF
    ↓
Extract Text
    ↓
Identify Skills
    ↓
Save Skills to Profile
    ↓
Use Skills Across Application
```

The extracted resume skills are used consistently by:

* Skill Gap
* Learning Recommendations
* Progress
* Dashboard
* Reports

This avoids requiring users to manually enter their skills.

---

## 📊 Dashboard & Progress

The dashboard provides a quick overview of the user's career readiness.

Users can see:

* Current skills
* Missing skills
* Skill match percentage
* Job readiness
* Learning progress
* Selected career

The Progress page allows users to track completed learning skills.

---

## 🎨 UI Design

SkillGap AI uses a clean and modern visual design focused on readability and confidence.

### Design Colors

| Purpose        | Color     |
| -------------- | --------- |
| Background     | `#F4F1FC` |
| Cards          | `#FFFFFF` |
| Inset Cards    | `#FBFAFE` |
| Primary Text   | `#211D3D` |
| Secondary Text | `#615C7A` |
| Accent Blue    | `#4C5FEA` |
| Accent Hover   | `#3B4AD1` |
| Success        | `#22A366` |
| Warning        | `#F0883E` |
| Critical       | `#E5484D` |

---

## 🔐 Validation & Error Handling

The application includes validation for:

* Resume file type
* Resume file size
* Profile information
* Experience years
* Education level
* Skill match percentage
* Missing backend data
* Empty resume skills
* API errors

Resume uploads are restricted to PDF files under 5 MB.

---

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Resume Upload
![Resume Upload](screenshots/resume.png)

### Skill Gap Analysis
![Skill Gap](screenshots/skill-gap.png)

### Learning Roadmap
![Learning](screenshots/learning.png)
```

---

## 🚀 Future Improvements

Possible future improvements include:

* PostgreSQL database integration
* User authentication
* Cloud deployment
* More advanced NLP-based resume analysis
* LinkedIn profile integration
* More career paths
* Improved recommendation algorithms
* Personalized learning resources
* Resume quality scoring
* AI-powered career guidance
* Progress analytics and visualizations

---

## 👩‍💻 Author

**Neha Bisht**

BCA — Artificial Intelligence & Data Science

GitHub:

[https://github.com/itsnehabisht]

---

## 📌 Project Status

**Completed — Portfolio Project**

SkillGap AI was developed to demonstrate practical skills in:

* Full-stack development
* Python
* FastAPI
* Next.js
* Machine Learning
* Resume processing
* Data analysis
* REST APIs
* UI/UX design
* Git & GitHub

---

## 📄 License

This project is created for educational and portfolio purposes.