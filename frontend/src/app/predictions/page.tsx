"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

export default function PredictionsPage() {
  const { data: bracket, isLoading } = useQuery({
    queryKey: ['knockout'],
    queryFn: api.getKnockoutBracket
  });

  if (isLoading) return <div className="text-white flex h-full items-center justify-center animate-pulse">Loading AI Predictions...</div>;

  // Extract all upcoming matches from the bracket
  const upcomingMatches = [
    ...(bracket?.quarterfinals || []),
    ...(bracket?.semifinals || []),
    ...(bracket?.final || [])
  ].filter((m: any) => m.status === "upcoming" && m.home !== "TBD");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">AI Predictions Dashboard</h1>
          <p className="text-gray-400 mt-2">Deep dive into the Monte Carlo match-by-match expected outcomes.</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">Upcoming</button>
        </div>
      </div>
      
      <div className="space-y-6 max-w-4xl mx-auto">
        {upcomingMatches.map((match: any, idx: number) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={match.id} 
            className="glass-card rounded-2xl p-6 relative overflow-hidden group"
          >
            {/* Background gradient hint based on favorite */}
            <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${match.home_win_prob > match.away_win_prob ? 'from-blue-500 to-transparent' : 'from-transparent to-red-500'}`} />
            
            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Match {match.id.toUpperCase()}</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300 font-mono">Simulations: 100k+</span>
              </div>
              
              <div className="flex items-center justify-between">
                {/* Home Team */}
                <div className="flex items-center space-x-4 w-1/3">
                  <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-white/10 flex items-center justify-center font-bold text-gray-500">{match.home.substring(0,3).toUpperCase()}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{match.home}</h3>
                    <p className="text-sm font-bold text-blue-400">Win: {match.home_win_prob}%</p>
                  </div>
                </div>
                
                {/* Score Prediction */}
                <div className="text-center px-8">
                  <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-400">{match.expected_score}</div>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Expected</p>
                </div>
                
                {/* Away Team */}
                <div className="flex items-center space-x-4 w-1/3 justify-end text-right">
                  <div>
                    <h3 className="text-xl font-bold text-white">{match.away}</h3>
                    <p className="text-sm font-bold text-red-400">Win: {match.away_win_prob}%</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-white/10 flex items-center justify-center font-bold text-gray-500">{match.away.substring(0,3).toUpperCase()}</div>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="mt-6 h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
                 <div className="bg-blue-500 h-full" style={{ width: `${match.home_win_prob}%` }}></div>
                 <div className="bg-red-500 h-full" style={{ width: `${match.away_win_prob}%` }}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
