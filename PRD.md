# Product Requirements Document (PRD): AI-Powered Insider Threat Detection System

## 1. Product Overview
The AI-Powered Insider Threat Detection System is a comprehensive cybersecurity solution designed to identify, analyze, and mitigate internal threats within an organization. By leveraging an advanced ensemble Machine Learning architecture over structured activity logs, the system will detect anomalous and high-risk behavior from employees before critical data is compromised.

## 2. Objectives and Goals
- **Proactive & Explainable Detection Engine:** Develop a highly accurate ML model with a focus on high precision (minimizing false alarms) and recall. Incorporate Explainable AI (XAI) to show *why* a user is risky (e.g., "User logged in at 2 AM + accessed 300 files").
- **Actionable Visualization Platform:** Build a real-time dashboard featuring User Risk Timelines, Attack Scenario mapping, and Graph-based relationship views.
- **Robust Data Processing Pipeline:** Implement temporal aggregation and user-level modeling to convert raw logs into powerful behavioral profiles.

## 3. Data Source
This project utilizes the **CERT Insider Threat Dataset** hosted on Kaggle (`nitishabharathi/cert-insider-threat`).

**Snippet to download the dataset:**
```python
import kagglehub
path = kagglehub.dataset_download("nitishabharathi/cert-insider-threat")
print("Path to dataset files:", path)
```

## 4. Feature Engineering & Data Processing
*This is the core differentiator for high accuracy.*
- **Temporal Aggregation:** Transition from raw logs to aggregated features (Daily features, Weekly behavior, Session-based patterns).
- **User-Level Modeling:** Don't treat rows independently. Group by user (`user -> sequence of actions -> behavior profile`).
- **Targeted Features:** Must-have features include time-based anomalies (e.g., logins at odd hours), access volumes, and contextual activity.
- **Class Imbalance Handling:** Address the highly skewed CERT dataset using `class_weight='balanced'`, SMOTE, or anomaly threshold tuning.

## 5. Threat Detection Engine (AI/ML Architecture)
**The Final Winning Model Stack:**
- **Layer 1: Isolation Forest:** For fast, baseline anomaly detection.
- **Layer 2: Autoencoder:** To capture deep, complex behavioral patterns and reconstruction errors.
- **Layer 3: LSTM / Transformer:** For sequential modeling of user actions over time.
- **Final Layer: Ensemble Scoring:** Combine model outputs for robust accuracy. Example formulation:
  `final_score = (0.3 * iso_score + 0.4 * autoencoder_score + 0.3 * xgb_prob)`

**Threshold Optimization:**
- Instead of using fixed thresholds, use ROC curves to choose a dynamic threshold that maximizes the F1-score.

## 6. Visualization and Dashboard (The Hackathon "Wow" Factor)
- **Explainable AI (XAI) View:** Use SHAP values and Feature Importance to provide natural language context to alerts (Context over arbitrary scores).
- **User Risk Timeline:** Visually display the progression of a threat (e.g., Day 1: Normal → Day 5: Slight Anomaly → Day 10: HIGH RISK).
- **Attack Scenario Detection:** Map detected anomalies to specific, real-world attack patterns such as:
  - Data Exfiltration
  - Resignation Behavior (hoarding/deleting files)
  - IT Sabotage
- **Graph-Based View (Advanced):** Interactive maps showing relationships: `User → Device → File → Email`. This highlights unusual lateral movements or obscure connections.

## 7. Target Audience
- **Security Analysts / InfoSec Teams:** To continuously monitor organizational threats, investigate anomalies, and respond to alerts.
- **System Administrators:** To manage log streams and ensure system uptime.

## 8. Privacy and Security
- **Data Anonymization:** Implementation of techniques like hashing or pseudonymization for sensitive user fields.
- **Encryption:** Secure data storage and transmission via industry-standard encryption (e.g., AES-256).

## 9. Deliverables
1. **Functional Prototype:** Integrated end-to-end system including Data Pipeline, Ensemble ML Engine, and UI Dashboard.
2. **Source Code:** Clean, modular, and well-documented codebase.
3. **Documentation:** Technical architecture overview, setup instructions, and privacy/security implementation details.
4. **Demo Video (5–10 mins):** A walkthrough highlighting the User Risk Timeline, Graph View, and Attack Scenarios.
5. **Performance Report:** Detailed breakdown of model evaluation metrics (focusing on Precision/Recall optimization).
