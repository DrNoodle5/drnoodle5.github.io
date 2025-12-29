import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { GraphNavigation } from './components/Graph/GraphNavigation';
import { ContentOverlay } from './components/UI/ContentOverlay';
import { IntroContent } from './pages/IntroContent';
import { ProjectsContent } from './pages/ProjectsContent';

function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    if (nodeId === 'intro' || nodeId === 'projects' || nodeId === 'cv') {
      setActiveSection(nodeId);
    } else if (nodeId === 'start') {
      setActiveSection(null);
    }
  };

  const closeOverlay = () => {
    setActiveSection(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'intro': return <IntroContent />;
      case 'projects': return <ProjectsContent />;
      case 'cv': return (
        <div>
          <p>Click below to view my full personnel file.</p>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '16px',
              padding: '8px 16px',
              border: '1px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              textDecoration: 'none',
              zIndex: 101,
              position: 'relative'
            }}
          >
            Open Transmission (PDF)
          </a>
        </div>
      );
      default: return null;
    }
  };

  const getTitle = () => {
    switch (activeSection) {
      case 'intro': return 'Introduction';
      case 'projects': return 'Mission Logs';
      case 'cv': return 'Personnel File';
      default: return '';
    }
  };

  return (
    <Layout>
      <GraphNavigation onNodeClick={handleNodeClick} />

      {/* HUD / Label */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 5,
        opacity: activeSection ? 0 : 1, // Hide when overlay is open to reduce clutter
        transition: 'opacity 0.3s'
      }}>
        <h1 style={{ color: 'var(--accent-primary)', textShadow: '0 0 10px var(--accent-primary)', fontSize: '1.5rem' }}>
          DrNoodle5
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Interactive Graph System</p>
      </div>

      {/* Content Overlay */}
      <ContentOverlay
        isOpen={!!activeSection}
        onClose={closeOverlay}
        title={getTitle()}
      >
        {renderContent()}
      </ContentOverlay>
    </Layout>
  )
}

export default App
