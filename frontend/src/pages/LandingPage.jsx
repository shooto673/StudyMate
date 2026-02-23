import { useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LandingPage({ onNavigate }) {
  const howRef = useRef(null)
  const { user } = useAuth()

  const handleStart = () => {
    if (user) {
      onNavigate('dashboard')
    } else {
      onNavigate('login')
    }
  }

  return (
    <div className="landing">
      <div className="landing-shell">
        <section className="hero-section">
          <h1 className="hero-title">
            AIが、きみだけの
            <br />
            <span>勉強パートナー</span>に。
          </h1>
          <p className="hero-copy">
            単元を選ぶだけで、あなたに合った練習問題がすぐに出題。
            <br />
            間違えたところはStudy Mateがやさしく解説。塾に通わなく
            <br />
            ても、毎日の学習がもっと楽しくなる。
          </p>

          <div className="hero-actions">
            <button className="btn-primary hero-cta" onClick={handleStart}>
              無料ではじめる →
            </button>
          </div>

          <div className="hero-trust">
            <span>✓ ずっと無料で使える</span>
            <span>✓ クレカ不要</span>
            <span>✓ Googleアカウントで1秒登録</span>
          </div>

          <button
            className="btn-ghost hero-link"
            onClick={() => howRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            使い方を見る ↓
          </button>

          <button className="pricing-link-btn" onClick={() => onNavigate('pricing')}>
            有料プランとの違いを見る
          </button>
        </section>

        <section className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon" style={{ background: '#e9edf7' }}>🎯</div>
            <h3>単元にピッタリの問題</h3>
            <p>テスト範囲を入力するだけ。AIが単元に沿った問題を自動で出題します。</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon" style={{ background: '#f8eeee' }}>💡</div>
            <h3>間違いを即フィードバック</h3>
            <p>なぜ間違えたかをStudy Mateが分かりやすく解説。同じミスをくり返さなくなります。</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon" style={{ background: '#fbf3de' }}>🏆</div>
            <h3>やる気が続く仕組み</h3>
            <p>連続学習の記録やごほうびで続けたくなる体験を。</p>
          </article>
        </section>

        <section className="how-block" ref={howRef}>
          <h2>かんたん3ステップ</h2>
          <p className="how-sub">はじめるのに難しい準備はいりません。</p>

          <div className="step-list">
            <div className="step-row">
              <div className="step-mark" style={{ '--step-color': '#5BA0E6' }}>1</div>
              <div className="step-content">
                <h4>Googleでログイン</h4>
                <p>Googleアカウントでワンクリックログイン。パスワードを覚える必要はありません。</p>
              </div>
            </div>
            <div className="step-row">
              <div className="step-mark" style={{ '--step-color': '#A58BFB' }}>2</div>
              <div className="step-content">
                <h4>単元を選んで問題を解く</h4>
                <p>AIが出す問題に4択で回答。間違えたらすぐにStudy Mateがやさしく解説してくれます。</p>
              </div>
            </div>
            <div className="step-row">
              <div className="step-mark" style={{ '--step-color': '#41CDB7' }}>3</div>
              <div className="step-content">
                <h4>弱点を復習して成長</h4>
                <p>間違えた問題だけを自動で再出題。苦手をつぶして、テストの点数アップにつなげよう。</p>
              </div>
            </div>
          </div>

          <div className="how-cta">
            <button className="btn-primary hero-cta" onClick={handleStart}>
              無料ではじめる →
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
