# Standard library
import json
import os
from pathlib import Path

# Third-party imports
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import joblib
from pydantic import ValidationError

# Local imports
from schemas import PredictPayload

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Get the directory where this script lives and set paths relative to it
SCRIPT_DIR = Path(__file__).parent.resolve()
MODEL_PATH = SCRIPT_DIR / 'churn_model.pkl'
METRICS_PATH = SCRIPT_DIR / 'model_metrics.json'
DATA_PATH = SCRIPT_DIR / 'WA_Fn-UseC_-Telco-Customer-Churn.csv'

# --- LOAD ARTIFACTS ---
model = None
metrics = None
customer_df = None

if MODEL_PATH.exists():
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded.")
else:
    print("⚠️ Model file not found at:", MODEL_PATH)

if METRICS_PATH.exists():
    metrics = json.loads(METRICS_PATH.read_text())
else:
    print("⚠️ Metrics file not found at:", METRICS_PATH)

if DATA_PATH.exists():
    customer_df = pd.read_csv(DATA_PATH)
    customer_df['TotalCharges'] = pd.to_numeric(customer_df['TotalCharges'], errors='coerce').fillna(0)
    print(f"✅ Loaded {len(customer_df)} customers from CSV.")
else:
    print("⚠️ CSV file not found at:", DATA_PATH)

# --- ROUTES ---
@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    if not metrics: return jsonify({"error": "Metrics not available"}), 404
    return jsonify(metrics)

@app.route('/api/customers', methods=['GET'])
def get_customers():
    if customer_df is None: return jsonify({"error": "CSV not loaded"}), 404
    return jsonify(customer_df['customerID'].head(100).tolist())

@app.route('/api/customer/<customer_id>', methods=['GET'])
def get_customer_details(customer_id):
    if customer_df is None: return jsonify({"error": "CSV not loaded"}), 404
    cust = customer_df[customer_df['customerID'] == customer_id]
    if cust.empty: return jsonify({"error": "Customer not found"}), 404
    
    data = cust.iloc[0].to_dict()
    for k, v in data.items():
        if isinstance(v, (np.int64, np.float64)): data[k] = v.item()
    return jsonify(data)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Basic validation using pydantic schema which will coerce and validate types
        data = request.get_json()
        try:
            # pydantic v2: use model_validate
            payload = PredictPayload.model_validate(data)
        except ValidationError as ve:
            # Return detailed validation errors (v2 exposes errors() as well)
            return jsonify({"error": ve.errors()}), 400

        # Build DataFrame from validated payload (includes extra categorical fields)
        # pydantic v2: use model_dump to get a dict
        df_input = pd.DataFrame([payload.model_dump()])
        # Ensure SeniorCitizen is integer (pydantic already enforces it but be explicit)
        df_input['SeniorCitizen'] = df_input['SeniorCitizen'].astype(int)

        # Ensure model is available after validating input
        if not model:
            return jsonify({"error": "Model not loaded"}), 500

        # Run model prediction. Models may not implement predict_proba; handle gracefully.
        pred_arr = model.predict(df_input)
        pred = int(pred_arr[0]) if hasattr(pred_arr, '__iter__') else int(pred_arr)

        prob = None
        if hasattr(model, 'predict_proba'):
            try:
                prob_arr = model.predict_proba(df_input)
                # If predict_proba returns array-like, get probability of positive class
                prob = float(prob_arr[0][1])
            except Exception:
                prob = None

        # Fallback if predict_proba isn't available or failed: use prediction as probability (0/1)
        if prob is None:
            prob = 1.0 if pred == 1 else 0.0

        return jsonify({
            "churn_prediction": "Yes" if pred == 1 else "No",
            "churn_probability": round(prob, 4),
            "risk_score": int(prob * 100)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)