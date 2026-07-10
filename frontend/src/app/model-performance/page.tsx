export default function ModelPerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Model Performance</h1>
        <p className="text-gray-400 mt-2">Real-time leaderboard of all active machine learning models.</p>
      </div>
      
      <div className="overflow-x-auto glass-card rounded-2xl border border-white/5">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-300 uppercase font-semibold text-xs border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Model Name</th>
              <th className="px-6 py-4">Accuracy</th>
              <th className="px-6 py-4">Log Loss</th>
              <th className="px-6 py-4">F1 Score</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              { name: "XGBoost Classifier", acc: "78.4%", loss: "0.41", f1: "0.76", active: true },
              { name: "LightGBM", acc: "77.9%", loss: "0.42", f1: "0.75", active: false },
              { name: "Random Forest", acc: "75.2%", loss: "0.48", f1: "0.71", active: false },
              { name: "Transformer (Attention)", acc: "76.8%", loss: "0.44", f1: "0.74", active: false },
            ].map((model, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center space-x-2">
                  {model.active && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                  <span>{model.name}</span>
                </td>
                <td className="px-6 py-4 text-blue-400">{model.acc}</td>
                <td className="px-6 py-4">{model.loss}</td>
                <td className="px-6 py-4">{model.f1}</td>
                <td className="px-6 py-4">
                  {model.active ? (
                     <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs">Primary</span>
                  ) : (
                     <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-md text-xs">Shadow</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
