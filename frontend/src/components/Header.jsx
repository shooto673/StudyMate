import { useAuth } from '../contexts/AuthContext'
import Mascot from './Mascot'

export default function Header({ page, onNavigate, selectedGradeLabel }) {
  const { user, profile, signOut } = useAuth()

  const initial = profile?.display_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <header className="header">
      <button className="logo-btn" onClick={() => onNavigate('landing')}>
        <Mascot size={36} />
        <strong>
          AI Study<span>Mate</span>
        </strong>
      </button>

      <div className="header-right">
        {selectedGradeLabel && <div className="chip">{selectedGradeLabel}</div>}
        {user && !['landing', 'login'].includes(page) && (
          <>
            <button className="avatar-btn" onClick={() => onNavigate('dashboard')}>
              {initial}
            </button>
            <button className="btn-ghost btn-sm" onClick={signOut}>
              ログアウト
            </button>
          </>
        )}
      </div>
    </header>
  )
}
