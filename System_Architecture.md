# System Architecture Document: INDRA - Intelligent Network for Detection Risk assessment and Analytics

---

The overarching goal of the INDRA architecture is to process massive amounts of raw, uncontextualized logs into precise, user-specific behavioral profiles. For the scope of the hackathon, the execution strategy is split into an **Offline Pipeline** and a **Runtime API**.

### 1.1 Hackathon Execution Strategy (Hybrid Approach)
To ensure a functional presentation and maximum reliability during the demo, the system specifically segments training and inference into a 3-step hybrid architecture.

```mermaid
graph TD
    %% Offline Core
    subgraph 1. Offline Backend (Data Science Pipeline)
    A[CERT Dataset / Offline] --> B[Preprocessing & Temporal Aggregation]
    B --> C[Model Training - IsoForest, Autoencoder, LSTM]
    C --> D[(Saved Models & Features: .pkl, .pt, Clean CSVs)]
    end

    %% Runtime
    subgraph 2. Runtime API (Flask/FastAPI)
    D --> |Loads Models & Baselines| E[REST API]
    E --> F[GET /api/alerts]
    E --> G[GET /api/users/risk]
    E --> H[POST /api/predict]
    end

    %% Client
    subgraph 3. Client Frontend (React/Vite)
    F --> I[React Dashboard]
    G --> I
    H --> I
    end

    classDef highrisk fill:#ff4d4f,stroke:#fff,stroke-width:2px,color:#fff;
    class E highrisk;
```

### 1.2 Component Breakdown

#### ✅ Step 1: The Offline Core (Backend Data Science)
*This is the core intellectual property of the system.*
- **Ingestion:** Download and load the highly imbalanced CERT Dataset offline.
- **Preprocessing:** Clean raw logs, execute temporal aggregation (daily/weekly bins), and establish user-level behavioral baselines.
- **Training:** Train the ensemble layers (Isolation Forest, Autoencoder, LSTM + XGBoost formulation).
- **Storage:** Persist the cleaned datasets, calculated features, and trained weights (`.pkl`, `.pt` files). 

#### ✅ Step 2: The Runtime API (Flask Backend)
- **Initialization:** Upon server start, the Flask API immediately loads the pre-trained models (`.pkl`/`.pt`) and historical user baselines into memory.
- **Simulation/Inference:** The API accepts new incoming JSON logs (or simulates a live stream of data from the saved test set) and generates real-time predictions.
- **Contextualization:** Generates anomaly scores and formats SHAP logic for explainable alerts.

#### ✅ Step 3: The Frontend Dashboard (React/Vite)
- **Data Fetching:** Continually fetches `/alerts`, `/users`, and temporal risk history from the API layer.
- **Rendering:** Translates numerical risk arrays into a unified visual narrative (Timelines, XAI Panels, and Graphs).
