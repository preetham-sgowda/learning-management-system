import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const StudentDashboard = () => {
  const { user, courses, setActiveTab, setSelectedCourse, showToast } = useApp();
  const [hoveredHeatmap, setHoveredHeatmap] = useState(null);

  // Generate 30 days heatmap activity data
  const generateHeatmapData = () => {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      let level = Math.floor(Math.random() * 5);
      if (i > 18) level = Math.max(1, Math.min(4, Math.floor(Math.random() * 4) + 1));
      days.push({
        day: i,
        date: `Aug ${i}, 2026`,
        commits: level * 3,
        level: level
      });
    }
    return days;
  };

  const [heatmapDays, setHeatmapDays] = useState(generateHeatmapData);

  const handleCellClick = (dayObj) => {
    showToast(`Logged +2 problem submissions for ${dayObj.date}! 🔥`, 'success');
    setHeatmapDays(prev => prev.map(d => d.day === dayObj.day ? { ...d, commits: d.commits + 2, level: Math.min(4, d.level + 1) } : d));
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your CS learning paths, algorithm streak, and placement metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('practice')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#810B38] hover:bg-[#9c244b] text-white text-xs font-bold shadow-lg shadow-rose-950/20 transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>Solve Daily Problem</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Streak Tracker & Interactive Heatmap (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display font-bold text-lg text-slate-900">Current Streak</h3>
              <span className="material-symbols-outlined text-rose-600 text-[26px] animate-pulse">
                local_fire_department
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-5xl font-black text-[#810B38] font-display">{user.streak}</span>
              <div className="text-left">
                <span className="text-sm font-bold text-slate-800 block">Consecutive Days</span>
                <span className="text-xs text-emerald-600 font-medium">Top 5% Student Activity</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  30-Day Submission Heatmap
                </span>
                <span className="text-[10px] text-slate-400">Click cell to add log</span>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 relative">
                {heatmapDays.map((d) => (
                  <div
                    key={d.day}
                    onClick={() => handleCellClick(d)}
                    onMouseEnter={() => setHoveredHeatmap(d)}
                    onMouseLeave={() => setHoveredHeatmap(null)}
                    className={`heatmap-cell heatmap-${d.level} cursor-pointer hover:ring-2 hover:ring-[#810B38]`}
                    title={`${d.date}: ${d.commits} problems solved`}
                  />
                ))}
              </div>

              {/* Tooltip detail display */}
              {hoveredHeatmap ? (
                <p className="text-[11px] font-mono text-[#810B38] mt-2 font-semibold text-center">
                  {hoveredHeatmap.date}: {hoveredHeatmap.commits} submissions
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  Hover over cells for activity details
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Streak Freeze Active 🛡️</span>
            <span className="font-bold text-[#810B38]">1 Protection Left</span>
          </div>
        </div>

        {/* Card 2: Registered Courses (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Enrolled Learning Modules</h3>
              <p className="text-xs text-slate-500">Pick up right where you left off</p>
            </div>
            <button
              onClick={() => setActiveTab('courses')}
              className="text-xs font-bold text-[#810B38] hover:underline flex items-center gap-1"
            >
              <span>Explore All Courses</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-5 divide-y divide-slate-100">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="pt-4 first:pt-0">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 hover:text-[#810B38] cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedCourse(course);
                          setActiveTab('courses');
                        }}>
                      {course.title}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {course.completedModules} of {course.modulesCount} Modules Completed • {course.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#810B38] font-mono">{course.progress}%</span>
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveTab('courses');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#810B38] hover:text-white text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Resume
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Accuracy Analytics (Col 12) */}
        <div className="lg:col-span-12 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-lg text-slate-900">Placement Assessment Analytics</h3>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              Last 30 Days Performance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Metric 1 */}
            <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center hover:bg-slate-100/60 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-3">
                <span className="text-2xl font-black font-display">{user.mcqAccuracy}%</span>
              </div>
              <span className="font-bold text-sm text-slate-900">MCQ Concept Accuracy</span>
              <p className="text-xs text-slate-500 mt-1">CS Core & OS Theory</p>
            </div>

            {/* Metric 2 */}
            <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center hover:bg-slate-100/60 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-[#810B38] flex items-center justify-center mb-3">
                <span className="text-2xl font-black font-display">{user.codingAccuracy}%</span>
              </div>
              <span className="font-bold text-sm text-slate-900">Algorithmic Sandbox Success</span>
              <p className="text-xs text-slate-500 mt-1">Passed All Test Cases</p>
            </div>

            {/* Metric 3 */}
            <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center hover:bg-slate-100/60 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                <span className="text-2xl font-black font-display">{user.descriptiveScore}%</span>
              </div>
              <span className="font-bold text-sm text-slate-900">System Design Evaluation</span>
              <p className="text-xs text-slate-500 mt-1">Architecture & Tradeoffs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
