"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ['dashboardStatus'],
    queryFn: api.getDashboardStatus
  });

  const { data: championProbs, isLoading: probsLoading } = useQuery({
    queryKey: ['championProbs'],
    queryFn: api.getChampionProbabilities
  });

  const { data: nextMatch, isLoading: matchLoading } = useQuery({
    queryKey: ['nextMatch'],
    queryFn: api.getNextMatch
  });

  if (statusLoading || probsLoading || matchLoading) {
    return <div className="text-white flex h-full items-center justify-center animate-pulse">Loading Live Prediction Engine...</div>;
  }

  // Generate some fake timeline data based on current probs for the chart
  const timelineData = championProbs?.slice(0, 3).map((team: any) => ({
    name: team.team,
    history: Array.from({length: 7}).map((_, i) => ({
      day: `Match ${i+1}`,
      prob: Math.max(0, team.probability + (Math.random() * 5 - 2.5))
    }))
  }));

  // Flatten for Recharts
  const chartData = timelineData?.[0]?.history.map((h: any, i: number) => {
    const pt: any = { name: h.day };
    timelineData.forEach((td: any) => {
      pt[td.name] = td.history[i].prob.toFixed(1);
    });
    return pt;
  }) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Live AI updates from the {status?.tournament_stage}.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Last Model Run</p>
          <p className="text-sm text-green-400">{new Date(status?.last_updated).toLocaleTimeString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <p className="text-sm font-medium text-gray-400">Monte Carlo Simulations</p>
          <p className="text-3xl font-bold text-white mt-2">{status?.simulations.toLocaleString()}</p>
          <p className="text-sm text-green-400 mt-2">v{status?.model_version}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
          <p className="text-sm font-medium text-purple-300 relative">Current Favorite</p>
          <p className="text-3xl font-bold text-white mt-2 relative">{championProbs?.[0]?.team}</p>
          <p className="text-sm text-purple-400 mt-2 relative">{championProbs?.[0]?.probability}% Win Prob</p>
        </div>
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <p className="text-sm font-medium text-gray-400">Dark Horse / Upset</p>
          <p className="text-3xl font-bold text-white mt-2">{championProbs?.[5]?.team}</p>
          <p className="text-sm text-yellow-400 mt-2">Value Pick ({championProbs?.[5]?.probability}%)</p>
        </div>
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <p className="text-sm font-medium text-gray-400">Tournament Progress</p>
          <p className="text-3xl font-bold text-white mt-2">{status?.completed_matches} / 64</p>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${status?.progress}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Champion Probability Trends</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff50" tick={{fill: '#ffffff50'}} />
                <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151821', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                {timelineData?.slice(0,3).map((t: any, i: number) => (
                  <Line 
                    key={t.name}
                    type="monotone" 
                    dataKey={t.name} 
                    stroke={i === 0 ? "#8b5cf6" : i === 1 ? "#3b82f6" : "#10b981"} 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-6 text-white">Next Official Match</h2>
          <div className="flex-1 flex flex-col justify-center space-y-8">
            <div className="flex justify-between items-center px-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-2 border-2 border-white/10 flex items-center justify-center font-bold">{nextMatch?.home?.substring(0,3).toUpperCase()}</div>
                <p className="font-semibold text-gray-200">{nextMatch?.home}</p>
                <p className="text-sm text-blue-400 font-bold">{nextMatch?.home_win_prob}%</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{nextMatch?.expected_score}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Expected</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-2 border-2 border-white/10 flex items-center justify-center font-bold">{nextMatch?.away?.substring(0,3).toUpperCase()}</div>
                <p className="font-semibold text-gray-200">{nextMatch?.away}</p>
                <p className="text-sm text-red-400 font-bold">{nextMatch?.away_win_prob}%</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 mt-auto">
              <p className="text-sm text-gray-400 mb-2">Match Prediction Confidence</p>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${nextMatch?.confidence}%` }}></div>
                </div>
                <span className="text-sm font-bold text-white">{nextMatch?.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
