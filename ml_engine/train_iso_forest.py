import os
import pickle
import pandas as pd
from sklearn.ensemble import IsolationForest

def train_isolation_forest(baseline_features_path, model_output_path):
    print("Loading temporal user baseline features...")
    df = pd.read_csv(baseline_features_path)
    features = ['action_count', 'after_hours_actions', 'has_attachments', 'risk_z_score']
    df[features] = df[features].fillna(0)
    X = df[features]
    
    print("Training Layer 1: Isolation Forest...")
    iso_model = IsolationForest(n_estimators=100, contamination=0.01, random_state=42)
    iso_model.fit(X)
    
    print(f"Saving Isolation Forest model to {model_output_path}...")
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    with open(model_output_path, 'wb') as f:
        pickle.dump(iso_model, f)
        
    print("✅ Layer 1 Base Anomaly Detection model trained and saved.")

if __name__ == "__main__":
    train_isolation_forest("dataset/feature_store.csv", "models/iso_forest.pkl")
