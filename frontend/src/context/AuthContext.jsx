import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_USER } from '../data/mockData';
import { authApi, profileApi, clearAuthTokens, getStoredAccessToken } from '../services/api';
import { 
  supabase, 
  signInWithSupabase, 
  signUpWithSupabase, 
  signInWithGoogleSupabase, 
  signOutSupabase, 
  getSupabaseSession, 
  onSupabaseAuthStateChange,
  upsertProfile,
  getProfile 
} from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children, onLoginSuccess, onLogoutSuccess }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredAccessToken()));
  const [loading, setLoading] = useState(true);

  // Helper: build user state from a Supabase user object + optional profile
  const buildUserFromSupabase = useCallback((supaUser, profile = null) => {
    const fullName = profile?.full_name || supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || INITIAL_USER.name;
    return {
      ...INITIAL_USER,
      email: supaUser.email,
      name: fullName,
      avatar: fullName.substring(0, 2).toUpperCase(),
    };
  }, []);

  // Synchronize Supabase session changes
  useEffect(() => {
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      // Check Supabase session first if Supabase is initialized
      if (supabase) {
        const session = await getSupabaseSession();
        if (session && session.user) {
          const supaUser = session.user;
          localStorage.setItem('accessToken', session.access_token);
          if (session.refresh_token) {
            localStorage.setItem('refreshToken', session.refresh_token);
          }

          // Fetch or create profile in Supabase DB
          let profile = await getProfile(supaUser.id);
          if (!profile) {
            profile = await upsertProfile(supaUser);
          }

          setUser(buildUserFromSupabase(supaUser, profile));
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        unsubscribe = onSupabaseAuthStateChange(async (event, session) => {
          if (session && session.user) {
            localStorage.setItem('accessToken', session.access_token);
            if (session.refresh_token) {
              localStorage.setItem('refreshToken', session.refresh_token);
            }

            // Upsert profile on auth state change (e.g., Google OAuth redirect)
            const profile = await upsertProfile(session.user);

            setUser(buildUserFromSupabase(session.user, profile));
            setIsAuthenticated(true);
          } else if (event === 'SIGNED_OUT') {
            clearAuthTokens();
            setIsAuthenticated(false);
            setUser(INITIAL_USER);
          }
        });
      }

      // Backend fallback check
      const token = getStoredAccessToken();
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const profileData = await profileApi.getMyProfile();
        if (profileData) {
          setUser(prev => ({
            ...prev,
            ...profileData,
            name: profileData.fullName || prev.name,
          }));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log('Error verifying session or backend offline.', err);
        if (!getStoredAccessToken()) {
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => unsubscribe();
  }, [buildUserFromSupabase]);

  const login = useCallback(async (email, password) => {
    // 1. Try Supabase Auth if configured
    if (supabase) {
      try {
        const data = await signInWithSupabase(email, password);
        if (data && data.session) {
          localStorage.setItem('accessToken', data.session.access_token);
          if (data.session.refresh_token) {
            localStorage.setItem('refreshToken', data.session.refresh_token);
          }

          // Store/update profile in Supabase DB
          const profile = await upsertProfile(data.user);

          const fullName = profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0];
          setUser(buildUserFromSupabase(data.user, profile));
          setIsAuthenticated(true);

          // Sync with Spring Boot backend in background (non-blocking, logged)
          try {
            await authApi.login(email, password);
          } catch (e) {
            console.warn('[Auth] Backend sync failed (non-critical):', e.message);
          }

          if (onLoginSuccess) onLoginSuccess(fullName);
          return { success: true, data };
        }
      } catch (supaErr) {
        console.error('[Auth] Supabase sign-in error:', supaErr.message);
        return { success: false, error: supaErr.message };
      }
    }

    // 2. Fallback to Spring Boot Backend API (only if Supabase is not configured)
    try {
      const authData = await authApi.login(email, password);
      if (authData && authData.accessToken) {
        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('refreshToken', authData.refreshToken);
        setUser({
          ...INITIAL_USER,
          email: authData.email,
          name: authData.fullName || INITIAL_USER.name,
          role: authData.role,
        });
        setIsAuthenticated(true);
        if (onLoginSuccess) onLoginSuccess(authData.fullName || INITIAL_USER.name);
        return { success: true, data: authData };
      }
    } catch (err) {
      console.error('[Auth] Backend login failed:', err.message);
      return { success: false, error: err.message || 'Login failed. Please check your credentials and try again.' };
    }

    return { success: false, error: 'Login failed. Please try again.' };
  }, [onLoginSuccess, buildUserFromSupabase]);

  const register = useCallback(async (name, email, password) => {
    // 1. Try Supabase Auth if configured
    if (supabase) {
      try {
        const data = await signUpWithSupabase(email, password, name);
        if (data && (data.session || data.user)) {
          if (data.session) {
            localStorage.setItem('accessToken', data.session.access_token);
            if (data.session.refresh_token) {
              localStorage.setItem('refreshToken', data.session.refresh_token);
            }
          }

          // Store profile in Supabase DB
          const profile = await upsertProfile(data.user);

          const userFullName = profile?.full_name || name || data.user?.email?.split('@')[0];
          setUser(buildUserFromSupabase(data.user, profile));
          setIsAuthenticated(true);

          // Sync with Spring Boot backend (non-blocking, logged)
          try {
            await authApi.register(email, password, name);
          } catch (e) {
            console.warn('[Auth] Backend sync failed (non-critical):', e.message);
          }

          if (onLoginSuccess) onLoginSuccess(userFullName);
          return { success: true, data };
        }

        // Supabase may require email confirmation — user exists but no session yet
        if (data && data.user && !data.session) {
          return { 
            success: true, 
            data, 
            confirmationRequired: true,
            message: 'Please check your email to confirm your account before signing in.' 
          };
        }
      } catch (supaErr) {
        console.error('[Auth] Supabase sign-up error:', supaErr.message);
        return { success: false, error: supaErr.message };
      }
    }

    // 2. Fallback to Spring Boot Backend API (only if Supabase is not configured)
    try {
      const authData = await authApi.register(email, password, name);
      if (authData && authData.accessToken) {
        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('refreshToken', authData.refreshToken);
        setUser({
          ...INITIAL_USER,
          email: authData.email,
          name: authData.fullName || name,
          role: authData.role,
        });
        setIsAuthenticated(true);
        if (onLoginSuccess) onLoginSuccess(authData.fullName || name);
        return { success: true, data: authData };
      }
    } catch (err) {
      console.error('[Auth] Backend registration failed:', err.message);
      return { success: false, error: err.message || 'Registration failed. Please try again.' };
    }

    return { success: false, error: 'Registration failed. Please try again.' };
  }, [onLoginSuccess, buildUserFromSupabase]);

  const loginWithGoogle = useCallback(async () => {
    if (supabase) {
      try {
        const data = await signInWithGoogleSupabase();
        // signInWithOAuth redirects the browser — if it returns without error, the redirect is in progress
        if (data) return { success: true };
      } catch (err) {
        console.error('[Auth] Google OAuth error:', err.message);
        // Surface the actual error instead of silently faking a login
        throw new Error(
          err.message?.includes('provider')
            ? 'Google sign-in is not enabled. Please use email and password to sign in, or contact support.'
            : err.message || 'Google sign-in failed. Please try again.'
        );
      }
    }

    // If Supabase is not configured, Google OAuth is not available
    throw new Error('Google sign-in is not configured. Please use email and password to sign in.');
  }, []);

  const logout = useCallback(async () => {
    await signOutSupabase();
    clearAuthTokens();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    if (onLogoutSuccess) {
      onLogoutSuccess();
    }
  }, [onLogoutSuccess]);

  const value = useMemo(() => ({
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
  }), [user, isAuthenticated, loading, login, register, loginWithGoogle, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

