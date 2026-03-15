import React from 'react';
import Mascot from '../components/Mascot';
import { ArrowRight, Brain, Zap, Clock } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
    return (
        <div className="container">
            <div className="content-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>

                <div className="fade-in" style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Mascot size={120} state="idle" />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginTop: '24px', marginBottom: '8px', letterSpacing: '-1px' }}>
                        StudyMate AI
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '32px', fontWeight: '600' }}>
                        毎日の英語学習をAIと楽しく！
                    </p>
                    <button className="btn btn-primary" onClick={() => onNavigate('login')} style={{ width: '100%', maxWidth: '320px', padding: '16px 24px', fontSize: '1.2rem' }}>
                        無料で始めてみる <ArrowRight size={24} style={{ marginLeft: '12px' }} />
                    </button>
                </div>

                <div className="fade-in" style={{ animationDelay: '0.2s', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '16px' }}>アプリの特長</h2>

                    <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
                        <div style={{ padding: '16px', background: 'linear-gradient(135deg, var(--primary-light), #fff)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                            <Brain size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--primary)' }}>AI問題生成</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>あなたの苦手なポイントに合わせて、AIがぴったりの問題を自動作成します。</p>
                        </div>
                    </div>

                    <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
                        <div style={{ padding: '16px', background: 'linear-gradient(135deg, var(--success-light), #fff)', color: 'var(--success)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                            <Zap size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--success)' }}>即時フィードバック</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>間違えた問題には、AIがすぐにわかりやすい解説を提供します。</p>
                        </div>
                    </div>

                    <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
                        <div style={{ padding: '16px', background: 'linear-gradient(135deg, var(--secondary-light), #fff)', color: 'var(--secondary)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                            <Clock size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--secondary)' }}>学習の習慣化</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>ゲーミフィケーション要素を取り入れ、毎日の学習継続をサポートします。</p>
                        </div>
                    </div>
                </div>

                <div className="fade-in" style={{ animationDelay: '0.4s', width: '100%', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '32px' }}>使い方 3ステップ</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {[
                            { step: 1, title: '学年を選ぶ', desc: '今の学年に合わせた学習内容がセットされます。' },
                            { step: 2, title: '問題を解く', desc: 'AIが用意した問題を一つずつ解いてみよう！' },
                            { step: 3, title: '解説を読んで成長', desc: '間違えた部分はAIの解説でしっかり復習。' }
                        ].map(s => (
                            <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 4px 12px var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '1.2rem', flexShrink: 0 }}>
                                    {s.step}
                                </div>
                                <div style={{ paddingTop: '4px' }}>
                                    <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '4px' }}>{s.title}</div>
                                    <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LandingPage;
