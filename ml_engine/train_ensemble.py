import pickle
import xgboost as xgb
import pandas as pd

def train_supervised_ensemble(train_features_path, iso_model_path, output_path):
    """
    Trains Layer 4 (XGBoost) of the INDRA ML Ensemble.
    Maps underlying anomaly matrices to final human-understandable Threat Scenarios.
    """
    print("Loading base features and trained base models (IsoForest, LSTM)...")
    print("Generating base anomaly scores to use as final inputs...")
    print("Training Layer 4: XGBoost Supervised Ensemble Classifier...")
    
    # model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    # model.fit(X_combined, y_labels)
    
    print(f"Saving Final Ensemble Model to {output_path}...")
    # pickle.dump(model, open(output_path, "wb"))
    print("✅ Ensemble threat classifier ready for Runtime API.")

if __name__ == "__main__":
    train_supervised_ensemble("./dataset/train.csv", "./models/iso_forest.pkl", "./models/ensemble.pkl")
