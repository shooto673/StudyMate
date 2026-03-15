import React, { useState } from 'react';
import './index.css';

// Page Imports
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import GradeSelectPage from './pages/GradeSelectPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import ReviewPage from './pages/ReviewPage';

function App() {
    const [currentPage, setCurrentPage] = useState('landing');

    // App State
    const [selectedGradeId, setSelectedGradeId] = useState('');
    const [currentPlanId, setCurrentPlanId] = useState('light');
    const [paymentPlanSelection, setPaymentPlanSelection] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState([]);

    const navigate = (pageId) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentPage(pageId);
    };

    // Mock Data
    const grades = [
        { id: 'e4', name: '小学4年', tag: '基本から', icon: '🐣', disabled: true },
        { id: 'e5', name: '小学5年', tag: 'しっかり', icon: '🐥', disabled: true },
        { id: 'e6', name: '小学6年', tag: '準備開始', icon: '🦅', disabled: true },
        { id: 'j1', name: '中学1年', tag: '基礎固め', icon: '🌱', disabled: false },
        { id: 'j2', name: '中学2年', tag: '実力アップ', icon: '🌿', disabled: false },
        { id: 'j3', name: '中学3年', tag: '受験対策', icon: '🌳', disabled: false },
    ];

    const units = [
        { id: 'u1', title: 'be動詞の現在形', progress: 100, isLocked: false },
        { id: 'u2', title: '一般動詞の現在形', progress: 40, isLocked: false },
        { id: 'u3', title: '名詞の複数形', progress: 0, isLocked: false },
        { id: 'u4', title: '代名詞と所有格 (要Premium)', progress: 0, isLocked: true },
        { id: 'u5', title: '疑問詞 (要Premium)', progress: 0, isLocked: true },
    ];

    const displayUnits = units.map(u => {
        if ((u.id === 'u4' || u.id === 'u5') && currentPlanId !== 'free') {
            return { ...u, isLocked: false, title: u.title.replace(' (要Premium)', '') };
        }
        return u;
    });

    const stats = {
        totalAnswered: 135,
        accuracy: 85,
        streakDays: 7
    };

    const usageToday = currentPlanId === 'light' ? 4 : 0;
    const dailyLimit = currentPlanId === 'light' ? 10 : 9999;

    const plans = [
        { id: 'light', name: 'Light', price: '¥500', features: ['毎日10問まで', '基本の復習機能', '広告なし'], current: currentPlanId === 'light' },
        { id: 'standard', name: 'Standard', price: '¥799', features: ['毎日無制限', 'AIによる詳しい解説', '苦手分析レポート'], current: currentPlanId === 'standard' },
        { id: 'premium', name: 'Premium', price: '¥999', features: ['すべての機能', '英作文AI添削', '個別オンライン学習計画'], current: currentPlanId === 'premium' }
    ];

    const dummyQuestions = [
        {
            id: 'q1',
            text: '「私は先生です」を英語にする際、正しいものは？',
            options: ['I am a teacher.', 'I is a teacher.', 'I are a teacher.', 'I be a teacher.'],
            correct: 0,
            explanation: '「私（I）」と一緒に使うbe動詞は「am」です。'
        },
        {
            id: 'q2',
            text: '「彼女はテニスをします」を英語にする際、正しいものは？',
            options: ['She play tennis.', 'She plays tennis.', 'She playing tennis.', 'She is play tennis.'],
            correct: 1,
            explanation: '主語が三人称単数（She）なので、一般動詞には s をつけます。'
        },
        {
            id: 'q3',
            text: '「彼らは忙しい」を英語にする際、正しいものは？',
            options: ['They am busy.', 'They is busy.', 'They are busy.', 'They busy.'],
            correct: 2,
            explanation: '主語が「彼ら（They）」の場合、be動詞は「are」になります。'
        }
    ];

    const renderPage = () => {
        switch (currentPage) {
            case 'landing':
                return <LandingPage onNavigate={navigate} />;
            case 'login':
                return <LoginPage onNavigate={navigate} />;
            case 'grade_select':
                return <GradeSelectPage
                    grades={grades}
                    selectedGradeId={selectedGradeId}
                    onSelectGrade={setSelectedGradeId}
                    onNext={() => navigate('dashboard')}
                    onBack={() => navigate('login')}
                />;
            case 'dashboard':
                return <DashboardPage
                    units={displayUnits}
                    stats={stats}
                    usageToday={usageToday}
                    dailyLimit={dailyLimit}
                    currentPlanId={currentPlanId}
                    onStartQuiz={() => navigate('quiz')}
                    onChangeGrade={() => navigate('grade_select')}
                    onNavigate={navigate}
                />;
            case 'pricing':
                return <PricingPage
                    plans={plans}
                    onSelectPlan={(id) => {
                        const selected = plans.find(p => p.id === id);
                        setPaymentPlanSelection(selected);
                        navigate('payment');
                    }}
                    onBack={() => navigate('dashboard')}
                />;
            case 'payment':
                return <PaymentPage
                    plan={paymentPlanSelection}
                    onConfirmPayment={(id) => {
                        setCurrentPlanId(id);
                        navigate('dashboard');
                    }}
                    onBack={() => navigate('pricing')}
                />;
            case 'quiz':
                return <QuizPage
                    unit={displayUnits[1]}
                    questions={dummyQuestions}
                    onBack={() => navigate('dashboard')}
                    onFinish={(answers) => {
                        setQuizAnswers(answers);
                        navigate('results');
                    }}
                />;
            case 'results':
                return <ResultsPage
                    unitTitle={displayUnits[1].title}
                    answers={quizAnswers}
                    onReview={() => navigate('review')}
                    onRetry={() => {
                        setQuizAnswers([]);
                        navigate('quiz');
                    }}
                    onBack={() => navigate('dashboard')}
                />;
            case 'review':
                return <ReviewPage
                    answers={quizAnswers}
                    questions={dummyQuestions}
                    onBack={() => navigate('results')}
                />;
            default:
                return <LandingPage onNavigate={navigate} />;
        }
    };

    return (
        <div className="app-root fade-in">
            {renderPage()}
        </div>
    );
}

export default App;
