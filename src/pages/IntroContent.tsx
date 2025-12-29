import React from 'react';

export const IntroContent: React.FC = () => {
    return (
        <div>
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>Dominicus Johan Nararya</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Data Scientist | Financial Markets | Strategy<br />
                <span style={{ fontSize: '0.8rem' }}>M: 022 357 1401 | E: jojonararya@gmail.com</span>
            </p>

            <hr style={{ borderColor: 'var(--border-subtle)', margin: '16px 0' }} />

            <section style={{ marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--text-accent)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>Education</h4>
                <div style={{ marginBottom: '12px' }}>
                    <strong>Master of Science (Data Science)</strong><br />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The University of Auckland</span>
                    <p style={{ fontSize: '0.8rem', margin: '4px 0', opacity: 0.8 }}>
                        Applied Multivariate Analysis, Advanced Regression, Machine Learning, Econometrics, Algorithms, Big Data.
                    </p>
                </div>
                <div>
                    <strong>Bachelor of Science (Data Science)</strong><br />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The University of Auckland</span>
                    <p style={{ fontSize: '0.8rem', margin: '4px 0', opacity: 0.8 }}>
                        Statistical Computing/Modelling/Learning, AI, Optimization, Data Structures.
                    </p>
                </div>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--text-accent)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>Technical Arsenal</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Python', 'R', 'SQL', 'SAS', 'Pandas', 'Numpy', 'Polars', 'Sci-kit Learn'].map(skill => (
                        <span key={skill} style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-subtle)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                        }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h4 style={{ color: 'var(--accent-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>Service Record</h4>
                <div>
                    <strong>Reservist (NZDF)</strong> <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>| Nov 2021 – Present</span>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        Trained in weapon systems operations. Expert in maintaining focus and performance in dynamic, high-pressure environments.
                    </p>
                </div>
            </section>

            <p style={{ color: 'var(--accent-tertiary)', marginTop: '24px', fontSize: '0.9rem' }}>
                &gt; Awaiting orders. Open "Projects" for mission logs.
            </p>
        </div>
    );
};
