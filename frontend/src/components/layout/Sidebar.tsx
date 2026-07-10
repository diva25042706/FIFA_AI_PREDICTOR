"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  BrainCircuit, 
  BarChart3, 
  Search, 
  Activity, 
  Database,
  Menu
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Group Stage", href: "/group-stage", icon: Users },
  { name: "Knockout Stage", href: "/knockout-stage", icon: Trophy },
  { name: "AI Predictions", href: "/predictions", icon: BrainCircuit },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Explainable AI", href: "/explainable-ai", icon: Search },
  { name: "Model Performance", href: "/model-performance", icon: Activity },
  { name: "Data Center", href: "/data-center", icon: Database },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside 
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      className="hidden md:flex flex-col h-screen glass-panel border-r border-white/5 sticky top-0"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-white/5">
        {!collapsed && (
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 whitespace-nowrap">
            FIFA AI Predictor
          </span>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-auto"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                isActive 
                  ? "bg-blue-600/20 text-blue-400 font-medium" 
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" 
                />
              )}
              <item.icon className={cn("w-5 h-5 min-w-[20px]", isActive && "text-blue-400")} />
              {!collapsed && (
                <span className="whitespace-nowrap transition-opacity duration-200">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {!collapsed && (
        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">System Status</p>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-300">Live Models Online</span>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
