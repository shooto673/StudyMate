import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const REFERRAL_KEY = 'study-mate-referral-code'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  async function fetchSubscription(userId) {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()
    setSubscription(data)
  }

  async function ensureProfile(authUser) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authUser.id)
      .single()

    if (!existing) {
      const displayName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split('@')[0] ||
        'ユーザー'
      const avatarUrl = authUser.user_metadata?.avatar_url || null

      await supabase.from('profiles').insert({
        id: authUser.id,
        display_name: displayName,
        avatar_url: avatarUrl,
        grade: 'j1',
      })
    }

    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', authUser.id)
      .single()

    if (!existingSub) {
      await supabase.from('subscriptions').insert({
        user_id: authUser.id,
        plan_tier: 'free',
        status: 'active',
      })
    }

    // 紹介コードがあれば記録
    await processReferralCode(authUser.id)
  }

  async function processReferralCode(userId) {
    const code = localStorage.getItem(REFERRAL_KEY)
    if (!code) return

    try {
      // コードを検索
      const { data: codeData } = await supabase
        .from('referral_codes')
        .select('id')
        .eq('code', code)
        .eq('is_active', true)
        .single()

      if (codeData) {
        // 既に紹介済みかチェック
        const { data: existing } = await supabase
          .from('referrals')
          .select('id')
          .eq('referred_user_id', userId)
          .single()

        if (!existing) {
          await supabase.from('referrals').insert({
            referral_code_id: codeData.id,
            referred_user_id: userId,
          })
        }
      }
    } catch {
      // 紹介コード処理の失敗はログイン自体をブロックしない
    }

    localStorage.removeItem(REFERRAL_KEY)
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const authUser = session?.user ?? null
      setUser(authUser)
      if (authUser) {
        await ensureProfile(authUser)
        await fetchProfile(authUser.id)
        await fetchSubscription(authUser.id)
      }
      setLoading(false)
    })

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null
        setUser(authUser)
        if (authUser) {
          await ensureProfile(authUser)
          await fetchProfile(authUser.id)
          await fetchSubscription(authUser.id)
        } else {
          setProfile(null)
          setSubscription(null)
        }
        setLoading(false)
      }
    )

    return () => authListener.unsubscribe()
  }, [])

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSubscription(null)
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id)
      await fetchSubscription(user.id)
    }
  }

  const planTier = subscription?.plan_tier || 'free'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        subscription,
        planTier,
        loading,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
