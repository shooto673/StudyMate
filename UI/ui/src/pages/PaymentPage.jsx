import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

const PaymentPage = ({ plan, onConfirmPayment, onBack }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate API call for payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    const handleFinish = () => {
        onConfirmPayment(plan.id);
    };

    if (isSuccess) {
        return (
            <div className="container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="card" style={{ textAlign: 'center', padding: '40px', maxWidth: '400px', width: '100%', margin: '0 20px' }}>
                    <CheckCircle2 color="var(--success)" size={64} style={{ margin: '0 auto 24px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>お支払い完了！</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        「{plan.name}」プランにアップグレードしました。StudyMate AIのすべての機能をお楽しみいただけます。
                    </p>
                    <button className="btn btn-primary" onClick={handleFinish} style={{ width: '100%' }}>
                        ダッシュボードへ戻る
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="content-wrapper">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <button onClick={onBack} style={{ color: 'var(--text-muted)' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>お支払い情報の入力</h1>
                </div>

                <div className="card" style={{ marginBottom: '24px', backgroundColor: 'var(--bg-subtle)', border: 'none' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px' }}>選択中のプラン</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>{plan.name} プラン</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{plan.price}<span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/月</span></span>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }}>
                            カード名義
                        </label>
                        <input
                            type="text"
                            placeholder="TARO YAMADA"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }}>
                            <CreditCard size={16} /> カード番号
                        </label>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }}>有効期限</label>
                            <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '1rem' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }}>セキュリティコード</label>
                            <input type="text" placeholder="CVC" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', outline: 'none', fontSize: '1rem' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <ShieldCheck size={16} color="var(--success)" />
                    <span>すべての通信は暗号化され安全に処理されます</span>
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={isProcessing}
                    onClick={handlePayment}
                >
                    {isProcessing ? '処理中...' : `${plan.price} で決済を確定する`}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
