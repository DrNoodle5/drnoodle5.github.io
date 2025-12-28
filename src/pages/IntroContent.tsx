import React from 'react';

export const IntroContent: React.FC = () => {
    return (
        <div>
            <p>
                <strong>Status:</strong> Active<br />
                <strong>Role:</strong> Fullstack Engineer / Strategist<br />
                <strong>Location:</strong> Classified (New Zealand)
            </p>
            <hr style={{ borderColor: 'var(--border-subtle)', margin: '16px 0' }} />
            <p>
                I am a creative developer with a background in military strategy and complex systems.
                I build digital experiences that are not just functional but also resilient and adaptive.
            </p>
            <p>
                My work bridges the gap between chaos and order, using code to visualize the unseen connections in data.
            </p>
            <p style={{ color: 'var(--accent-tertiary)', marginTop: '16px' }}>
                &gt; Select "Projects" to view mission logs.
            </p>
        </div>
    );
};
