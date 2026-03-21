import pandas as pd
import numpy as np
import os

def generate_behavioral_baselines(cleaned_data_path, output_path):
    print(f"Loading cleaned data from {cleaned_data_path}...")
    if not os.path.exists(cleaned_data_path): return
        
    df = pd.read_csv(cleaned_data_path)
    df['date'] = pd.to_datetime(df['date'])
    
    df['day'] = df['date'].dt.date
    df['hour'] = df['date'].dt.hour
    
    # Feature 1: After hours
    df['is_after_hours'] = ((df['hour'] < 8) | (df['hour'] > 18)).astype(int)
    
    # Feature 2: Has Attachments (email specific)
    df['has_attachments'] = (df['attachments'] > 0).astype(int) if 'attachments' in df.columns else 0
    
    daily_features = df.groupby(['user', 'day']).agg(
        action_count=('id', 'count') if 'id' in df.columns else ('date', 'count'),
        after_hours_actions=('is_after_hours', 'sum'),
        has_attachments=('has_attachments', 'sum')
    ).reset_index()
    
    daily_features['risk_z_score'] = daily_features.groupby('user')['action_count'].transform(
        lambda x: (x - x.mean()) / (x.std() + 1e-5)
    )
    
    daily_features['risk_z_score'] = daily_features['risk_z_score'].fillna(0)
    
    daily_features.to_csv(output_path, index=False)
    print("✅ Feature engineering complete.")

if __name__ == "__main__":
    generate_behavioral_baselines("./dataset/cleaned_merged.csv", "./dataset/feature_store.csv")
