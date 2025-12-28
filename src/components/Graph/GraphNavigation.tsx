import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import styles from './GraphNavigation.module.css';

// Graph Data
const initialData = {
    nodes: [
        { id: 'start', name: 'DrNoodle5', val: 20, type: 'hub' },
        { id: 'intro', name: 'Introduction', val: 10, type: 'page' },
        { id: 'projects', name: 'Projects', val: 10, type: 'page' },
        { id: 'cv', name: 'CV / LinkedIn', val: 10, type: 'link' },
        { id: 'skill1', name: 'Engineering', val: 5, type: 'skill' },
        { id: 'skill2', name: 'Strategy', val: 5, type: 'skill' },
        { id: 'skill3', name: 'Resilience', val: 5, type: 'skill' },
    ],
    links: [
        { source: 'start', target: 'intro' },
        { source: 'start', target: 'projects' },
        { source: 'start', target: 'cv' },
        { source: 'intro', target: 'skill1' },
        { source: 'intro', target: 'skill2' },
        { source: 'intro', target: 'skill3' },
        { source: 'projects', target: 'skill1' },
        // more connections for "complex" look
        { source: 'skill1', target: 'skill2' },
        { source: 'skill2', target: 'skill3' },
    ]
};

// Types for our custom node objects
interface MyNode extends NodeObject {
    name: string;
    val: number;
    type: string;
}

interface GraphNavigationProps {
    onNodeClick: (nodeId: string) => void;
}

export const GraphNavigation: React.FC<GraphNavigationProps> = ({ onNodeClick }) => {
    const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
    const [dimensions, setDimensions] = useState({ w: window.innerWidth, h: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ w: window.innerWidth, h: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nodeColor = (node: MyNode) => {
        switch (node.type) {
            case 'hub': return 'var(--accent-primary)';
            case 'page': return '#ffffff';
            case 'link': return 'var(--accent-tertiary)';
            case 'skill': return 'var(--text-secondary)';
            default: return '#888';
        }
    };

    const handleNodeClick = (node: NodeObject) => {
        const n = node as MyNode;
        // Focus camera on node
        fgRef.current?.centerAt(n.x, n.y, 1000);
        fgRef.current?.zoom(4, 2000);

        // Trigger navigation
        if (n.id) {
            onNodeClick(n.id as string);
        }
    };

    return (
        <div className={styles.wrapper}>
            <ForceGraph2D
                ref={fgRef}
                width={dimensions.w}
                height={dimensions.h}
                graphData={initialData}
                backgroundColor="rgba(0,0,0,0)" // Transparent, so Layout bg shows
                nodeLabel="name"
                nodeColor={(n) => nodeColor(n as MyNode)}
                linkColor={() => 'var(--graph-link)'}
                onNodeClick={handleNodeClick}
                nodeRelSize={6}
                linkWidth={1}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                d3AlphaDecay={0.02} // Slower stabilization for "floating" feel
                d3VelocityDecay={0.3}
            />
        </div>
    );
};
