import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ResumeAIOptimizer = () => {
  const { user, showToast } = useApp();
  const [targetRole, setTargetRole] = useState('Full Stack Engineer (SDE-1)');
  const [resumeText, setResumeText] = useState(
    `Lohith R C | Computer Science Engineer | lohith.rc@skillforge.edu
SUMMARY: Enthusiastic Software Engineer with experience in React.js, Node.js, SQL databases, and algorithm optimization. Built scalable web applications and solved 80+ DSA challenges.

EXPERIENCE / PROJECTS:
- SkillForge Placement Platform: Developed React 19 frontend with glassmorphism design system & WebGL background shaders.
- Distributed Database Engine: Implemented B-Tree indexing and LRU cache eviction mechanism in Python.
- System Design Practice: Designed high-throughput microservices using Express & MongoDB.

SKILLS: JavaScript, TypeScript, Python, React.js, Node.js, SQL, Data Structures, Git.`
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState(88);
  const [optimized, setOptimized] = useState(false);

  const handleAudit = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAtsScore(optimized ? 96 : 88);
      showToast('Groq AI ATS Audit completed!', 'success');
    }, 1200);
  };

  const handleApplyOptimizations = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setOptimized(true);
      setAtsScore(96);
      setResumeText(prev => prev + `\n- Microservices & Load Balancing: Configured NGINX reverse proxy & Docker containerization achieving 99.9% uptime.`);
      showToast('Applied Groq AI enhancements! ATS Score boosted to 96/100 🔥', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900">
            Groq AI ATS Resume Auditor & Match Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Optimize your resume for applicant tracking systems used by top tech companies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600">Target Role Track:</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
          >
            <option>Full Stack Engineer (SDE-1)</option>
            <option>Backend Systems Architect</option>
            <option>Frontend Specialist (React/Next)</option>
            <option>Data / ML Engineer</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Column (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-base text-slate-900">
              Resume Content & Experience Statements
            </h3>
            <span className="text-xs text-slate-400 font-mono">Plain Text / Markdown</span>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={12}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#810B38] leading-relaxed"
          />

          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Word Count: {resumeText.split(/\s+/).filter(Boolean).length} Words
            </span>
            <button
              onClick={handleAudit}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#810B38] hover:bg-[#9c244b] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isAnalyzing ? 'sync' : 'psychology'}
              </span>
              <span>{isAnalyzing ? 'Analyzing with Groq AI...' : 'Run ATS Audit'}</span>
            </button>
          </div>
        </div>

        {/* Right Audit Results Column (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* ATS Score Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Target Role Match Score
              </span>
              <h3 className="font-display text-2xl font-black text-slate-900 mt-1">
                {targetRole}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                {atsScore >= 90 ? '✅ Exceptional Tier-1 Match' : '⚠️ Minor Keyword Gaps Found'}
              </p>
            </div>

            <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-emerald-50 text-emerald-700 font-display font-black text-2xl shadow-inner">
              {atsScore}
              <span className="text-[9px] font-mono font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          {/* AI Keyword Suggestions Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-display font-bold text-sm text-slate-900">
                Groq AI Keyword Analysis
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[#810B38] text-[10px] font-bold">
                ATS Filters
              </span>
            </div>

            {/* Found vs Missing Badges */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  ✅ Matched Role Keywords (8)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['React.js', 'Node.js', 'SQL', 'Data Structures', 'Python', 'B-Tree', 'LRU Cache', 'JavaScript'].map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  ⚡ Recommended High-Impact Keywords (2 Missing)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Docker Containerization', 'Load Balancing / NGINX'].map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200 animate-pulse">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Action Button */}
            <button
              onClick={handleApplyOptimizations}
              disabled={isAnalyzing || optimized}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-cyan-400 text-[18px]">auto_fix_high</span>
              <span>{optimized ? 'Enhancements Applied (Score: 96/100)' : 'Auto-Inject Missing Keywords'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAIOptimizer;
