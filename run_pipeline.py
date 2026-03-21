import os
import subprocess

print("\n🚀 Starting INDRA Offline Pipeline 🚀\n")

# Use the virtual environment Python we created for dependencies
python_exe = os.path.join("venv", "Scripts", "python.exe")

commands = [
    (f"{python_exe} data_pipeline/preprocess.py", "1. Download and Preprocess Raw Logs"),
    (f"{python_exe} data_pipeline/feature_engineering.py", "2. Feature Engineering & Baselines"),
    (f"{python_exe} ml_engine/train_iso_forest.py", "3. Train Layer 1: Isolation Forest"),
    (f"{python_exe} ml_engine/train_autoencoder.py", "4. Train Layer 2: Deep Autoencoder"),
    (f"{python_exe} ml_engine/train_lstm.py", "5. Train Layer 3: Sequence LSTM"),
    (f"{python_exe} ml_engine/train_ensemble.py", "6. Train Layer 4: Supervised XGBoost Ensemble")
]

for cmd, desc in commands:
    print(f"{'='*50}")
    print(f"Executing: {desc}")
    print(f"{'='*50}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"\n❌ Pipeline Failed at: {desc}")
        exit(1)

print("\n🎉 All 6 Pipeline Stages Completed Successfully! 🎉")
