import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackgroundShader from './BackgroundShader';

const SignUpModal = () => {
  const { login, setActiveTab } = useApp();
  const [fullName, setFullName] = useState('Lohith R C');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email || 'lohith.rc@skillforge.edu', password);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B0F17] font-sans overflow-hidden relative">
      {/* Left Column: Shader Graphic & Branding */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between p-12 overflow-hidden text-white">
        <BackgroundShader />
        
        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#810B38] flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined text-[22px]">terminal</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">SkillForge</span>
        </div>

        {/* Hero Branding Message */}
        <div className="relative z-10 max-w-md my-auto space-y-4 glass-panel p-8 rounded-3xl border border-white/10">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            Join 15,000+ Placement Achievers
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight">
            Start your placement journey today.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Get instant access to CS learning tracks, algorithmic sandbox assessments, and AI resume ATS scoring.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © 2026 SkillForge Education Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative z-10 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-[#810B38] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </div>
              <span className="font-display font-bold text-lg text-slate-900">SkillForge</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Create your account
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Join SkillForge to start practicing coding sandboxes and courses.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Lohith R C"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#810B38] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#810B38] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Role Track
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#810B38] focus:border-transparent transition-all bg-white"
              >
                <option value="Full Stack Engineer">Full Stack Engineer (SDE-1)</option>
                <option value="Backend Systems Architect">Backend Systems Architect</option>
                <option value="Frontend Engineer">Frontend Specialist (React/Next)</option>
                <option value="Data Engineer">Data Engineer / ML Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#810B38] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded text-[#810B38] focus:ring-[#810B38]"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer">
                I agree to the <a href="#" className="text-[#810B38] underline">Terms of Service</a> and <a href="#" className="text-[#810B38] underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="w-full py-3 px-4 rounded-xl bg-[#810B38] hover:bg-[#9c244b] text-white font-bold text-sm shadow-lg hover:shadow-rose-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Student Account</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => setActiveTab('signin')}
                className="text-[#810B38] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
