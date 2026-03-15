import React from 'react';

const Mascot = ({ state = 'idle', size = 80 }) => {
    // Determine animation class based on state
    let animationClass = '';
    switch (state) {
        case 'idle':
            animationClass = 'animate-breathing';
            break;
        case 'thinking':
            animationClass = 'animate-nodding';
            break;
        case 'cheer':
            animationClass = 'animate-bounce';
            break;
        case 'error':
            animationClass = 'animate-shaking';
            break;
        default:
            animationClass = 'animate-breathing';
    }

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: state === 'thinking' ? '0 0 20px var(--primary-glow)' : 'var(--shadow-md)',
                border: '3px solid var(--bg-card-solid)',
                display: 'inline-block',
                transition: 'all 0.3s ease',
            }}
            className={animationClass}
        >
            <img
                src="/mascot.jpg"
                alt="StudyMate Mascot"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </div>
    );
};

export default Mascot;
