# Product Requirements Document (PRD): INDRA - Intelligent Network for Detection Risk assessment and Analytics

## 1. Product Overview
INDRA - Intelligent Network for Detection Risk assessment and Analytics is a comprehensive cybersecurity solution designed to identify, analyze, and mitigate internal threats within an organization. By leveraging an advanced ensemble Machine Learning architecture over structured activity logs, the system will detect anomalous and high-risk behavior from employees before critical data is compromised.

**The Innovation Differentiator:** The system uniquely combines temporal behavioral modeling, explainable AI, and graph-based relationship analysis to provide both high-accuracy detection and human-interpretable insights.

**Why This Beats Traditional Systems:** Unlike traditional rule-based systems, this approach adapts dynamically to evolving user behavior, reducing false alarms while detecting subtle insider threats.

**Execution Simplicity:** The system is designed with a modular architecture, allowing incremental implementation (baseline → deep models → advanced features) to ensure a functional prototype within hackathon constraints.

## 2. Objectives and Goals
- **Proactive & Explainable Detection Engine:** Develop a highly accurate ML model incorporating Explainable AI (XAI) to show *why* a user is risky.
- **Measurable Performance Targets:** 
  - Precision ≥ **90%**
  - Recall ≥ **85%**
  - False Positive Rate (FPR) ≤ **5%**
  - **Latency / Scale:** API response time target < 200ms, capable of processing 10,000+ logs per second.
- **Actionable Visualization Platform:** Build a real-time dashboard featuring User Risk Timelines, Attack Scenario mapping, and Graph-based relationship views.
- **Robust Data Processing Pipeline:** Implement temporal aggregation and user-level modeling to convert raw logs into powerful behavioral profiles.

## 3. Data Source & Constraints
This project utilizes the **CERT Insider Threat Dataset** hosted on Kaggle (`nitishabharathi/cert-insider-threat`).

**Dataset Reality Constraints:**
- The dataset is **highly imbalanced** (anomalies represent <0.1% of activity).
- It contains **synthetic but realistic attack scenarios**.
- It strictly requires **temporal + user-level aggregation** to successfully separate threat signals from daily noise.

## 4. Feature Engineering & Data Processing
*This is the core differentiator for high accuracy.*
- **Behavioral Baseline Modeling:** Each user is modeled relative to their historical baseline rather than global averages. This prevents flagging night-shift employees incorrectly and detects true *deviation*, not just global anomalies.
- **Temporal Aggregation:** Transition from raw logs to aggregated features (Daily features, Weekly behavior, Session-based patterns).
- **User-Level Modeling:** Group by user (`user -> sequence of actions -> behavior profile`).
- **Targeted Features:** Must-have features include time-based anomalies (e.g., logins at odd hours), access volumes, and contextual activity.
- **Class Imbalance Handling:** Address the highly skewed dataset using `class_weight='balanced'`, SMOTE, and precise anomaly threshold tuning.

## 5. Threat Detection Engine (AI/ML Architecture)
**The Final Winning Model Stack:**
- **Layer 1: Isolation Forest:** For fast, baseline anomaly detection.
- **Layer 2: Autoencoder:** To capture deep, complex behavioral patterns and reconstruction errors.
- **Layer 3: LSTM / Transformer:** For sequential modeling of user actions over time.
- **Final Layer: Ensemble Scoring (Supervised Layer):** Combine model outputs for robust accuracy. Example formulation:
  `final_score = (0.3 * iso_score + 0.4 * autoencoder_score + 0.3 * xgb_prob)`
  *Justification:* XGBoost acts as the supervised layer trained on known attack scenarios. It helps convert raw anomaly scores into final threat classification probabilities. The ensemble approach reduces individual model bias and improves robustness across different types of insider threats.

**Threshold Optimization:**
- Instead of using fixed thresholds, use **Precision-Recall (PR) curves** and ROC curves to choose a dynamic threshold that maximizes the F1-score for imbalanced data.

## 6. Visualization and Dashboard (The Hackathon "Wow" Factor)
- **"Why This Alert?" Panel (XAI View):** Use SHAP values and Feature Importance to provide natural language context.
  *Example UI output:* "User flagged because: 3 AM login (rare behavior) + 250% increase in file access + First-time USB usage."
- **Risk Score Breakdown:** Transparent, layered scoring.
  *Example UI output:* `Isolation Forest → 0.6 | Autoencoder → 0.9 | Sequence Model → 0.85 | Final Score → 0.82`
- **"Top Risk Users" Leaderboard:** Rank users by risk with trend arrows (↑ ↓) summarizing organizational threat levels.
- **User Risk Timeline:** Visually display the progression of a threat (Day 1: Normal → Day 5: Slight Anomaly → Day 10: HIGH RISK).
- **Attack Scenario Detection:** Map detected anomalies to specific, real-world attack patterns (e.g., Data Exfiltration, Resignation Behavior, IT Sabotage).
- **Graph-Based View (Advanced):** Interactive maps showing relationships: `User → Device → File → Email` to visualize lateral movement and obscure connections. *Graph-based analysis helps uncover indirect relationships and lateral movement patterns that are not detectable through isolated user-level features.*

## 7. System Architecture
**System Data Flow:**
`Data Ingestion → Preprocessing → Feature Store → ML Models → API → Dashboard`
- **Batch Processing:** Nightly aggregation for model training and historical baselining.
- **Real-Time Scoring:** Low-latency API-driven inference layer for real-time log ingestion and alert generation.

## 8. Model Evaluation Strategy
- **Metrics:** Precision, Recall, F1-score.
- **Visual Diagnostics:** Confusion Matrix, ROC curves, and most importantly, **Precision-Recall (PR) curves**.
- **False Positive Analysis & Failure Awareness:** Deep dive into why non-threats are flagged to continuously tune the Behavioral Baseline Models. *Note: The system may generate false positives during sudden but legitimate behavioral shifts (e.g., role changes), which are mitigated through adaptive baselining and threshold tuning.*
- **Ablation Study (Advanced Proof of Concept):** Show the performance gain of each layer to prove deep system understanding:
  - Isolation Forest only → Base F1 Score
  - \+ Autoencoder → Improved F1 Score
  - \+ Sequence Model + XGBoost → Best F1 Score

## 9. Privacy and Security
- **Data Anonymization:** Implementation of techniques like hashing or pseudonymization for sensitive user fields.
- **Encryption:** Secure data storage and transmission via industry-standard encryption (e.g., AES-256).

## 10. Innovation Highlights (Hackathon Differentiators)
- 🚀 **Hybrid Ensemble Architecture** combining unsupervised anomaly detection with supervised classification.
- 🚀 **Temporal Behavioral Modeling** against personalized baselines.
- 🚀 **Explainable AI-driven Alerts** to provide actionable human context.
- 🚀 **Graph-based Anomaly Detection** for lateral movement visibility.
- 🚀 **Scenario-aware Threat Classification** mapped to real-world insider threat vectors.

## 11. Deliverables
1. **Functional Prototype:** Integrated end-to-end system including Data Pipeline, Ensemble ML Engine, and UI Dashboard.
2. **Source Code:** Clean, modular, and well-documented codebase.
3. **Documentation:** Technical architecture overview, setup instructions, and privacy/security details.
4. **Demo Video (5–10 mins):** Walkthrough emphasizing the XAI Dashboard and Graph views.
5. **Performance Report:** Deep-Dive Evaluation metrics including the Ablation Study.
