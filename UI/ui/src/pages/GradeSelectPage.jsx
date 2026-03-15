import React from 'react';
import { ArrowLeft } from 'lucide-react';

const GradeSelectPage = ({ grades, selectedGradeId, onSelectGrade, onNext, onBack }) => {
    return (
        <div className="container">
            <div className="content-wrapper fade-in">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <button onClick={onBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', padding: 0 }}>
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '12px', letterSpacing: '-0.5px' }}>学年を選んでね</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>自分にぴったりの問題からスタートしよう！</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                    flex: 1
                }}>
                    {grades.map(grade => {
                        const isSelected = selectedGradeId === grade.id;
                        return (
                            <button
                                key={grade.id}
                                disabled={grade.disabled}
                                onClick={() => onSelectGrade(grade.id)}
                                className={`card ${grade.disabled ? '' : 'glass-panel'}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '32px 16px',
                                    gap: '16px',
                                    border: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                                    backgroundColor: isSelected ? 'var(--primary-light)' : (grade.disabled ? 'rgba(0,0,0,0.02)' : 'var(--bg-card-solid)'),
                                    opacity: grade.disabled ? 0.5 : 1,
                                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                    boxShadow: isSelected ? '0 8px 24px var(--primary-glow)' : 'var(--shadow-sm)',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '3rem', filter: grade.disabled ? 'grayscale(100%)' : 'none', textShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none' }}>
                                    {grade.icon}
                                </div>
                                <div style={{ fontWeight: '900', fontSize: '1.25rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                                    {grade.name}
                                </div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: isSelected ? 'var(--primary-hover)' : 'var(--text-muted)' }}>
                                    {grade.disabled ? '近日公開' : grade.tag}
                                </div>
                            </button>
                        )
                    })}
                </div>

                <div style={{ marginTop: '48px', paddingBottom: '24px' }}>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '18px', fontSize: '1.2rem' }}
                        disabled={!selectedGradeId}
                        onClick={onNext}
                    >
                        この学年ではじめる
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GradeSelectPage;
