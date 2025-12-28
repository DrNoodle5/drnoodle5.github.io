import React, { useEffect, useRef } from 'react';
import styles from './RiskBackground.module.css';

// Cyclic Cellular Automaton logic
export const RiskBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Configuration
        const scale = 4; // Pixel size
        const numStates = 4; // Number of factions/colors
        // Faction colors: Void, Neutral, Friendly(Green), Hostile(Red)
        const colors = [
            '#0a0a0a', // Void
            '#1a1a1a', // Dark terrain
            '#00ff41', // Green (Friendly)
            '#ff3333'  // Red (Hostile)
        ];

        // Grid state
        let w = Math.ceil(width / scale);
        let h = Math.ceil(height / scale);
        let grid = new Uint8Array(w * h);
        let nextGrid = new Uint8Array(w * h);

        // Initialize Randomly
        for (let i = 0; i < grid.length; i++) {
            grid[i] = Math.floor(Math.random() * numStates);
        }

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            w = Math.ceil(width / scale);
            h = Math.ceil(height / scale);
            grid = new Uint8Array(w * h);
            nextGrid = new Uint8Array(w * h);
            for (let i = 0; i < grid.length; i++) {
                grid[i] = Math.floor(Math.random() * numStates);
            }
        };
        window.addEventListener('resize', resize);
        resize();

        const step = () => {
            // Cyclic Rule: If neighbor is (state + 1) % mod, then state becomes (state + 1)
            // Or similar "conquest" rule
            // Let's do simple cyclic: if any neighbor is (state + 1) % numStates, we change to it.
            // This creates spirals.
            // To look more like RISK (territory holding), maybe incorporate a "strength" or probability.
            // But Cyclic is visually stunning and looks like "complex adaptive system".

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = y * w + x;
                    const state = grid[idx];
                    const nextState = (state + 1) % numStates;

                    // Check neighbors (Moore neighborhood)
                    let converted = false;
                    // Randomize neighbor check order or probability to make it less distinct geometric patterns?
                    // Check 8 neighbors
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = (x + dx + w) % w;
                            const ny = (y + dy + h) % h;
                            if (grid[ny * w + nx] === nextState) {
                                converted = true;
                                break;
                            }
                        }
                        if (converted) break;
                    }

                    if (converted) {
                        nextGrid[idx] = nextState;
                    } else {
                        nextGrid[idx] = state;
                    }
                }
            }

            // Swap grids
            const temp = grid;
            grid = nextGrid;
            nextGrid = temp;

            // Draw
            // Optimization: use ImageData if too slow, but fillRect is okay for small grid
            // For large screen, scale=4 means 1920/4 = 480 px wide. 480*270 = 130k rects. Too slow for fillRect every frame?
            // Use ImageData.
            const imgData = ctx.createImageData(width, height);
            const data = imgData.data;

            // We need to map grid[x,y] to pixels
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const gy = Math.floor(y / scale);
                    const gx = Math.floor(x / scale);
                    if (gx >= w || gy >= h) continue;

                    const state = grid[gy * w + gx];
                    const colorHex = colors[state];
                    // Parse hex to rgb
                    const r = parseInt(colorHex.slice(1, 3), 16);
                    const g = parseInt(colorHex.slice(3, 5), 16);
                    const b = parseInt(colorHex.slice(5, 7), 16);

                    const pIdx = (y * width + x) * 4;
                    data[pIdx] = r;
                    data[pIdx + 1] = g;
                    data[pIdx + 2] = b;
                    data[pIdx + 3] = 50; // Alpha 50/255 -> ~0.2 opacity (SUBTLE BACKGROUND)
                }
            }
            ctx.putImageData(imgData, 0, 0);

            animationFrameId = requestAnimationFrame(step);
        };

        step();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
};
