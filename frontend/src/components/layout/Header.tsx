"use client";
import { Bell, Search, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search teams, players, or matches..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4 ml-4">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-gray-900" />
          <Bell className="w-5 h-5 text-gray-300" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Settings className="w-5 h-5 text-gray-300" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/20 ml-2">
          AI
        </div>
      </div>
    </header>
  );
}
