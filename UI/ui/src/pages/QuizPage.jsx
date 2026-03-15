import React, { useState, useEffect } from 'react';
import Mascot from '../components/Mascot';
import { X, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const QuizPage = ({ unit, questions, onBack, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isAnswered, setIsAnswered] = useState(false);

    const question = questions[currentIndex];
    const progressPercent = ((currentIndex) / questions.length) * 100;

    // Animate mascot state
    const [mascotState, setMascotState] = useState('thinking');

    useEffect(() => {
        if (!isAnswered) {
            setMascotState('thinking');
        }
    }, [currentIndex, isAnswered]);

    const handleSelect = (idx) => {
        if (isAnswered) return;

        setSelectedOption(idx);
        setIsAnswered(true);

        const isCorrect = idx === question.correct;
        setMascotState(isCorrect ? 'cheer' : 'error');

        const newAnswers = [...answers, { questionId: question.id, selectedIndex: idx, isCorrect }];
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            window.scrollTo(0, 0);
        } else {
            onFinish(answers);
        }
    };

    return (
        <div className="container" style={{ backgroundColor: 'var(--bg-main)' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', backgroundColor: 'var(--bg-card-solid)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
                <button onClick={onBack} style={{ color: 'var(--text-muted)' }}>
                    <X size={24} />
                </button>
                <div style={{ flex: 1, padding: '0 20px' }}>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: 'var(--primary)', transition: 'width 0.3s ease-in-out' }}></div>
                    </div>
                </div>
                <div style={{ fontWeight: '900', fontSize: '0.9rem', color: 'var(--primary)' }}>
                    {currentIndex + 1} / {questions.length}
                </div>
            </header>

            <div className="content-wrapper fade-in" style={{ padding: '32px 20px 100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Mascot size={100} state={mascotState} />
                </div>

                <div className="card glass-panel" style={{ marginBottom: '32px', padding: '32px 24px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', lineHeight: 1.5, textAlign: 'center' }}>
                        {question.text}
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {question.options.map((opt, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrectTarget = question.correct === idx;

                        let btnStyle = {
                            border: '2px solid var(--border-strong)',
                            backgroundColor: 'var(--bg-card-solid)',
                            color: 'var(--text-main)'
                        };

                        if (isAnswered) {
                            if (isCorrectTarget) {
                                btnStyle = { border: '2px solid var(--success)', backgroundColor: 'var(--success-light)', color: 'var(--success)' };
                            } else if (isSelected && !isCorrectTarget) {
                                btnStyle = { border: '2px solid var(--danger)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)' };
                            } else {
                                btnStyle.opacity = 0.5;
                            }
                        } else if (isSelected) {
                            btnStyle = { border: '2px solid var(--primary)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' };
                        }

                        return (
                            <button
                                key={idx}
                                className="card"
                                style={{
                                    ...btnStyle,
                                    padding: '20px',
                                    fontSize: '1.2rem',
                                    fontWeight: '800',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    boxShadow: isAnswered ? 'none' : 'var(--shadow-sm)'
                                }}
                                onClick={() => handleSelect(idx)}
                                disabled={isAnswered}
                            >
                                <span>{opt}</span>
                                {isAnswered && isCorrectTarget && <CheckCircle2 size={24} color="var(--success)" />}
                                {isAnswered && isSelected && !isCorrectTarget && <XCircle size={24} color="var(--danger)" />}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="fade-in" style={{ marginTop: '32px' }}>
                        <div style={{
                            padding: '24px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: selectedOption === question.correct ? 'var(--success-light)' : 'var(--danger-light)',
                            border: `1px solid ${selectedOption === question.correct ? 'var(--success)' : 'var(--danger)'}`,
                            marginBottom: '24px'
                        }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: selectedOption === question.correct ? 'var(--success)' : 'var(--danger)', marginBottom: '12px' }}>
                                {selectedOption === question.correct ? '正解！素晴らしい！' : '惜しい！'}
                            </h3>
                            <p style={{ fontSize: '1.05rem', lineHeight: 1.6, fontWeight: '700', color: 'var(--text-main)' }}>
                                {question.explanation}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {isAnswered && (
                <div className="fade-in" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '24px', backgroundColor: 'var(--bg-card-solid)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', zIndex: 100 }}>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', maxWidth: '440px', padding: '16px', fontSize: '1.2rem', boxShadow: '0 8px 32px var(--primary-glow)' }}
                        onClick={handleNext}
                    >
                        {currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'} <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
