import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BackgroundShader from './BackgroundShader';

const SignInModal = () => {
  const { login, setActiveTab, showToast } = useApp();
  const [email, setEmail] = useState('lohith.rc@skillforge.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email, password);
    }, 600);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login('lohith.rc@skillforge.edu', 'demo123');
    }, 400);
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
          <span className="px-3 py-1 rounded-full bg-[#810B38]/40 border border-[#810B38] text-rose-300 text-xs font-bold uppercase tracking-wider">
            Engineered for CS Placements
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight">
            Accelerate your tech career with real-time feedback.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Access curated CS modules, automated coding sandboxes, and Groq AI-powered resume match optimization.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          © 2026 SkillForge Education Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-[#810B38] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </div>
              <span className="font-display font-bold text-lg text-slate-900">SkillForge</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Please enter your details to access your student workspace.
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#810B38]">Instant Demo Access</p>
              <p className="text-[11px] text-slate-600">Pre-filled with student profile "Lohith R C"</p>
            </div>
            <button
              onClick={handleQuickDemo}
              className="px-3 py-1.5 rounded-lg bg-[#810B38] hover:bg-[#9c244b] text-white text-xs font-semibold shadow-sm transition-all"
            >
              1-Click Sign In
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#810B38] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to email!', 'info'); }} className="text-xs text-[#810B38] hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#810B38] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#810B38] focus:ring-[#810B38]"
                />
                <span className="text-xs text-slate-600 font-medium">Remember for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#810B38] hover:bg-[#9c244b] text-white font-bold text-sm shadow-lg hover:shadow-rose-900/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={() => setActiveTab('signup')}
                className="text-[#810B38] font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
