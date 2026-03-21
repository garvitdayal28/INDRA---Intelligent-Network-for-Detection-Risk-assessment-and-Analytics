import kagglehub
import os

def download_cert_dataset():
    """
    Downloads the nitishabharathi/cert-insider-threat dataset using KaggleHub.
    This script forms Step 1 of the Offline Data Pipeline.
    """
    print("Initializing download of CERT Insider Threat Dataset from Kaggle...")
    try:
        # Download latest version of the dataset
        path = kagglehub.dataset_download("nitishabharathi/cert-insider-threat")
        print(f"\n✅ Success! Dataset downloaded and cached successfully.")
        print(f"📂 Dataset Path: {path}")
        return path
    except Exception as e:
        print(f"\n❌ Failed to download dataset: {e}")
        return None

if __name__ == "__main__":
    download_cert_dataset()
