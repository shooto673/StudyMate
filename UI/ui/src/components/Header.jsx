import React from 'react';
import { LogOut, Crown } from 'lucide-react';

const Header = ({ grade, isPremium, avatarInitial = "S", onLogout }) => {
    return (
        <header className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            marginBottom: '24px',
            position: 'sticky',
            top: '16px',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{
                        fontSize: '1.25rem',
                        fontWeight: '900',
                        color: 'var(--primary)',
                        margin: 0,
                        letterSpacing: '-0.5px'
                    }}>StudyMate AI</h1>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                        {grade && (
                            <span className="badge" style={{ fontSize: '0.7rem', padding: '2px 8px', backgroundColor: 'var(--bg-card-solid)' }}>
                                {grade}
                            </span>
                        )}
                        {isPremium && (
                            <span className="badge" style={{ fontSize: '0.7rem', padding: '2px 8px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Crown size={12} fill="currentColor" /> Premium
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {onLogout && (
                    <button onClick={onLogout} style={{ color: 'var(--text-muted)' }}>
                        <LogOut size={20} />
                    </button>
                )}
                <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    border: '2px solid white',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {avatarInitial}
                </div>
            </div>
        </header>
    );
};

export default Header;
