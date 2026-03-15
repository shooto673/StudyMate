import React from 'react';
import Header from '../components/Header';
import Mascot from '../components/Mascot';
import ProgressRing from '../components/ProgressRing';
import { Play, Target, Award, Flame, Lock } from 'lucide-react';

const DashboardPage = ({ units, stats, usageToday, dailyLimit, currentPlanId, onStartQuiz, onChangeGrade, onNavigate }) => {
    const isLimitReached = usageToday >= dailyLimit && currentPlanId === 'light';
    const progressPercent = currentPlanId === 'light' ? (usageToday / dailyLimit) * 100 : 100;

    return (
        <div className="container">
            <Header
                grade="中学1年"
                isPremium={currentPlanId !== 'free'}
                onLogout={() => onNavigate('landing')}
            />

            <div className="content-wrapper fade-in" style={{ padding: '0 20px 40px' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', marginBottom: '24px' }}>
                    <Mascot size={80} state="idle" />
                    <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '4px' }}>おかえり、Shuto！</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600', lineHeight: 1.4 }}>
                            今日も「be動詞の現在形」から<br />お勉強をスタートしよう！
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px', backgroundColor: 'var(--bg-main)' }}>
                        <Target size={28} color="var(--primary)" style={{ marginBottom: '8px', filter: 'drop-shadow(0 2px 4px var(--primary-glow))' }} />
                        <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{stats.totalAnswered}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>総回答数</div>
                    </div>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px', backgroundColor: 'var(--bg-main)' }}>
                        <Award size={28} color="var(--success)" style={{ marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(46, 204, 113, 0.3))' }} />
                        <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{stats.accuracy}%</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>正答率</div>
                    </div>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px', backgroundColor: 'var(--bg-main)' }}>
                        <Flame size={28} color="var(--secondary)" style={{ marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(243, 156, 18, 0.3))' }} />
                        <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{stats.streakDays}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>連続日数</div>
                    </div>
                </div>

                {currentPlanId === 'light' && (
                    <div className="card glass-panel" style={{ marginBottom: '32px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontWeight: '800', fontSize: '1rem' }}>本日の利用状況</span>
                            <span style={{ fontWeight: '800', color: isLimitReached ? 'var(--danger)' : 'var(--text-muted)' }}>
                                {usageToday} / {dailyLimit}問
                            </span>
                        </div>
                        <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${progressPercent}%`,
                                backgroundColor: isLimitReached ? 'var(--danger)' : 'var(--primary)',
                                transition: 'width 0.5s ease-in-out'
                            }}></div>
                        </div>
                        {isLimitReached && (
                            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
                                    本日の無料枠が終了しました。<br />もっと学習するにはプランをアップグレードしてください。
                                </p>
                                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => onNavigate('pricing')}>
                                    プランを見る
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {currentPlanId !== 'light' && (
                    <div className="card glass-panel" style={{ marginBottom: '32px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontWeight: '800', fontSize: '1rem', display: 'block' }}>勉強し放題モード！</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>制限なしで学習できます</span>
                        </div>
                        <Flame size={32} color="var(--secondary)" />
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>学習単元</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {units.map((unit) => (
                        <div
                            key={unit.id}
                            className={`card ${!unit.isLocked ? 'glass-panel' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '20px',
                                opacity: unit.isLocked ? 0.6 : 1,
                                backgroundColor: unit.isLocked ? 'var(--bg-subtle)' : 'var(--bg-card)',
                                transform: 'scale(1)',
                                transition: 'transform 0.2s',
                                cursor: unit.isLocked ? 'not-allowed' : 'default'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '6px' }}>
                                    {unit.title}
                                    {unit.isLocked && <Lock size={16} color="var(--text-muted)" style={{ marginLeft: '8px', verticalAlign: 'middle' }} />}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {unit.progress === 100 ? (
                                        <span className="badge" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>クリア済</span>
                                    ) : (
                                        <span className="badge">学習中</span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                {!unit.isLocked ? (
                                    <ProgressRing progress={unit.progress} size={54} strokeWidth={6} color={unit.progress === 100 ? "var(--success)" : "var(--primary)"} />
                                ) : (
                                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Lock size={24} color="var(--text-muted)" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '440px', padding: '0 20px', zIndex: 100 }}>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '18px', fontSize: '1.25rem', boxShadow: '0 8px 32px var(--primary-glow)' }}
                        disabled={isLimitReached}
                        onClick={onStartQuiz}
                    >
                        <Play size={24} style={{ marginRight: '12px', fill: 'currentColor' }} />
                        学習をスタート
                    </button>
                </div>
                {/* Push content above fixed button */}
                <div style={{ height: '80px' }}></div>
            </div>
        </div>
    );
};

export default DashboardPage;
