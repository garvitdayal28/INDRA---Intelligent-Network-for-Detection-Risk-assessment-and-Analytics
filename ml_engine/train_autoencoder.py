import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import os

class BehavioralAutoencoder(nn.Module):
    def __init__(self, input_dim):
        super(BehavioralAutoencoder, self).__init__()
        self.encoder = nn.Sequential(nn.Linear(input_dim, 16), nn.ReLU(), nn.Linear(16, 8), nn.ReLU(), nn.Linear(8, 4))
        self.decoder = nn.Sequential(nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 16), nn.ReLU(), nn.Linear(16, input_dim))
    def forward(self, x): return self.decoder(self.encoder(x))

def train_autoencoder(feature_store_path, model_output_path):
    print(f"Loading feature store from {feature_store_path}...")
    if not os.path.exists(feature_store_path): return
    df = pd.read_csv(feature_store_path)
    feature_cols = ['action_count', 'after_hours_actions', 'has_attachments', 'risk_z_score']
    df[feature_cols] = df[feature_cols].fillna(0)
    X = torch.tensor(df[feature_cols].values, dtype=torch.float32)
    
    print("Initializing Layer 2: Deep Autoencoder...")
    model = BehavioralAutoencoder(input_dim=len(feature_cols))
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    
    print("Training Autoencoder...")
    epochs = 10 
    for epoch in range(epochs):
        optimizer.zero_grad()
        outputs = model(X)
        loss = criterion(outputs, X)
        loss.backward()
        optimizer.step()
        
    print(f"Saving Layer 2 to {model_output_path}...")
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    torch.save(model.state_dict(), model_output_path)
    print("✅ Layer 2 Autoencoder trained and saved.")

if __name__ == "__main__":
    train_autoencoder("dataset/feature_store.csv", "models/autoencoder.pt")
