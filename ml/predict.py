import pandas as pd
import joblib


# Load the trained model
model = joblib.load("models/job_readiness_model.joblib")

print("Model loaded successfully!")


def predict_job_readiness(student_data):
    # Convert the student's data into a DataFrame
    student = pd.DataFrame([student_data])

    # Make prediction
    prediction = model.predict(student)

    # Round the prediction to 2 decimal places
    readiness = round(prediction[0], 2)

    return readiness


# Test the prediction
# Test Candidate 1
candidate_1 = {
    "python": 1,
    "sql": 1,
    "pandas": 1,
    "numpy": 1,
    "machine_learning": 1,
    "statistics": 1,
    "data_visualization": 1,
    "scikit_learn": 1,
    "experience_years": 5,
    "education_level": 3,
    "skill_match_percentage": 100
}

readiness_1 = predict_job_readiness(candidate_1)

print(f"Candidate 1 Job Readiness: {readiness_1}%")


# Test Candidate 2
candidate_2 = {
    "python": 1,
    "sql": 1,
    "pandas": 1,
    "numpy": 0,
    "machine_learning": 0,
    "statistics": 0,
    "data_visualization": 1,
    "scikit_learn": 0,
    "experience_years": 2,
    "education_level": 2,
    "skill_match_percentage": 50
}

readiness_2 = predict_job_readiness(candidate_2)

print(f"Candidate 2 Job Readiness: {readiness_2}%")


# Test Candidate 3
candidate_3 = {
    "python": 0,
    "sql": 0,
    "pandas": 0,
    "numpy": 0,
    "machine_learning": 0,
    "statistics": 0,
    "data_visualization": 0,
    "scikit_learn": 0,
    "experience_years": 0,
    "education_level": 1,
    "skill_match_percentage": 0
}

readiness_3 = predict_job_readiness(candidate_3)

print(f"Candidate 3 Job Readiness: {readiness_3}%")