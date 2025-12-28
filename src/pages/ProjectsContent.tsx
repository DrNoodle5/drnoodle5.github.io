import React from 'react';

export const ProjectsContent: React.FC = () => {
    const projects = [
        {
            name: "Obsidian Graph",
            status: "Live",
            desc: "Interactive visualization of personal knowledge base.",
            tech: ["React", "D3.js", "TypeScript"]
        },
        {
            name: "Tactical Dashboard",
            status: "Prototype",
            desc: "Real-time data aggregation for field operations.",
            tech: ["Next.js", "WebSockets"]
        },
        {
            name: "Operation: Noodle",
            status: "Classified",
            desc: "Top secret culinary automation system.",
            tech: ["Python", "IoT"]
        }
    ];

    return (
        <div>
            {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: '24px', borderLeft: '2px solid var(--border-subtle)', paddingLeft: '12px' }}>
                    <h3 style={{ color: 'var(--text-accent)', fontSize: '1rem' }}>{p.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        STATUS: <span style={{ color: p.status === 'Live' ? 'var(--accent-primary)' : 'var(--accent-tertiary)' }}>{p.status}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{p.desc}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {p.tech.map(t => (
                            <span key={t} style={{
                                background: 'var(--bg-secondary)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                border: '1px solid var(--border-subtle)'
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
