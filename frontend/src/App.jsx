import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import ForceGraph2D from 'react-force-graph-2d'

function App() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [predictResult, setPredictResult] = useState(null)
  const [graphWidth, setGraphWidth] = useState(400)
  const [selectedUser, setSelectedUser] = useState('jsmith')
  const containerRef = useRef(null)

  const [metrics, setMetrics] = useState(null)

  const handleSimulateLog = (targetUserId) => {
    setSelectedUser(targetUserId)
    fetch('http://localhost:8000/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: targetUserId, action: 'file_download' })
    })
      .then(res => res.json())
      .then(data => {
        setPredictResult(data)
      })
      .catch(err => {
        console.error("Error simulating test:", err)
      })
  }

  useEffect(() => {
    // Fetch offline evaluation metrics
    fetch('http://localhost:8000/api/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))

    // Fetch Global Security Command Center leaderboard
    fetch('http://localhost:8000/api/users/risk')
      .then(res => res.json())
      .then(data => {
        console.log("🚀 [INDRA Backend] Leaderboard Loaded:");
        console.dir(data.leaderboard);
        setLeaderboard(data.leaderboard)
        if (data.leaderboard.length > 0) {
          handleSimulateLog(data.leaderboard[0].user_id)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching leaderboard:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // Dynamic width for ForceGraph
    if (containerRef.current) {
      setGraphWidth(containerRef.current.offsetWidth)
    }
    const handleResize = () => {
      if (containerRef.current) setGraphWidth(containerRef.current.offsetWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [predictResult])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="border-b border-slate-700 pb-4">
          <h1 className="text-3xl font-bold text-emerald-400 tracking-tight">INDRA Command Center</h1>
          <p className="text-slate-400 mt-2">Intelligent Network for Detection Risk assessment and Analytics</p>
        </header>

        {/* Global Model Performance Diagnostics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md flex flex-col items-center justify-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Ensemble Accuracy</span>
            <span className="text-2xl font-bold text-emerald-400">
              {metrics ? (metrics.accuracy * 100).toFixed(1) : "0.0"}%
            </span>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md flex flex-col items-center justify-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Precision (False Pos ↓)</span>
            <span className="text-2xl font-bold text-indigo-400">
              {metrics ? (metrics.precision * 100).toFixed(1) : "0.0"}%
            </span>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md flex flex-col items-center justify-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Recall (True Threat ↑)</span>
            <span className="text-2xl font-bold text-blue-400">
              {metrics ? (metrics.recall * 100).toFixed(1) : "0.0"}%
            </span>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md flex flex-col items-center justify-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">F1-Score</span>
            <span className="text-2xl font-bold text-purple-400">
              {metrics ? (metrics.f1 * 100).toFixed(1) : "0.0"}%
            </span>
          </div>
        </section>

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
                    <tr 
                      key={idx} 
                      onClick={() => handleSimulateLog(user.user_id)}
                      className={`border-b border-slate-700/50 hover:bg-slate-700/80 transition-colors cursor-pointer ${selectedUser === user.user_id ? 'bg-indigo-900/40 border-l-4 border-l-indigo-500' : ''}`}
                    >
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
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Real-Time Threat Dashboard <span className="text-indigo-400">({selectedUser})</span></h2>

          {predictResult && (
            predictResult.status === "error" ? (
              <div className="mt-6 bg-slate-900 rounded-lg p-5 border border-red-500/30">
                <h3 className="text-lg font-bold text-red-400 mb-2">🚨 Backend Error</h3>
                <p className="text-slate-300 font-mono text-sm mb-4">{predictResult.message}</p>
                <p className="text-slate-400 text-xs">Note: The AI models haven't been trained yet! You must train the offline models first for the Flask endpoints to load them.</p>
              </div>
            ) : (
                <div className="mt-6 bg-slate-900 rounded-lg p-5 border border-red-500/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  
                  {/* Header & Alert */}
                  <h3 className="text-lg font-bold text-red-400 mb-2">🚨 Threat Detected: Action Required</h3>
                  <p className="text-slate-300 font-mono text-sm bg-black/20 p-2 rounded">{predictResult.xai_explanation}</p>
                  
                  {/* ML Confidence Grid */}
                  <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-slate-400">
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

                  {/* Advanced Visualizations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    
                    {/* Timeline Chart */}
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">10-Day User Risk Timeline</h4>
                      <div className="w-full" style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                          <LineChart data={predictResult.timeline}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickFormatter={(tick) => tick.substring(5)} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                              itemStyle={{ color: '#f87171' }}
                            />
                            <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Network Graph */}
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700" ref={containerRef}>
                      <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Lateral Movement Map</h4>
                      <div className="h-48 w-full bg-slate-900 rounded border border-slate-700 overflow-hidden relative flex items-center justify-center">
                        {predictResult.graph_data && (
                          <ForceGraph2D
                            width={graphWidth > 50 ? graphWidth - 32 : 300} 
                            height={192} 
                            graphData={predictResult.graph_data}
                            nodeLabel="name"
                            nodeCanvasObject={(node, ctx, globalScale) => {
                              const label = node.name;
                              const fontSize = 12 / globalScale;
                              ctx.font = `${fontSize}px Sans-Serif`;
                              
                              // Draw node circle
                              ctx.beginPath();
                              ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
                              ctx.fillStyle = node.group === 1 ? '#3b82f6' : 
                                              node.group === 2 ? '#10b981' : 
                                              node.group === 3 ? '#ef4444' : '#f59e0b';
                              ctx.fill();
                              
                              // Draw text label permanently under the node
                              ctx.textAlign = 'center';
                              ctx.textBaseline = 'top';
                              ctx.fillStyle = '#cbd5e1'; // tailwind slate-300
                              ctx.fillText(label, node.x, node.y + 7);
                            }}
                            linkColor={() => '#475569'}
                            linkWidth={2}
                            linkDirectionalParticles={2}
                            linkDirectionalParticleSpeed={0.01}
                            backgroundColor="#0f172a"
                          />
                        )}
                      </div>
                    </div>

                  </div>

                </div>
            )
          )}
        </section>

      </div>
    </div>
  )
}

export default App
