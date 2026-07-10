"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export default function ExplainableAIPage() {
  const { data: xai, isLoading } = useQuery({
    queryKey: ['xai'],
    queryFn: api.getAnalyticsXAI
  });

  if (isLoading) return <div className="text-white flex h-full items-center justify-center animate-pulse">Loading Explainable AI Models...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Explainable AI (XAI)</h1>
        <p className="text-gray-400 mt-2">Opening the black box: Understand exactly which features drive the model's predictions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Global Feature Importance */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">Global Feature Importance (SHAP)</h2>
          <p className="text-sm text-gray-400 mb-6">The average impact of each feature across all 100,000+ simulated matches.</p>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={xai?.global_importance} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff50" tick={{fill: '#ffffff50'}} />
                <YAxis dataKey="feature" type="category" stroke="#ffffff50" tick={{fill: '#ffffff50'}} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#151821', borderColor: '#333' }} />
                <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {xai?.global_importance.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={`hsl(260, 80%, ${70 - index * 10}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Local Waterfall (Example Match) */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">Local Explanation (Waterfall)</h2>
          <p className="text-sm text-gray-400 mb-6">How the model arrived at the 64.5% win probability for the next match.</p>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={xai?.local_waterfall} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#ffffff50" tick={{fill: '#ffffff50'}} />
                <YAxis dataKey="name" type="category" stroke="#ffffff50" tick={{fill: '#ffffff50'}} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#151821', borderColor: '#333' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {xai?.local_waterfall.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 || index === xai.local_waterfall.length - 1 ? '#3b82f6' : entry.value > 0 ? '#10b981' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <span className="flex items-center text-gray-400"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div> Base/Final</span>
            <span className="flex items-center text-gray-400"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div> Positive Impact</span>
            <span className="flex items-center text-gray-400"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> Negative Impact</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
