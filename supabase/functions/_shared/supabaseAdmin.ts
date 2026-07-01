import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Service-role Supabase client for edge functions. Bypasses RLS — only ever
 * runs server-side. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected
 * automatically into the function runtime by Supabase.
 */
export function supabaseAdmin() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )
}

/** Resolve the authenticated user from the request's Authorization header. */
export async function getUser(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  const { data, error } = await supabaseAdmin().auth.getUser(token)
  if (error) return null
  return data.user
}
