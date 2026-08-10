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

/**
 * Upsert a user profile row in the Supabase `profiles` table.
 * Called after successful sign-up or sign-in to ensure the user
 * exists in the database (not just in Supabase Auth).
 */
export async function upsertProfile(user) {
  if (!supabase || !user) return null;

  const profileData = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
    avatar_url: user.user_metadata?.avatar_url || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.warn('[Supabase] Profile upsert failed:', error.message);
    return null;
  }

  return data;
}

/**
 * Fetch a user profile from the Supabase `profiles` table.
 */
export async function getProfile(userId) {
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('[Supabase] Profile fetch failed:', error.message);
    return null;
  }

  return data;
}

export default supabase;
