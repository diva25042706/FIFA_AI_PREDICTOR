"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

export default function GroupStagePage() {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: api.getGroupStandings
  });

  if (isLoading) {
    return <div className="text-white flex h-full items-center justify-center animate-pulse">Loading Live Standings...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Group Stage Predictions</h1>
        <p className="text-gray-400 mt-2">AI-projected final standings based on expected points and goal differential.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {groups && Object.keys(groups).map((groupName) => (
          <div key={groupName} className="glass-card rounded-2xl overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Group {groupName}</h2>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-semibold tracking-wider uppercase">Projected</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-500 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Team</th>
                    <th className="px-4 py-3 font-semibold text-center">Pts</th>
                    <th className="px-4 py-3 font-semibold text-center">GD</th>
                    <th className="px-4 py-3 font-semibold text-center">xG</th>
                    <th className="px-4 py-3 font-semibold text-center">xPts</th>
                    <th className="px-6 py-3 font-semibold text-right">Advancement %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {groups[groupName].map((team: any, idx: number) => (
                    <tr key={team.team} className={`hover:bg-white/5 transition-colors ${idx < 2 ? 'bg-green-500/5' : ''}`}>
                      <td className="px-6 py-3 font-medium text-white flex items-center space-x-3">
                        <span className="text-gray-500 w-4">{idx + 1}</span>
                        <div className="w-5 h-5 bg-gray-700 rounded-sm"></div>
                        <span>{team.team}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-white">{team.pts}</td>
                      <td className="px-4 py-3 text-center">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                      <td className="px-4 py-3 text-center">{team.xg}</td>
                      <td className="px-4 py-3 text-center">{team.xpts}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`px-2 py-1 rounded font-bold ${team.qual_prob > 50 ? 'text-green-400' : 'text-red-400'}`}>
                          {team.qual_prob}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
