import pandas as pd


# Load the dataset
data = pd.read_csv("data/skill_gap_data_v1.csv")


print("Dataset Shape:")
print(data.shape)


print("\nDataset Information:")
print(data.info())


print("\nMissing Values:")
print(data.isnull().sum())


print("\nDataset Description:")
print(data.describe())

print("\nDuplicate Rows:")
print(data.duplicated().sum())

print("\nJob Readiness Distribution:")
print(data["job_readiness"].value_counts().sort_index())

print("\nSkill Match vs Job Readiness Correlation:")
print(
    data["skill_match_percentage"].corr(
        data["job_readiness"]
    )
)