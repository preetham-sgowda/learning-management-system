import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackgroundShader from './BackgroundShader';

const LandingPage = () => {
  const { setActiveTab } = useApp();
  const [activeCodeTab, setActiveCodeTab] = useState('solution.py');
  const [runningTest, setRunningTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(true);

  const triggerTestRun = () => {
    setRunningTest(true);
    setTimeout(() => {
      setRunningTest(false);
      setTestSuccess(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F17] text-white overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* WebGL Animated Liquid Mesh Shader Background */}
      <BackgroundShader />

      {/* Floating Header Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 px-6 max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="glass-panel flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 hover:border-rose-500/50 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#810B38] flex items-center justify-center text-white shadow-[0_0_15px_rgba(203,41,87,0.6)]">
            <span className="material-symbols-outlined text-[18px]">terminal</span>
          </div>
          <span className="font-display text-lg font-bold tracking-wider text-white">SkillForge</span>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('signin')}
            className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-1.5"
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className="text-sm font-semibold text-white px-6 py-2.5 rounded-full bg-[#810B38] hover:bg-[#9c244b] transition-all shadow-[0_4px_20px_rgba(203,41,87,0.4)] hover:shadow-[0_4px_25px_rgba(203,41,87,0.6)] hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative w-full max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left Information Box */}
        <section className="w-full lg:w-[48%] flex flex-col justify-center relative z-20">
          <div className="animate-fade-in-up">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-rose-500/30 mb-6">
              <span className="text-sm">🔥</span>
              <span className="font-sans text-xs sm:text-sm text-rose-400 font-semibold tracking-wide">
                The All-In-One Placement Engine for CS Engineers
              </span>
            </div>

            {/* Main Light Glass Card */}
            <div className="bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 md:p-10 text-slate-900 transform hover:-translate-y-1 transition-all">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-[1.15] tracking-tight">
                Master CS Fundamentals, <br />
                <span className="text-[#810B38] underline decoration-cyan-400 decoration-4 underline-offset-4">
                  Ace Coding Sandboxes
                </span> <br />
                & Optimize Your Resume.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed font-normal">
                Replace fragmented tools with a single unified platform. Learn with structured paths, practice with live test cases, and pass ATS filters with Groq AI.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#810B38] hover:bg-[#9c244b] text-white font-bold text-base transition-all shadow-lg hover:shadow-rose-900/40 hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined">rocket_launch</span>
                  <span>Launch Student Workspace</span>
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-base transition-all"
                >
                  <span className="material-symbols-outlined">school</span>
                  <span>Explore Catalog</span>
                </button>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-6 mt-6 border-t border-white/10">
              <div className="flex -space-x-3">
                {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'].map((src, idx) => (
                  <img key={idx} src={src} className="w-10 h-10 rounded-full border-2 border-[#0B0F17] object-cover" alt="User" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                  <span className="text-white text-xs font-bold ml-1">4.9 / 5</span>
                </div>
                <p className="text-xs text-white/60">Trusted by 15,000+ CS students across 200+ universities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right 3D Glass-Room Sandbox Showcase */}
        <section className="w-full lg:w-[50%] h-[580px] relative iso-container flex items-center justify-center z-10 mt-12 lg:mt-0 rounded-3xl overflow-hidden bg-[#070b14] border border-cyan-500/30 shadow-[inset_0_0_100px_rgba(6,182,212,0.15)]">
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#06B6D4_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            {/* Main Interactive Floating Code Window */}
            <div className="absolute float-animation z-20 w-[90%] sm:w-[85%] rounded-2xl glass-panel bg-[#0B0F17]/90 border-cyan-500/40 shadow-2xl overflow-hidden">
              {/* Window Bar */}
              <div className="h-10 bg-black/60 border-b border-white/10 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 font-mono text-xs text-cyan-400 font-medium">
                    {activeCodeTab}
                  </span>
                </div>
                <button
                  onClick={triggerTestRun}
                  disabled={runningTest}
                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-mono transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {runningTest ? 'sync' : 'play_arrow'}
                  </span>
                  <span>{runningTest ? 'Executing...' : 'Run Test Cases'}</span>
                </button>
              </div>

              {/* Code Content */}
              <div className="p-5 code-bg text-xs sm:text-sm text-white/90 leading-relaxed overflow-x-auto">
                <span className="text-purple-400">def</span> <span className="text-blue-400 font-bold">optimize_placement</span>(profile):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;skills = profile.<span className="text-emerald-400">get_metrics</span>()<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-purple-400">if</span> skills.score &gt; <span className="text-amber-400">95</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-cyan-300 font-semibold">"Top Tier Match"</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500 italic"># Groq AI ATS Processing...</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> groq_ai.<span className="text-emerald-400">analyze</span>(profile)
              </div>
            </div>

            {/* Floating Test Case Execution Card */}
            <div className="absolute float-animation-delayed z-30 right-3 bottom-8 w-64 rounded-xl glass-panel bg-black/80 border-emerald-500/40 p-4 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-emerald-400 text-[22px]">check_circle</span>
                <div>
                  <h4 className="text-xs font-bold text-white">All Tests Passed</h4>
                  <p className="text-[10px] text-emerald-400 font-mono">3 / 3 Test Cases Verified</p>
                </div>
              </div>
              <div className="space-y-1.5 mt-2">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-full" />
                </div>
                <div className="flex justify-between font-mono text-[10px] text-white/60">
                  <span>Runtime: 12ms</span>
                  <span className="text-cyan-400">Memory: 14.2 MB</span>
                </div>
              </div>
            </div>

            {/* Floating Groq AI Insight Panel */}
            <div className="absolute float-animation-fast z-10 left-3 top-8 w-60 rounded-xl glass-panel bg-[#0B0F17]/95 border-cyan-500/40 p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-1.5 text-cyan-400">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                <span className="font-mono text-xs font-bold">Groq AI Engine</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                Code structure optimized. Time complexity reduced to <code className="text-amber-300">O(N)</code>. ATS match probability increased to 98%.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Feature Section Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Pillars of SkillForge</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2 text-white">
            Everything You Need for Campus & Off-Campus Placements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: 'school',
              title: 'Structured Learning Paths',
              desc: 'Master Data Structures, System Design, SQL & Operating Systems through guided interactive modules.',
              color: 'text-rose-400',
              border: 'hover:border-rose-500/50'
            },
            {
              icon: 'code',
              title: 'Live Practice Sandbox',
              desc: 'Write code with real-time feedback, automated unit testing, memory analysis, and multi-language support.',
              color: 'text-cyan-400',
              border: 'hover:border-cyan-500/50'
            },
            {
              icon: 'psychology',
              title: 'Groq AI ATS Audit',
              desc: 'Scan your resume against top tech job descriptions to uncover missing keywords and format bottlenecks.',
              color: 'text-emerald-400',
              border: 'hover:border-emerald-500/50'
            }
          ].map((feat, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl glass-panel bg-white/5 border border-white/10 ${feat.border} transition-all duration-300 hover:-translate-y-2`}
            >
              <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 ${feat.color}`}>
                <span className="material-symbols-outlined text-[28px]">{feat.icon}</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-white">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
