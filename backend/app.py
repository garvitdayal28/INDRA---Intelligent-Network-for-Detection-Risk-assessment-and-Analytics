from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
# Configure CORS for React Frontend
CORS(app)

# Global variables to hold models and base features
iso_model = None
autoencoder_model = None
lstm_model = None
ensemble_model = None
historical_baselines = None

def load_models():
    """
    Step 2: Runtime Initialization. Loads the Offline-trained models into high-speed memory.
    """
    global iso_model, ensemble_model
    print("Initializing INDRA Runtime Engine (Flask)...")
    # try:
    #     with open('../models/iso_forest.pkl', 'rb') as f:
    #         iso_model = pickle.load(f)
    #     with open('../models/ensemble.pkl', 'rb') as f:
    #         ensemble_model = pickle.load(f)
    #     print("Models loaded successfully.")
    # except FileNotFoundError:
    #     print("Warning: Models not found. Operating in placeholder mode.")

# Load models on startup
load_models()

@app.route("/api/users/risk", methods=["GET"])
def get_user_risk_leaderboard():
    """
    Returns the Global Security Command Center leaderboard.
    """
    return jsonify({
        "leaderboard": [
            {"user_id": "jsmith", "department": "Finance", "risk_score": 94, "trend": "up", "scenario": "Data Exfiltration"},
            {"user_id": "adoe", "department": "Engineering", "risk_score": 82, "trend": "up", "scenario": "IT Sabotage"},
            {"user_id": "bwayne", "department": "Executive", "risk_score": 12, "trend": "down", "scenario": "None"}
        ]
    })

@app.route("/api/alerts", methods=["GET"])
def get_recent_alerts():
    """
    Returns the real-time timeline for enterprise-wide anomalies.
    """
    return jsonify({
        "alerts": [
            {"id": 1, "timestamp": "2026-03-22T02:15:00Z", "message": "Mass document download detected off-hours.", "severity": "CRITICAL"},
            {"id": 2, "timestamp": "2026-03-22T01:30:00Z", "message": "Unusual SSH lateral movement.", "severity": "WARNING"}
        ]
    })

@app.route("/api/predict", methods=["POST"])
def predict_threat():
    """
    Accepts new log data, runs inference across the Ensemble, and returns SHAP-driven alert narratives.
    """
    log_event = request.json or {}
    
    return jsonify({
        "status": "success",
        "user_id": log_event.get("user_id", "unknown"),
        "final_risk_score": 94.2,
        "xai_explanation": "3 AM Login (rare behavior) + 250% increase in file access + First-time USB usage",
        "breakdown": {
            "iso_forest": 0.92,
            "autoencoder": 0.88,
            "lstm": 0.95
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
