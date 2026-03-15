import React from 'react';
import Header from '../components/Header';
import Mascot from '../components/Mascot';
import { Target, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

const ResultsPage = ({ unitTitle, answers, onReview, onRetry, onBack }) => {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalCount = answers.length;
    const score = Math.round((correctCount / Math.max(totalCount, 1)) * 100);

    let message = "";
    let mascotState = "idle";
    if (score === 100) {
        message = "パーフェクト！素晴らしい！";
        mascotState = "cheer";
    } else if (score >= 80) {
        message = "よくできました！";
        mascotState = "cheer";
    } else if (score >= 50) {
        message = "あともう少し！";
        mascotState = "thinking";
    } else {
        message = "解説を読んで復習しよう！";
        mascotState = "idle";
    }

    return (
        <div className="container" style={{ backgroundColor: 'var(--bg-main)' }}>
            <Header onLogout={onBack} />
            <div className="content-wrapper fade-in" style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '800' }}>{unitTitle}</h2>
                </div>

                <div className="card glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px 24px', textAlign: 'center', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Mascot size={100} state={mascotState} />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary)', marginTop: '24px', marginBottom: '8px' }}>
                        {message}
                    </h3>
                    <div style={{ fontSize: '4rem', fontWeight: '900', lineHeight: 1, color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
                        {score}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>点</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>正解数</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--success)' }}>{correctCount} / {totalCount}</div>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {score < 100 && (
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', boxShadow: '0 6px 20px var(--primary-glow)' }}
                            onClick={onReview}
                        >
                            <CheckCircle2 size={24} style={{ marginRight: '12px' }} /> 間違えた問題を復習する
                        </button>
                    )}

                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                        onClick={onRetry}
                    >
                        <RotateCcw size={24} style={{ marginRight: '12px', color: 'var(--text-muted)' }} /> もう一度挑戦する
                    </button>

                    <button
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '16px', border: 'none', color: 'var(--text-muted)' }}
                        onClick={onBack}
                    >
                        <ArrowLeft size={20} style={{ marginRight: '8px' }} /> ダッシュボードへ戻る
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
