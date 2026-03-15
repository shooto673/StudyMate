import React from 'react';

const ProgressRing = ({ progress = 0, size = 100, strokeWidth = 8, color = "var(--primary)" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const safeProgress = Math.min(Math.max(progress, 0), 100);
    const offset = circumference - (safeProgress / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    stroke="var(--bg-subtle)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div style={{ position: 'absolute', fontWeight: '900', fontSize: `${size * 0.22}px`, color: 'var(--text-main)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>{safeProgress}%</span>
            </div>
        </div>
    );
};

export default ProgressRing;
