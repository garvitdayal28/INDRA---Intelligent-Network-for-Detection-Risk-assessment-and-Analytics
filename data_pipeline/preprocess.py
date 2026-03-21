import os
import pandas as pd
import kagglehub

def load_and_clean_data(dataset_path, output_path):
    print(f"Loading email logs from {dataset_path}...")
    CHUNK_SIZE = 100000 
    
    try:
        print("Parsing email.csv...")
        email_df = pd.read_csv(os.path.join(dataset_path, 'email.csv'), nrows=CHUNK_SIZE)
        
        print("Converting timestamps...")
        email_df['date'] = pd.to_datetime(email_df['date'], format='mixed', errors='coerce')
        email_df = email_df.dropna(subset=['date'])
        email_df = email_df.sort_values(by='date')
        
        print(f"Saving cleaned dataset to {output_path}...")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        email_df.to_csv(output_path, index=False)
        print("✅ Preprocessing complete.")
        return email_df
        
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    print("Connecting to Kaggle Hub to locate dataset path...")
    dataset_dir = kagglehub.dataset_download("nitishabharathi/cert-insider-threat")
    load_and_clean_data(dataset_dir, "./dataset/cleaned_merged.csv")
