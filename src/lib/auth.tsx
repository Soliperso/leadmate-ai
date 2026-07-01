import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/services/supabase'

/**
 * Auth context for LeadMate AI.
 *
 * Live mode (Supabase configured): real email/password auth, session is
 * restored on load and kept in sync via `onAuthStateChange`.
 *
 * Demo mode (no Supabase env): a synthetic user is always "signed in" so the
 * app stays fully explorable with zero configuration. This mirrors the service
 * layer's demo/live seam — screens never branch on configuration themselves.
 */

export interface AuthUser {
  id: string
  email: string
  fullName?: string
}

export interface SignUpResult {
  error: string | null
  /** True when the project requires email confirmation before a session exists. */
  needsConfirmation: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  isDemo: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<SignUpResult>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const DEMO_USER: AuthUser = {
  id: 'demo-user',
  email: 'demo@leadmate.ai',
  fullName: 'Demo User',
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function toUser(session: Session | null): AuthUser | null {
  const u = session?.user
  if (!u) return null
  return {
    id: u.id,
    email: u.email ?? '',
    fullName: (u.user_metadata?.full_name as string | undefined) ?? undefined,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(
    isSupabaseConfigured ? null : DEMO_USER,
  )
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session))
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session))
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signUp: AuthContextValue['signUp'] = async (email, password, fullName) => {
    if (!supabase) {
      setUser({ ...DEMO_USER, email, fullName })
      return { error: null, needsConfirmation: false }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return {
      error: error?.message ?? null,
      needsConfirmation: !error && !data.session,
    }
  }

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    if (!supabase) {
      setUser({ ...DEMO_USER, email })
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    if (!supabase) {
      setUser(DEMO_USER)
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isDemo: !isSupabaseConfigured, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
