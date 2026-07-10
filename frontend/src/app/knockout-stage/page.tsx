"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Activity, Crosshair, BarChart3 } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export default function KnockoutStagePage() {
  const { data: bracket, isLoading } = useQuery({
    queryKey: ['knockout'],
    queryFn: api.getKnockoutBracket
  });

  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const { data: matchDetails } = useQuery({
    queryKey: ['match', selectedMatch],
    queryFn: () => api.getMatch(selectedMatch!),
    enabled: !!selectedMatch
  });

  if (isLoading) return <div className="text-white flex h-full items-center justify-center animate-pulse">Loading Bracket...</div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative overflow-hidden">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white">Knockout Stage</h1>
        <p className="text-gray-400 mt-2">Interactive predictions powered by 100,000 Monte Carlo simulations.</p>
      </div>
      
      {/* Scrollable Bracket Area */}
      <div className="flex-1 overflow-auto border border-white/5 bg-black/20 rounded-2xl p-8 relative">
        <div className="min-w-[1200px] flex justify-between space-x-12 relative">
          
          {/* Round of 32 Column */}
          <div className="w-64 space-y-4">
             <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Round of 32</h3>
             {bracket?.round_of_32?.map((match: any) => (
                <MatchCard key={match.id} match={match} onClick={() => setSelectedMatch(match.id)} />
             ))}
          </div>

          {/* Round of 16 Column */}
          <div className="w-64 flex flex-col justify-around">
             <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Round of 16</h3>
             {bracket?.round_of_16?.map((match: any) => (
                <MatchCard key={match.id} match={match} onClick={() => setSelectedMatch(match.id)} />
             ))}
          </div>

          {/* Quarterfinals Column */}
          <div className="w-64 flex flex-col justify-around">
             <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Quarterfinals</h3>
             {bracket?.quarterfinals?.map((match: any) => (
                <MatchCard key={match.id} match={match} onClick={() => setSelectedMatch(match.id)} />
             ))}
          </div>

        </div>
      </div>

      {/* Side Sheet for Match Analytics */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-96 glass-card border-l border-white/10 shadow-2xl flex flex-col z-50"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h2 className="text-lg font-bold text-white">AI Match Analysis</h2>
              <button onClick={() => setSelectedMatch(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Radar Chart */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase flex items-center mb-4"><Activity className="w-4 h-4 mr-2" /> Team Strengths</h3>
                <div className="h-64 bg-black/20 rounded-xl p-2 border border-white/5">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={matchDetails?.radar || []}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#888', fontSize: 10 }} />
                      <Radar name="Home" dataKey="home" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Radar name="Away" dataKey="away" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                      <Tooltip contentStyle={{ backgroundColor: '#151821', borderColor: '#333' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SHAP Chart */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase flex items-center mb-4"><BarChart3 className="w-4 h-4 mr-2" /> SHAP Feature Impact</h3>
                <div className="h-64 bg-black/20 rounded-xl p-2 border border-white/5">
                   <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart layout="vertical" data={matchDetails?.shap || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="feature" type="category" width={80} tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#151821', borderColor: '#333' }} cursor={{fill: '#ffffff05'}} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {
                          (matchDetails?.shap || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10b981' : '#ef4444'} />
                          ))
                        }
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Green: Favors Home | Red: Favors Away</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MatchCard({ match, onClick }: { match: any, onClick: () => void }) {
  const isCompleted = match.status === "completed";
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden cursor-pointer border ${isCompleted ? 'border-white/5 bg-white/5 opacity-70 hover:opacity-100' : 'border-blue-500/30 bg-blue-900/20 shadow-lg shadow-blue-500/10'}`}
    >
      {/* Top Banner indicating status */}
      <div className={`h-1 w-full ${isCompleted ? 'bg-gray-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`} />
      
      <div className="p-3">
        {/* Home Team */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-4 bg-gray-700 rounded-sm"></div>
            <span className={`text-sm font-semibold ${isCompleted && match.home_score < match.away_score ? 'text-gray-500' : 'text-white'}`}>{match.home}</span>
          </div>
          {isCompleted ? (
            <span className="font-bold text-white">{match.home_score}</span>
          ) : (
            match.home_win_prob && <span className="text-xs font-bold text-blue-400">{match.home_win_prob}%</span>
          )}
        </div>
        
        {/* Away Team */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-4 bg-gray-700 rounded-sm"></div>
            <span className={`text-sm font-semibold ${isCompleted && match.away_score < match.home_score ? 'text-gray-500' : 'text-white'}`}>{match.away}</span>
          </div>
          {isCompleted ? (
            <span className="font-bold text-white">{match.away_score}</span>
          ) : (
            match.away_win_prob && <span className="text-xs font-bold text-red-400">{match.away_win_prob}%</span>
          )}
        </div>
        
        {/* Expected Score / Meta */}
        {!isCompleted && match.expected_score && (
          <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-500">Exp. Score</span>
            <span className="text-xs font-mono font-bold text-purple-400">{match.expected_score}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
