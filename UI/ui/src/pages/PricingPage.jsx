import React from 'react';
import Header from '../components/Header';
import { CheckCircle2, Crown } from 'lucide-react';

const PricingPage = ({ plans, onSelectPlan, onBack }) => {
    return (
        <div className="container">
            <Header onLogout={onBack} />
            <div className="content-wrapper fade-in" style={{ padding: '0 20px 40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '12px' }}>プランのアップグレード</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: '600' }}>もっと学習したい、AIの詳しい解説が見たい方へ。</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`card glass-panel`}
                            style={{
                                border: plan.current ? '3px solid var(--primary)' : '1px solid var(--border)',
                                position: 'relative',
                                overflow: 'hidden',
                                padding: '32px 24px'
                            }}
                        >
                            {plan.id === 'standard' && (
                                <div style={{ position: 'absolute', top: '16px', right: '-32px', backgroundColor: 'var(--secondary)', color: 'white', padding: '4px 32px', transform: 'rotate(45deg)', fontSize: '0.8rem', fontWeight: '900', boxShadow: 'var(--shadow-sm)' }}>
                                    おすすめ
                                </div>
                            )}
                            {plan.id === 'premium' && (
                                <div style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--secondary)' }}>
                                    <Crown size={32} fill="currentColor" />
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: plan.id === 'premium' ? 'var(--secondary)' : 'var(--text-main)' }}>
                                    {plan.name}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '900', color: plan.id === 'premium' ? 'var(--secondary)' : 'var(--primary)', letterSpacing: '-1px' }}>{plan.price}</span>
                                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>/月</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: '600' }}>
                                        <CheckCircle2 size={24} color={plan.id === 'premium' ? 'var(--secondary)' : 'var(--success)'} style={{ flexShrink: 0 }} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {plan.current ? (
                                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '1.1rem' }} disabled>
                                    現在のプラン
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        width: '100%',
                                        fontSize: '1.1rem',
                                        backgroundColor: plan.id === 'premium' ? 'var(--secondary)' : 'var(--primary)',
                                        boxShadow: plan.id === 'premium' ? '0 4px 14px rgba(243, 156, 18, 0.4)' : '0 4px 14px var(--primary-glow)'
                                    }}
                                    onClick={() => onSelectPlan(plan.id)}
                                >
                                    このプランを選択
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
