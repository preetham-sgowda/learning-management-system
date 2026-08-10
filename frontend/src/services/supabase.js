import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database & auth
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Sign up a new user with Supabase Auth
 */
export async function signUpWithSupabase(email, password, fullName) {
  if (!supabase) {
    throw new Error('Supabase URL or Anon Key is missing in .env configuration');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in existing user with Supabase Auth
 */
export async function signInWithSupabase(email, password) {
  if (!supabase) {
    throw new Error('Supabase URL or Anon Key is missing in .env configuration');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in using Google OAuth via Supabase
 */
export async function signInWithGoogleSupabase() {
  if (!supabase) {
    throw new Error('Supabase URL or Anon Key is missing in .env configuration');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out user from Supabase
 */
export async function signOutSupabase() {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Get current session from Supabase
 */
export async function getSupabaseSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Listen for auth state changes (login, logout, token refresh)
 */
export function onSupabaseAuthStateChange(callback) {
  if (!supabase) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

export default supabase;
