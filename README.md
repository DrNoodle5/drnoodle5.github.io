# Dominicus Johan Nararya (`drnoodle5.github.io`)

Personal academic and research website for **Dominicus Johan Nararya**

---

## Key Features

1. **Editorial & Tactical Aesthetics**:
   - Cohesive typographic stack combining Formal, Tech, Art, and Military design sensibilities (Space Grotesk & Space Mono).
   - Framed woodcut/engraving icons with smooth cubic-bezier hover expansion.
   - Dual theme support: Warm Archival Parchment & Ink (Light) ↔ Deep Carbon & Luminous Crimson (Dark).
   - Academic article formatting with LaTeX math equations, code blocks, metadata key-value tables, and clickable jump footnotes (`[1]`).

2. **Complex Adaptive System (CAS) - ASCII Art Fish School**:
   - Real-time decentralized agent simulation executing Craig Reynolds' canonical **Boids** flocking model (Separation, Alignment, Cohesion).
   - Constructed entirely from animated, articulated ASCII fish morphology (`><(((°>`, `~<((((><`, `•><((~`) with dynamic velocity-dependent tail oscillation.
   - **Predator / Cursor Evasion**: Fish detect mouse cursor proximity, execute emergency escape vectors, emit wake particles (`·`, `°`, `o`), and trigger emergent acoustic alarm waves across the school.
   - Click ripples generate radial fluid displacement waves.
   - Dedicated **[Simulation Lab](/simulations/)** and collapsible HUD for real-time parameter tuning.

3. **Cohesive Typographic Architecture**:
   - Built with **Space Grotesk** and **Space Mono**, synthesizing Formal, Tech, Art, and Military aesthetics into a singular, unified design identity across all headings, body copy, navigation, data tables, and telemetry readouts.
   - Clean, static navigation labels with smooth interactive hover feedback.

4. **Zero-Bloat GitHub Pages Architecture**:
   - 100% semantic HTML5, Vanilla CSS3, and ES6+ JavaScript.
   - Instant loading, zero build-step overhead, and direct compatibility with GitHub Pages.

---

## Directory Structure

```
/drnoodle5.github.io/
├── index.html                 # Home landing page with Borretti box & static media nav
├── about/
│   └── index.html             # Biography, research interests & education
├── projects/
│   └── index.html             # Portfolio (Prediction Markets, Market Regimes, DST NZ)
├── writing/
│   ├── index.html             # Writing & monographs index
│   └── emergent-systems.html  # Essay on Boids and Collective Intelligence
├── cv/
│   └── index.html             # Curriculum Vitae viewer
├── simulations/
│   └── index.html             # Dedicated CAS Fish Schooling Interactive Lab
├── assets/
│   ├── css/
│   │   └── main.css           # Core typography, design tokens, light/dark themes
│   ├── js/
│   │   ├── ascii-fish-cas.js  # ASCII Boids CAS simulation engine
│   │   ├── scramble-text.js   # Alphanumeric scrambling & hover decrypt engine
│   │   └── site.js            # Theme toggle, HUD controls & site utilities
│   └── icons/                 # Curated artwork & painting miniature icons
│       ├── about_me.jpeg
│       ├── portfolio_work.jpeg
│       ├── writings_notes.jpeg
│       ├── simulations.jpeg
│       └── cv.jpeg
├── Johan_Nararya_CV.pdf       # User Curriculum Vitae PDF
└── README.md
```

---

## Adding Content & Customization

- **Updating Profile & Projects**: Edit the corresponding `index.html` file in `about/`, `projects/`, `writing/`, or `cv/`.
- **Publishing New Essays**: Duplicate `writing/emergent-systems.html`, update metadata and content, and link it from `writing/index.html`.
- **Adjusting Fish Behavior**: Tweak `CAS_CONFIG` in `assets/js/ascii-fish-cas.js` to customize default speed, school size, or fear radius.
- **Deploying**: Commit and push to the `main` branch on GitHub. GitHub Pages will serve the site immediately at `https://drnoodle5.github.io/`.

