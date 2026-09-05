# 🎯 SkillGap AI

> **AI skill gap analyzer that helps students understand their job readiness, identify missing skills, and build a personalized learning roadmap.**

SkillGap AI analyzes a student's profile and resume, compares their skills with the requirements of a selected career, identifies skill gaps, predicts job readiness using machine learning, and recommends what to learn next.

---

## ✨ Features

- 👤 **Student Profile** — Manage name, education/course, and experience.
- 📄 **Resume Skill Extraction** — Upload a PDF resume and automatically extract relevant skills.
- 💼 **Career Selection** — Choose from multiple career/job roles with different skill requirements.
- 🎯 **Skill Gap Analysis** — Compare resume skills with the selected job's required skills.
- 🤖 **ML Job Readiness Prediction** — Predict job readiness using a trained Random Forest regression model.
- 📚 **Personalized Learning Recommendations** — Get recommendations based on identified skill gaps.
- 📈 **Progress Tracking** — Track completed skills and learning progress.
- 📊 **Interactive Dashboard** — View readiness, skill match, gaps, recommendations, and progress in one place.
- 📑 **Career Report** — Generate a consolidated career-readiness report.
- 👥 **Previous Users** — Create/switch users and restore saved profile, resume skills, selected career, and progress data.
- 🎨 **Responsive UI** — Clean and student-friendly interface designed for an engaging career-planning experience.

---

## 🧠 How It Works

```text
                    ┌─────────────────────┐
                    │    Student Profile  │
                    │ Name • Education    │
                    │ Experience          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Resume Upload    │
                    │   PDF Skill         │
                    │   Extraction        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Career Selection │
                    │    Target Job Role  │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌─────────────────────────────────┐
              │        Skill Gap Analysis       │
              │ Resume Skills ↔ Job Requirements│
              └───────────────┬─────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
      ┌───────────────────┐       ┌───────────────────┐
      │ Machine Learning  │       │ Recommendation    │
      │ Job Readiness     │       │ & Learning Roadmap│
      └─────────┬─────────┘       └─────────┬─────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
                    ┌─────────────────────┐
                    │     Dashboard       │
                    │ Readiness • Gaps    │
                    │ Progress • Report   │
                    └─────────────────────┘
````

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS**

### Backend

* **Python**
* **FastAPI**
* **Pydantic**
* **Uvicorn**

### Machine Learning

* **scikit-learn**
* **RandomForestRegressor**
* **Pandas**
* **Joblib**

### Data & Processing

* JSON-based application state
* CSV historical user records
* PDF resume processing
* Resume skill extraction

---

## 🤖 Machine Learning

SkillGap AI includes a machine-learning component to estimate a candidate's **job readiness score**.

### Model

**Random Forest Regressor**

The model uses candidate-related features such as:

* Python
* SQL
* Pandas
* NumPy
* Machine Learning
* Statistics
* Data Visualization
* Scikit-learn
* Experience Years
* Education Level
* Skill Match Percentage

### Model Performance

The trained model achieved:

| Metric                    |       Result |
| ------------------------- | -----------: |
| Mean Absolute Error (MAE) |     **3.46** |
| R² Score                  |   **0.8644** |
| Training Dataset          | **300 rows** |
| Input Features            |       **11** |

### Important Features

The strongest model features were:

| Feature                | Approx. Importance |
| ---------------------- | -----------------: |
| Skill Match Percentage |          **0.581** |
| Experience Years       |          **0.289** |
| Education Level        |          **0.077** |

> The model is intended as a project-level job-readiness estimation and should not be interpreted as a professional hiring assessment.

---

## 📂 Project Structure

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
│   │   └── users/
│   │
│   └── components/
│       ├── BunnyIcon.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
│
├── ml/
│   ├── data/
│   │   └── skill_gap_data.csv
│   ├── models/
│   │   └── job_readiness_model.joblib
│   ├── eda.py
│   ├── generate_data.py
│   ├── predict.py
│   └── train.py
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/itsnehabisht/ai-skill-gap-analyzer.git
cd ai-skill-gap-analyzer
```

---

### 2. Backend Setup

Open a terminal:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

---

## 🔄 Typical User Flow

```text
Create Profile
      ↓
Upload Resume
      ↓
Resume Skills Extracted
      ↓
Select Target Career
      ↓
Analyze Skill Gap
      ↓
View Job Readiness
      ↓
Get Learning Recommendations
      ↓
Track Learning Progress
      ↓
Generate Career Report
```

---

## 👥 User Management

SkillGap AI supports multiple user profiles through its **Previous Users** functionality.

When switching users, the application can preserve and restore:

* 👤 Profile information
* 📄 Resume-extracted skills
* 💼 Selected career
* 📈 Completed learning skills

This allows users to return to a previous profile without rebuilding their career analysis from scratch.

---

## 📸 Screenshots

### 🏠 Dashboard

![SkillGap AI Dashboard](screenshots/dashboard.png)

### 📄 Resume Upload

![Resume Upload](screenshots/resume.png)

### 🎯 Skill Gap Analysis

![Skill Gap Analysis](screenshots/skill-gap.png)

### 📚 Learning Recommendations

![Learning Recommendations](screenshots/learning.png)

### 📑 Career Report

![Career Report](screenshots/reports.png)

---

## 🔮 Future Improvements

Some possible future enhancements include:

* 🔐 User authentication and secure accounts
* 🗄️ PostgreSQL or another production database
* ☁️ Cloud deployment
* 🧠 More advanced NLP-based resume parsing
* 🎯 Improved job-role matching
* 📊 Larger real-world training datasets
* 📈 Personalized progress analytics
* 🔗 Integration with learning platforms and job portals

---

## 🎓 Project Purpose

SkillGap AI was developed as a practical **Artificial Intelligence & Data Science project** to explore how machine learning, resume processing, backend APIs, and modern web development can be combined into a real-world career guidance application.

The project focuses on turning a student's existing skills into actionable career insights rather than simply displaying a list of missing skills.

---

## 👩‍💻 Author

**Neha Bisht**
BCA — Artificial Intelligence & Data Science

🔗 GitHub: [@itsnehabisht](https://github.com/itsnehabisht)

---

## ⭐ If You Find This Project Interesting

Feel free to explore the repository, try the application, and use the project as inspiration for your own AI/ML portfolio.

---

## 📌 Disclaimer

SkillGap AI is an educational and portfolio project. Its job-readiness prediction and recommendations are intended for learning and career guidance purposes and should not be considered professional recruitment or hiring advice.