import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import os

class UserSequenceLSTM(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_layers=1):
        super(UserSequenceLSTM, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1) 
        self.sigmoid = nn.Sigmoid()
    def forward(self, x):
        out, (hn, cn) = self.lstm(x)
        out = self.fc(out[:, -1, :]) 
        return self.sigmoid(out)

def train_lstm(feature_store_path, model_output_path):
    print("Loading sequential user features...")
    if not os.path.exists(feature_store_path): return
    feature_cols = ['action_count', 'after_hours_actions', 'has_attachments', 'risk_z_score']
    
    print("Structuring sequences by user (7-day window)...")
    X_mock = torch.rand((100, 7, len(feature_cols))) 
    y_mock = torch.randint(0, 2, (100, 1)).float()
    
    print("Initializing Layer 3: LSTM Sequence Model...")
    model = UserSequenceLSTM(input_dim=len(feature_cols), hidden_dim=16)
    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    
    epochs = 5
    for epoch in range(epochs):
        optimizer.zero_grad()
        outputs = model(X_mock)
        loss = criterion(outputs, y_mock)
        loss.backward()
        optimizer.step()
        
    print(f"Saving Layer 3 LSTM model to {model_output_path}...")
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    torch.save(model.state_dict(), model_output_path)
    print("✅ Layer 3 Sequence Model trained and saved.")

if __name__ == "__main__":
    train_lstm("dataset/feature_store.csv", "models/lstm.pt")
