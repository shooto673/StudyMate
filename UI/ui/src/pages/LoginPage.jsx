import React from 'react';
import Mascot from '../components/Mascot';

const LoginPage = ({ onNavigate }) => {
    return (
        <div className="container" style={{ justifyContent: 'center' }}>
            <div className="content-wrapper fade-in" style={{ justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>

                <div style={{ textAlign: 'center', marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Mascot size={120} state="idle" />
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '32px', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                        ログインしてお勉強スタート
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>今日も一緒にがんばろう！</p>
                </div>

                <div className="card glass-panel" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px' }}>

                    <button
                        className="btn"
                        style={{
                            backgroundColor: 'white',
                            color: 'var(--text-main)',
                            border: '2px solid var(--border-strong)',
                            width: '100%',
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(0)' }}
                        onClick={() => onNavigate('grade_select')}
                    >
                        <svg width="24" height="24" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Googleでログイン
                    </button>

                    <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
                        <div style={{ borderTop: '2px solid var(--border-strong)', position: 'absolute', top: '50%', width: '100%', zIndex: 1 }}></div>
                        <span style={{ background: 'var(--bg-card)', padding: '0 16px', position: 'relative', zIndex: 2, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>または</span>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', margin: '0 0 12px 8px' }}>
                            紹介コードをお持ちの方 (任意)
                        </label>
                        <input
                            type="text"
                            placeholder="コードを入力 (例: STUDY123)"
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: 'var(--radius-sm)',
                                border: '2px solid var(--border-strong)',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                outline: 'none',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '16px' }}
                        onClick={() => onNavigate('grade_select')}
                    >
                        ゲストとしてお試し
                    </button>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
