import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { user, activeTab, setActiveTab, notifications, unreadCount, markAllNotificationsRead, logout } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Student Workspace';
      case 'courses': return 'Course Catalog & Modules';
      case 'practice': return 'Coding Sandbox & Test Runner';
      case 'resume-ai': return 'Groq AI Resume Optimizer';
      case 'leaderboard': return 'Global Skill Leaderboard';
      default: return 'SkillForge Platform';
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('courses');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm h-16 flex items-center justify-between px-4 md:px-8 w-full transition-all">
      {/* Left Title / Mobile Toggle */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle Navigation"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div>
          <h2 className="font-display text-lg font-bold text-slate-900 hidden sm:block">
            {getTitle()}
          </h2>
        </div>

        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs ml-4 hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, concepts, questions..."
            className="w-full bg-slate-100 border border-slate-200 rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#810B38] focus:border-transparent transition-all"
          />
        </form>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-3 relative">
        {/* Quick Launch Buttons */}
        <button
          onClick={() => setActiveTab('practice')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[16px] text-cyan-400">code</span>
          <span>Open Sandbox</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-slate-600 hover:text-[#810B38] hover:bg-slate-100 transition-colors relative"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#810B38] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-fade-in-up">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#810B38] text-[10px] font-bold">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-[#810B38] hover:underline font-medium"
                >
                  Mark all as read
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto my-2">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`py-3 px-2 rounded-lg transition-colors ${
                      item.read ? 'opacity-70' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#810B38] text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
              {user.avatar}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#810B38] transition-colors">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">12-Day Streak 🔥</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[18px] group-hover:text-slate-600">
              expand_more
            </span>
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="font-bold text-xs text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                Dashboard Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab('resume-ai');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">description</span>
                My ATS Resume Score
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-slate-900/95 backdrop-blur-xl z-50 p-6 flex flex-col md:hidden">
          <div className="space-y-3">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              { id: 'courses', label: 'Course Catalog', icon: 'school' },
              { id: 'practice', label: 'Practice Sandbox', icon: 'code' },
              { id: 'resume-ai', label: 'Resume AI', icon: 'psychology' },
              { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold ${
                  activeTab === item.id ? 'bg-[#810B38] text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-white/10">
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 text-white font-bold"
            >
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
