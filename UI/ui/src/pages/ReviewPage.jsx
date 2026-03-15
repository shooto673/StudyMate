import React from 'react';
import Header from '../components/Header';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

const ReviewPage = ({ answers, questions, onBack }) => {
    const incorrectAnswers = answers.filter(a => !a.isCorrect);

    if (incorrectAnswers.length === 0) {
        return (
            <div className="container">
                <Header onLogout={onBack} />
                <div className="content-wrapper" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <CheckCircle2 size={64} color="var(--success)" style={{ marginBottom: '24px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>復習する問題はありません！</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '32px' }}>全問正解でした。素晴らしいです！</p>
                    <button className="btn btn-primary" onClick={onBack}>
                        ダッシュボードへ戻る <ArrowLeft size={20} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ backgroundColor: 'var(--bg-main)' }}>
            <Header onLogout={onBack} />
            <div className="content-wrapper fade-in" style={{ padding: '0 20px 40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <button onClick={onBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', padding: 0 }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '900', marginLeft: '16px' }}>間違えた問題の復習</h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {incorrectAnswers.map((ans, idx) => {
                        const question = questions.find(q => q.id === ans.questionId);
                        if (!question) return null;

                        return (
                            <div key={idx} className="card glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ padding: '24px', backgroundColor: 'var(--bg-card-solid)', borderBottom: '1px solid var(--border)' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '900', lineHeight: 1.5 }}>
                                        <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>Q.</span>
                                        {question.text}
                                    </h3>
                                </div>

                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <XCircle size={24} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 'bold', marginBottom: '4px' }}>あなたの回答</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{question.options[ans.selectedIndex]}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <CheckCircle2 size={24} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '4px' }}>正解</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{question.options[question.correct]}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ backgroundColor: 'var(--primary-light)', padding: '20px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--primary)' }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '900', marginBottom: '8px' }}>AIの解説</div>
                                        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)', fontWeight: '600' }}>
                                            {question.explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
