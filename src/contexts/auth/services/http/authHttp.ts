import { supabase } from '@services/http/config';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function resetPassword(email: string, redirectTo: string) {
  return supabase.auth.resetPasswordForEmail(email, { redirectTo });
}
