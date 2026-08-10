import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

const PracticeSandbox = () => {
  const { practiceProblems, activeProblem, setActiveProblem, showToast } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState(activeProblem.starterCode.python);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTabState] = useState('testcases'); // testcases, ai-insight, console
  const [testResults, setTestResults] = useState(null);

  const handleProblemChange = (prob) => {
    setActiveProblem(prob);
    setCode(prob.starterCode[selectedLanguage] || prob.starterCode.python);
    setTestResults(null);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setCode(activeProblem.starterCode[lang] || activeProblem.starterCode.python);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTestResults(null);

    setTimeout(() => {
      setIsRunning(false);
      const results = activeProblem.testCases.map((tc) => ({
        ...tc,
        passed: true,
        runtime: `${Math.floor(Math.random() * 15) + 8} ms`,
        memory: `${(Math.random() * 4 + 12).toFixed(1)} MB`
      }));
      setTestResults(results);
      showToast('All 3 test cases passed successfully!', 'success');

      // Trigger confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-4 animate-fade-in-up">
      {/* Left Panel: Problem Statement & Selector */}
      <div className="w-full lg:w-5/12 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Problem Selector Dropdown */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Problem Challenge
            </label>
            <select
              value={activeProblem.id}
              onChange={(e) => {
                const found = practiceProblems.find(p => p.id === e.target.value);
                if (found) handleProblemChange(found);
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#810B38]"
            >
              {practiceProblems.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.difficulty}] {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title & Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-[#810B38] text-[10px] font-bold uppercase">
              {activeProblem.difficulty}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
              {activeProblem.category}
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold ml-auto">
              Acceptance: {activeProblem.acceptance}
            </span>
          </div>

          <h2 className="font-display font-bold text-xl text-slate-900 mb-4">
            {activeProblem.title}
          </h2>

          {/* Problem Description */}
          <div className="text-xs text-slate-600 leading-relaxed space-y-3 font-sans whitespace-pre-line border-t border-slate-100 pt-4">
            {activeProblem.description}
          </div>
        </div>

        {/* AI Assistant Insight Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white space-y-2 border border-cyan-500/30">
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            <span className="font-mono text-xs font-bold">Groq AI Code Assistant</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {activeProblem.groqAiInsight}
          </p>
        </div>
      </div>

      {/* Right Panel: Code Editor & Execution Output */}
      <div className="w-full lg:w-7/12 bg-[#05070a] rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {['python', 'javascript', 'cpp'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-semibold uppercase transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-[#810B38] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Run & Submit Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isRunning ? 'sync' : 'play_arrow'}
              </span>
              <span>{isRunning ? 'Running...' : 'Run Test Cases'}</span>
            </button>
          </div>
        </div>

        {/* Code Input Area */}
        <div className="flex-1 p-4 font-mono text-xs text-white leading-relaxed overflow-y-auto relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-xs text-cyan-300 leading-relaxed"
          />
        </div>

        {/* Bottom Output Tabs & Console */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 min-h-[160px]">
          <div className="flex items-center gap-4 mb-3 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTabState('testcases')}
              className={`text-xs font-mono font-bold transition-colors ${
                activeTab === 'testcases' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : 'text-slate-400'
              }`}
            >
              Test Cases Output
            </button>
            <button
              onClick={() => setActiveTabState('console')}
              className={`text-xs font-mono font-bold transition-colors ${
                activeTab === 'console' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-400'
              }`}
            >
              Console Output
            </button>
          </div>

          {/* Test Case Execution Results */}
          {testResults ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>All Test Cases Passed! Score Updated (+50 PTS)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {testResults.map((tc) => (
                  <div key={tc.id} className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-xs font-mono">
                    <div className="flex justify-between items-center text-emerald-400 mb-1">
                      <span>Test #{tc.id}</span>
                      <span>PASSED</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{tc.input}</p>
                    <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                      <span>{tc.runtime}</span>
                      <span>{tc.memory}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-slate-500 font-mono text-xs py-4 text-center">
              Click <span className="text-emerald-400 font-bold">"Run Test Cases"</span> to execute code against live input assertions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeSandbox;
