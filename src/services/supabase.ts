import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase client for auth + database.
 * Returns null when env vars are missing so the app can run in "demo mode"
 * against mock data without a configured backend.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = Boolean(supabase)
