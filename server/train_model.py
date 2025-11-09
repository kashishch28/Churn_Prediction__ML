# Standard library imports
import argparse
import json
import os
from pathlib import Path

# Set up argument parsing
parser = argparse.ArgumentParser(description='Train churn prediction model')
parser.add_argument('--debug', action='store_true', help='Run in debug mode with smaller dataset')
args = parser.parse_args()

# Third-party imports
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import joblib

# --- 1. LOAD & PREPARE DATA ---
# Set up paths using pathlib
SCRIPT_DIR = Path(__file__).parent.resolve()
DATA_FILE = SCRIPT_DIR / 'WA_Fn-UseC_-Telco-Customer-Churn.csv'
MODEL_FILE = SCRIPT_DIR / 'churn_model.pkl'
METRICS_FILE = SCRIPT_DIR / 'model_metrics.json'

print("⏳ Loading dataset...")
try:
    df = pd.read_csv(DATA_FILE)
except FileNotFoundError:
    print("❌ Error: 'WA_Fn-UseC_-Telco-Customer-Churn.csv' not found in server/ directory.")
    exit(1)

# Handle missing values in TotalCharges
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce').fillna(0)
df['SeniorCitizen'] = df['SeniorCitizen'].astype(int)

# Define features
NUMERIC_FEATURES = ['tenure', 'MonthlyCharges', 'TotalCharges']
CATEGORICAL_FEATURES = ['SeniorCitizen', 'Partner', 'Dependents', 'InternetService', 
                        'Contract', 'PaperlessBilling', 'PaymentMethod']
TARGET = 'Churn'

X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
y = df[TARGET].map({'Yes': 1, 'No': 0})

# In debug mode, use a smaller sample
if args.debug:
    print("🔍 Debug mode: using 20% sample of data and simplified model...")
    sample_size = int(len(X) * 0.2)
    sample_idx = np.random.choice(len(X), sample_size, replace=False)
    X = X.iloc[sample_idx]
    y = y.iloc[sample_idx]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# --- 2. BUILD PIPELINE ---
# Adjust model complexity based on mode
n_estimators = 10 if args.debug else 100
max_depth = 5 if args.debug else 10

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), NUMERIC_FEATURES),
        # Use dense output from OneHotEncoder to avoid sparse matrix issues with downstream estimator
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), CATEGORICAL_FEATURES)
    ])

model_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        random_state=42
    ))
])

# --- 3. TRAIN ---
print("🤖 Training model...")
model_pipeline.fit(X_train, y_train)

# --- 4. EVALUATE & EXTRACT INSIGHTS ---
y_pred = model_pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

# Extract Feature Importance
# Get the fitted OneHotEncoder from the preprocessor in a robust way
ohe = model_pipeline.named_steps['preprocessor'].named_transformers_['cat']
cat_feature_names = ohe.get_feature_names_out(CATEGORICAL_FEATURES)
feature_names = np.concatenate([np.array(NUMERIC_FEATURES), cat_feature_names])
importances = model_pipeline.named_steps['classifier'].feature_importances_

top_indices = np.argsort(importances)[::-1][:5]
top_features = [{"name": feature_names[i], "score": round(importances[i], 3)} for i in top_indices]

metrics = {
    "accuracy": round(accuracy, 3),
    "f1_score": round(f1, 3),
    "samples_tested": len(X_test),
    "top_features": top_features
}

# --- 5. SAVE ARTIFACTS ---
joblib.dump(model_pipeline, MODEL_FILE)
METRICS_FILE.write_text(json.dumps(metrics, indent=2))

print(f"\n✅ Training finished! Model saved as '{MODEL_FILE.name}'.")
print(f"📊 Metrics saved as '{METRICS_FILE.name}'.")