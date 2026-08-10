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
  onSupabaseAuthStateChange 
} from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children, onLoginSuccess, onLogoutSuccess }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredAccessToken()));
  const [loading, setLoading] = useState(true);

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
          setUser(prev => ({
            ...prev,
            email: supaUser.email,
            name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || prev.name,
          }));
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        unsubscribe = onSupabaseAuthStateChange((event, session) => {
          if (session && session.user) {
            localStorage.setItem('accessToken', session.access_token);
            if (session.refresh_token) {
              localStorage.setItem('refreshToken', session.refresh_token);
            }
            setUser(prev => ({
              ...prev,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || prev.name,
            }));
            setIsAuthenticated(true);
          } else if (event === 'SIGNED_OUT') {
            clearAuthTokens();
            setIsAuthenticated(false);
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
  }, []);

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
          const fullName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0];
          setUser({
            ...INITIAL_USER,
            email: data.user.email,
            name: fullName,
          });
          setIsAuthenticated(true);

          // Sync with Spring Boot backend in background if needed
          try {
            await authApi.login(email, password);
          } catch (e) {
            /* optional sync error ignore */
          }

          if (onLoginSuccess) onLoginSuccess(fullName);
          return { success: true, data };
        }
      } catch (supaErr) {
        console.log('Supabase sign-in error:', supaErr.message);
        // If Supabase throws invalid credentials, report error
        if (supaErr.message?.toLowerCase().includes('invalid')) {
          return { success: false, error: supaErr.message };
        }
      }
    }

    // 2. Fallback to Spring Boot Backend API
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
      console.log('Backend auth offline or failed, using demo login.', err);
      setIsAuthenticated(true);
      setUser({
        ...INITIAL_USER,
        email: email || INITIAL_USER.email,
      });
      if (onLoginSuccess) {
        onLoginSuccess(INITIAL_USER.name);
      }
      return { success: false, error: err.message };
    }
  }, [onLoginSuccess]);

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
          const userFullName = name || data.user?.email?.split('@')[0];
          setUser({
            ...INITIAL_USER,
            email: email,
            name: userFullName,
          });
          setIsAuthenticated(true);

          // Sync with Spring Boot backend
          try {
            await authApi.register(email, password, name);
          } catch (e) {
            /* backend sync */
          }

          if (onLoginSuccess) onLoginSuccess(userFullName);
          return { success: true, data };
        }
      } catch (supaErr) {
        console.log('Supabase sign-up error:', supaErr.message);
        if (supaErr.message) {
          return { success: false, error: supaErr.message };
        }
      }
    }

    // 2. Fallback to Spring Boot Backend API
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
      console.log('Backend registration failed, using demo register.', err);
      setIsAuthenticated(true);
      setUser({
        ...INITIAL_USER,
        name: name || INITIAL_USER.name,
        email: email || INITIAL_USER.email,
      });
      if (onLoginSuccess) {
        onLoginSuccess(name || INITIAL_USER.name);
      }
      return { success: false, error: err.message };
    }
  }, [onLoginSuccess]);

  const loginWithGoogle = useCallback(async () => {
    if (supabase) {
      try {
        await signInWithGoogleSupabase();
        return;
      } catch (err) {
        console.log('Supabase Google OAuth error:', err.message);
      }
    }
    // Fallback demo Google OAuth
    setIsAuthenticated(true);
    setUser({
      ...INITIAL_USER,
      email: 'student.google@skillforge.edu',
      name: 'Rakshith Y B (Google)',
    });
    if (onLoginSuccess) onLoginSuccess('Rakshith Y B');
  }, [onLoginSuccess]);

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

