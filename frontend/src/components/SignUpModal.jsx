import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const SignUpModal = memo(() => {
  const { register, loginWithGoogle } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await register(fullName, email, password);
      if (res && res.confirmationRequired) {
        setSuccessMessage(res.message || 'Please check your email to confirm your account.');
      } else if (res && !res.success && res.error) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      // If we get here without redirect, the OAuth redirect is in progress
    } catch (err) {
      setErrorMessage(err.message || 'Google sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8F9FC] font-sans text-[#1F1B2D]">
      {/* Left Column matching Reference Image 4 */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-[#F8F9FC]">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F0EBFA] text-[#5B4E80] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">school</span>
          </div>
          <span className="font-display font-black text-xl text-[#1F1B2D]">SkillForge</span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-10 max-w-lg shadow-sm space-y-4 my-auto">
          <span className="px-3.5 py-1 rounded-full bg-[#F0EBFA] text-[#5B4E80] text-[10px] font-bold uppercase tracking-wider">
            ELITE TALENT ENGINE
          </span>
          <h2 className="font-display text-4xl font-black text-[#1F1B2D] leading-tight">
            Accelerate your tech career with real-time feedback.
          </h2>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Get instant access to CS learning tracks, algorithmic sandbox assessments, and AI resume ATS scoring.
          </p>
        </div>

        <div className="text-xs text-[#9CA3AF]">
          © 2026 SkillForge Education Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column Form matching Reference Image 4 */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 border-l border-[#EAEAEA]">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="font-display text-3xl font-black text-[#1F1B2D]">
              Create your account
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              Join SkillForge to start practicing coding sandboxes and courses.
            </p>
          </div>

          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#9CA3AF] text-[#1F1B2D] text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.04.0 12c0 1.96.47 3.8 1.29 5.42l3.99-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#EAEAEA] w-full" />
            <span className="bg-white px-3 text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider absolute">
              OR FILL DETAILS
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rakshith Y B"
                className="w-full px-4 py-3 rounded-xl bg-[#F3F4F6] border-none text-xs text-[#1F1B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4E80]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-4 py-3 rounded-xl bg-[#F3F4F6] border-none text-xs text-[#1F1B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4E80]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 rounded-xl bg-[#F3F4F6] border-none text-xs text-[#1F1B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4E80]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#5B4E80] hover:bg-[#4C4070] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-[#6B7280]">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/signin')}
                className="text-[#5B4E80] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

SignUpModal.displayName = 'SignUpModal';

export default SignUpModal;
