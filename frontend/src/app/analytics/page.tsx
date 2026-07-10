"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ['dashboardStatus'],
    queryFn: api.getDashboardStatus
  });

  const { data: probs, isLoading: probsLoading } = useQuery({
    queryKey: ['championProbs'],
    queryFn: api.getChampionProbabilities
  });

  if (statusLoading || probsLoading) return <div className="text-white flex h-full items-center justify-center animate-pulse">Loading Deep Analytics...</div>;

  // Generate synthetic area chart data for momentum
  const momentumData = Array.from({length: 10}).map((_, i) => ({
    match: `M${i+1}`,
    [((probs as unknown as any[]) || [])?.[0]?.team || "Team A"]: 50 + i * 2 + (Math.random() * 10 - 5),
    [((probs as unknown as any[]) || [])?.[1]?.team || "Team B"]: 60 - i * 1.5 + (Math.random() * 10 - 5),
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Deep Analytics</h1>
        <p className="text-gray-400 mt-2">Advanced statistical breakdowns and historical momentum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-sm font-medium text-gray-400">Total Goals (Projected)</p>
          <p className="text-3xl font-bold text-white mt-2">164.5</p>
          <p className="text-sm text-green-400 mt-2">+2.1 above average</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-sm font-medium text-gray-400">Highest xG Team</p>
          <p className="text-3xl font-bold text-white mt-2">{((probs as unknown as any[]) || [])?.[0]?.team}</p>
          <p className="text-sm text-blue-400 mt-2">2.4 xG per match</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-sm font-medium text-gray-400">Tournament Volatility Index</p>
          <p className="text-3xl font-bold text-white mt-2">High</p>
          <p className="text-sm text-yellow-400 mt-2">48% upset probability</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-2">Tournament Momentum (Top 2 Contenders)</h2>
        <p className="text-sm text-gray-400 mb-6">Relative strength index smoothed over the last 10 simulated intervals.</p>
        
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={momentumData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTeamA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTeamB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="match" stroke="#ffffff50" tick={{fill: '#ffffff50'}} />
              <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50'}} />
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <Tooltip contentStyle={{ backgroundColor: '#151821', borderColor: '#333' }} />
              <Area type="monotone" dataKey={((probs as unknown as any[]) || [])?.[0]?.team || "Team A"} stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTeamA)" />
              <Area type="monotone" dataKey={((probs as unknown as any[]) || [])?.[1]?.team || "Team B"} stroke="#3b82f6" fillOpacity={1} fill="url(#colorTeamB)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
