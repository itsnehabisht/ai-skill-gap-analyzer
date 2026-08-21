import random
import pandas as pd


# Make the results reproducible
random.seed(42)


rows = []


for _ in range(300):

    # Generate candidate skills
    python = random.randint(0, 1)
    sql = random.randint(0, 1)
    pandas = random.randint(0, 1)
    numpy = random.randint(0, 1)
    machine_learning = random.randint(0, 1)
    statistics = random.randint(0, 1)
    data_visualization = random.randint(0, 1)
    scikit_learn = random.randint(0, 1)

    # Generate experience and education
    experience_years = random.randint(0, 5)
    education_level = random.randint(1, 3)

    # Calculate how many required skills the candidate has
    skill_count = (
        python
        + sql
        + pandas
        + numpy
        + machine_learning
        + statistics
        + data_visualization
        + scikit_learn
    )

    # Convert skill count into a percentage
    skill_match_percentage = round((skill_count / 8) * 100)

    # Calculate a base readiness score
    skill_score = skill_match_percentage * 0.55
    experience_score = min(experience_years * 4, 20)
    education_score = education_level * 5

    # Add a small amount of randomness
    noise = random.uniform(-5, 5)

    job_readiness = (
        skill_score
        + experience_score
        + education_score
        + noise
    )

    # Keep readiness between 0 and 100
    job_readiness = max(0, min(100, job_readiness))

    rows.append({
        "python": python,
        "sql": sql,
        "pandas": pandas,
        "numpy": numpy,
        "machine_learning": machine_learning,
        "statistics": statistics,
        "data_visualization": data_visualization,
        "scikit_learn": scikit_learn,
        "experience_years": experience_years,
        "education_level": education_level,
        "skill_match_percentage": skill_match_percentage,
        "job_readiness": round(job_readiness, 2)
    })


# Convert the generated records into a DataFrame
data = pd.DataFrame(rows)


# Save the new dataset
data.to_csv(
    "data/skill_gap_data_v1.csv",
    index=False
)


print("New dataset created successfully!")
print("Rows:", len(data))
print("Columns:", len(data.columns))
print(data.head())