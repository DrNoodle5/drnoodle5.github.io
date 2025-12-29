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
                I'm a Data Scientist, with a keen interest in Financial Markets, Game Theory and Strategy
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
