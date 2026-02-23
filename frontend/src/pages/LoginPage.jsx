import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Mascot from '../components/Mascot'

const REFERRAL_KEY = 'study-mate-referral-code'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    // 紹介コードをlocalStorageに保存（ログイン後に処理する）
    if (referralCode.trim()) {
      localStorage.setItem(REFERRAL_KEY, referralCode.trim().toUpperCase())
    }

    try {
      await signInWithGoogle()
    } catch (err) {
      setError('ログインに失敗しました。もう一度お試しください。')
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap narrow center">
      <Mascot size={96} className="floating" />
      <h2>ログイン</h2>
      <p className="sub">Googleアカウントで始めましょう</p>

      {error && <div className="error-banner">{error}</div>}

      <div style={{ maxWidth: 320, margin: '0 auto' }}>
        <input
          type="text"
          placeholder="紹介コード（お持ちの方）"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #dce4ef',
            borderRadius: '14px',
            fontSize: '15px',
            textAlign: 'center',
            outline: 'none',
            letterSpacing: '0.05em',
            marginBottom: 8,
          }}
        />
        <p style={{ fontSize: 12, color: '#9ba8bf', margin: '0 0 8px' }}>
          お友達やチューターから紹介コードを受け取った方は入力してください
        </p>
      </div>

      <button
        className="btn-google"
        onClick={handleLogin}
        disabled={loading}
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        {loading ? 'ログイン中...' : 'Googleでログイン'}
      </button>

      <p className="login-note">
        ログインすることで、学習データが保存され<br />いつでも続きから再開できます。
      </p>
    </div>
  )
}
