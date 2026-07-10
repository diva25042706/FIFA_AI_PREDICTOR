export default function DataCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Data Center</h1>
        <p className="text-gray-400 mt-2">API connections, data pipeline status, and recent syncs.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { source: "API-Football", status: "Connected", sync: "2 mins ago", type: "Live Stats" },
          { source: "Sportmonks", status: "Fallback Ready", sync: "1 hr ago", type: "Advanced Data" },
          { source: "Kaggle / GitHub", status: "Stored", sync: "2 days ago", type: "Historical" }
        ].map((api, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-white">{api.source}</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${api.status.includes('Connected') ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {api.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Sync: {api.sync}</p>
              <p className="text-sm text-gray-500 mt-1">{api.type}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-card rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Pipeline Execution Logs</h2>
        <div className="bg-black/40 rounded-xl p-4 font-mono text-sm text-gray-300 h-64 overflow-y-auto space-y-2">
          <p>[2026-07-09 14:00:00] CRON Triggered: hourly_data_fetch</p>
          <p>[2026-07-09 14:00:02] API-Football: Fetched 4 matches</p>
          <p>[2026-07-09 14:00:05] Postgres: Upserted 112 player stats</p>
          <p>[2026-07-09 14:00:10] Feature Engineering: Updated rolling averages</p>
          <p>[2026-07-09 14:00:15] Model Inference: XGBoost generated new predictions</p>
          <p className="text-green-400">[2026-07-09 14:00:16] Pipeline completed successfully.</p>
        </div>
      </div>
    </div>
  );
}
