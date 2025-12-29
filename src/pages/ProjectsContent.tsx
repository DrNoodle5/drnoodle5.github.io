import React from 'react';

export const ProjectsContent: React.FC = () => {
    const projects = [
        {
            name: "Anomaly-detection in Prediction Markets",
            date: "Jul 2025 – Present",
            status: "Ongoing",
            bullets: [
                "Developed robust Python ETL pipeline to process transactions into structured CSVs.",
                "Engineered features profiling trader behavior (ROI, timing, win/loss).",
                "Evaluating unsupervised ML models (Logistic Regression, LOF) to identify anomalous profitable patterns."
            ],
            tech: ["Python", "ETL", "Machine Learning", "Logistic Regression", "LOF"]
        },
        {
            name: "Researching HRL in Atari Gymnasium",
            date: "Jul 2025 – Nov 2026",
            status: "Research",
            bullets: [
                "Conducted comprehensive literature review and formulated research questions.",
                "Engineered custom reward wrapper for Montezuma's Revenge RL environment.",
                "Executed rigorous performance evaluation using 'rliable' library for statistical benchmarking."
            ],
            tech: ["Reinforcement Learning", "Atari", "Research", "Statistics"]
        },
        {
            name: "Multivariate Analysis of Market Regimes",
            date: "Feb 2025 – June 2025",
            status: "Completed",
            bullets: [
                "Processed high-frequency 2-min financial data for 480 S&P 500 constituents.",
                "Implemented dynamic analysis with rolling window PCA and K-Means clustering.",
                "Identified distinct 'risk-on' and 'risk-off' market regimes."
            ],
            tech: ["PCA", "K-Means", "Financial Data", "Time Series"]
        }
    ];

    return (
        <div>
            {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: '24px', borderLeft: '2px solid var(--border-subtle)', paddingLeft: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', background: p.status === 'Ongoing' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}></div>

                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '2px' }}>{p.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
                        {p.date} | <span style={{ color: p.status === 'Ongoing' ? 'var(--accent-primary)' : 'var(--accent-tertiary)' }}>{p.status}</span>
                    </div>

                    <ul style={{ paddingLeft: '16px', marginBottom: '12px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {p.bullets.map((b, j) => (
                            <li key={j} style={{ marginBottom: '4px' }}>{b}</li>
                        ))}
                    </ul>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {p.tech.map(t => (
                            <span key={t} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '2px 6px',
                                borderRadius: '2px',
                                fontSize: '0.7rem',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)'
                            }}>
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
