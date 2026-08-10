import React from 'react';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
  const { activeTab, setActiveTab, logout } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'courses', label: 'Course Catalog', icon: 'school' },
    { id: 'practice', label: 'Practice Sandbox', icon: 'code' },
    { id: 'resume-ai', label: 'Resume AI', icon: 'psychology' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#0B0F17] flex flex-col py-6 z-40 hidden md:flex border-r border-white/10 shadow-2xl">
      {/* Brand Header */}
      <div 
        onClick={() => setActiveTab('landing')}
        className="px-6 mb-8 flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-[#810B38] flex items-center justify-center text-white shadow-[0_0_15px_rgba(203,41,87,0.5)] group-hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-[22px]">terminal</span>
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white tracking-tight group-hover:text-primary-bright transition-colors">
            SkillForge
          </h1>
          <p className="font-sans text-[11px] text-white/60 font-medium tracking-wider uppercase">
            Placement Engine
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all relative ${
                isActive
                  ? 'bg-white/10 text-white font-semibold shadow-inner'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#810B38] rounded-r-full shadow-[0_0_10px_#CB2957]" />
              )}
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-cyan-400' : ''}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pro Plan Card & Bottom Actions */}
      <div className="px-4 mt-auto space-y-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#810B38]/40 to-slate-900 border border-[#810B38]/30">
          <div className="flex items-center gap-2 mb-1.5 text-amber-300">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="font-display text-xs font-bold uppercase tracking-wider">Placement Ready Pro</span>
          </div>
          <p className="text-[12px] text-white/70 leading-relaxed mb-3">
            Unlimited Groq AI ATS Audits & Live Sandbox test runs.
          </p>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[85%]" />
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 space-y-1">
          <button
            onClick={() => setActiveTab('landing')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white text-xs font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            Help & Documentation
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
