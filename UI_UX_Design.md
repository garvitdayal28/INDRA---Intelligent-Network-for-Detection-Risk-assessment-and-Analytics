# UI/UX Design Document: INDRA - Intelligent Network for Detection Risk assessment and Analytics

---

### 1.1 The Core Design Philosophy: "From Noise to Narrative"
Security dashboards often fail because they overwhelm the user with raw data and abstract risk percentages. 
The INDRA UI solves this by acting strictly as a **"Narrative Generator."** It answers *Who*, *What*, and *Why* immediately.

### 1.2 Input vs. Output Paradigm
- **Input Received by UI:** A JSON object containing an Employee ID, an overall risk score (0-100%), a breakdown of underlying model scores, contributing features (SHAP values), and historical graph connections.
- **Output Rendered by UI:** A story. Instead of a grid of raw logs, the output is a visualized timeline, natural language threat explanations, and interactive relationship maps.

### 1.3 Key Application Screens

#### Screen 1: The Global Security Command Center (Home)
**Target:** High-level overview for the CISO or Lead Security Analyst.
- **Top Bar Metrics:** `Total Monitored Users`, `Active High-Risk Alerts`, `System Health / Pipeline Latency`.
- **The Leaderboard:** A dynamic table of "Top 10 High-Risk Users."
  - *Columns:* User Name, Department, Risk Score (Color coded), Trend (↑ 15% this week), Current Threat Scenario (e.g., "Potential Resignation Sabotage").
- **Global Alert Timeline:** A sparkline chart showing the frequency of enterprise-wide anomalies over the last 30 days.

#### Screen 2: The User Risk Deep-Dive (The Investigator View)
**Target:** An analyst investigating a specific flagged employee.
- **User Profile Header:** Name, Role, Normal Working Hours (The Baseline), Typical Devices.
- **The "Why This Alert?" Panel (XAI Box):** 
  - A prominent, human-readable card explaining the latest flag.
  - *Example:* 🔴 **CRITICAL ALERT:** "User `jsmith` flagged. Primary drivers: **3 AM Login** (Highly Unusual) + **250% increase in proprietary repo access** + **First-time usage of mass USB transfer**."
- **Layered Score Breakdown:** A set of radial gauges explaining the ensemble model:
  - Isolation Forest Anomaly: 92%
  - Autoencoder Reconstruction Error: 88%
  - Sequential Risk (LSTM): 95%
  - **FINAL THREAT CONFIDENCE: 94%**
- **User Risk Timeline (Interactive Chart):**
  - An area chart marking the progression of the user's risk score over the past 30 days. 
  - Allows the analyst to pinpoint exactly when the employee's behavior shifted from normal (green) to suspicious (yellow) to hostile (red).

#### Screen 3: Threat Scenario & Graph Node View (Advanced)
**Target:** Threat hunting and lateral movement tracking.
- **Interactive Relationship Graph:** A node-based UI (using D3.js or Vis.js).
  - *Nodes:* Users, Workstations, IP Addresses, Sensitive File Repositories.
  - *Edges:* Actions (Logged into, Downloaded, Modified).
- **UX Goal:** The graph will highlight "Edges" in red if an action severely violates the user's historical baseline. This visually exposes lateral movement (e.g., a junior dev suddenly connecting to a production finance database).

### 1.4 UI Color Palette & Typography
To achieve the "Enterprise Hacker" aesthetic suitable for a winning hackathon:
- **Background Mode:** Deep Dark Mode (Hex `#0F172A` or `#111827`) to reduce eye strain and make alert colors pop.
- **Card Backgrounds:** Slightly lighter surface colors (`#1E293B`) with very subtle glassmorphism (transparency + background blur).
- **Typography:** Modern, clean sans-serif like `Inter` or `Geist`. Monospace font (`JetBrains Mono` or `Fira Code`) for specific IPs, IDs, or raw log snippets.
- **The Alert Spectrum:**
  - `Normal/Baseline:` Emerald Green (`#10B981`)
  - `Warning/Deviation:` Amber (`#F59E0B`)
  - `Critical/Breach:` Crimson Red (`#EF4444`)
  - `System/Neutral:` Neon Blue/Indigo (`#6366F1`)
