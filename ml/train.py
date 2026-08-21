import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

import joblib


# Load the dataset
data = pd.read_csv("data/skill_gap_data_v1.csv")

print("Dataset loaded successfully!")
print(data.head())


# Separate input features and target
X = data.drop("job_readiness", axis=1)
y = data["job_readiness"]


# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create the Random Forest model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)


# Train the model
model.fit(X_train, y_train)

print("Model training completed!")


# Make predictions
predictions = model.predict(X_test)


# Calculate error
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("Mean Absolute Error:", mae)
print("R² Score:", r2)


# Save the trained model
joblib.dump(
    model,
    "models/job_readiness_model.joblib"
)

print("Model saved successfully!")

print("\nFeature Importance:")

for feature, importance in zip(X.columns, model.feature_importances_):
    print(f"{feature}: {importance:.3f}")