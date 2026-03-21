import { useState, useEffect } from 'react'

function App() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [predictResult, setPredictResult] = useState(null)

  useEffect(() => {
    // Fetch Global Security Command Center leaderboard
    fetch('http://localhost:8000/api/users/risk')
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data.leaderboard)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching leaderboard:", err)
        setLoading(false)
      })
  }, [])

  const handleSimulateLog = () => {
    fetch('http://localhost:8000/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: 'jsmith', action: 'file_download' })
    })
      .then(res => res.json())
      .then(data => {
        setPredictResult(data)
      })
      .catch(err => {
        console.error("Error simulating test:", err)
      })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="border-b border-slate-700 pb-4">
          <h1 className="text-3xl font-bold text-emerald-400 tracking-tight">INDRA Command Center</h1>
          <p className="text-slate-400 mt-2">Intelligent Network for Detection Risk assessment and Analytics</p>
        </header>

        {/* Section 1: Leaderboard */}
        <section className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">High-Risk Users Leaderboard</h2>
          {loading ? (
            <div className="animate-pulse text-slate-400">Loading risk scores from Flask ML Backend... (Make sure Flask is running on port 8000)</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="p-3">User ID</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Risk Score</th>
                    <th className="p-3">Threat Scenario</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, idx) => (
                    <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                      <td className="p-3 font-mono font-medium">{user.user_id}</td>
                      <td className="p-3 text-slate-400">{user.department}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-sm font-bold ${
                          user.risk_score > 80 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {user.risk_score}/100
                        </span>
                      </td>
                      <td className="p-3 text-amber-400">{user.scenario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Section 2: Model Tester */}
        <section className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Real-Time Threat Detection Testing</h2>
          <p className="text-sm text-slate-400 mb-6">Simulate a log ingestion event to test the XGBoost Ensemble and SHAP XAI explainer.</p>
          
          <button 
            onClick={handleSimulateLog}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30 cursor-pointer"
          >
            Run Simulated Inference
          </button>

          {predictResult && (
            <div className="mt-6 bg-slate-900 rounded-lg p-5 border border-red-500/30 relative overflow-hidden">
              {/* Alert Ribbon */}
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              
              <h3 className="text-lg font-bold text-red-400 mb-2">🚨 Threat Detected: Action Required</h3>
              <p className="text-slate-300 font-mono text-sm mb-4 bg-black/20 p-2 rounded">{predictResult.xai_explanation}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm text-slate-400">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <span className="block text-xs uppercase tracking-wider mb-1">Isolation Forest</span>
                  <span className="font-bold text-slate-200">{(predictResult.breakdown.iso_forest * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <span className="block text-xs uppercase tracking-wider mb-1">Autoencoder</span>
                  <span className="font-bold text-slate-200">{(predictResult.breakdown.autoencoder * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 border-b-2 border-b-red-500">
                  <span className="block text-xs uppercase tracking-wider mb-1">Final Risk Score</span>
                  <span className="font-bold text-red-400">{predictResult.final_risk_score} / 100</span>
                </div>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default App
