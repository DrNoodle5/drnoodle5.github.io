/**
 * ASCII Fish Schooling Simulation - Complex Adaptive System (CAS)
 * Demonstrating Emergent Collective Behavior & Reynolds Flocking (Boids)
 * Written for DrNoodle5 (Dominicus Johan Nararya)
 */

(function () {
  'use strict';

  // --- CAS Configuration & Parameters ---
  const CAS_CONFIG = {
    fishCount: 65,
    minSpeed: 1.5,
    maxSpeed: 4.2,
    panicSpeed: 8.5,
    maxForce: 0.18,
    
    // Reynolds Flocking Weights
    separationDist: 42,
    neighborDist: 110,
    separationWeight: 1.8,
    alignmentWeight: 1.2,
    cohesionWeight: 1.0,
    wanderWeight: 0.25,

    // Cursor / Predator Evasion
    cursorFearRadius: 180,
    cursorFearForce: 3.5,
    
    // Bounds Margin
    margin: 80,
    turnForce: 0.45,

    // Visuals
    fontSize: 13,
    fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace'
  };

  // ASCII Fish Models with oscillating tail frames
  const FISH_SPECIES = [
    {
      name: 'Minnow',
      head: '°>',
      body: '<(((',
      tailFrames: ['~', '>', '»', ')', '}'],
      length: 7,
      scale: 1.0
    },
    {
      name: 'Tetra',
      head: '•>',
      body: '<((',
      tailFrames: ['>', '»', '>', '-'],
      length: 5,
      scale: 0.9
    },
    {
      name: 'Cichlid',
      head: 'º>',
      body: '<((((',
      tailFrames: ['~', '»', '>', ')'],
      length: 8,
      scale: 1.15
    },
    {
      name: 'Guppy',
      head: 'o>',
      body: '={',
      tailFrames: ['~', '»', '}', '>'],
      length: 5,
      scale: 0.85
    }
  ];

  // Helper Vector Math
  class Vector2D {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    set(x, y) { this.x = x; this.y = y; return this; }
    add(v) { this.x += v.x; this.y += v.y; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    mult(n) { this.x *= n; this.y *= n; return this; }
    div(n) { if (n !== 0) { this.x /= n; this.y /= n; } return this; }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    magSq() { return this.x * this.x + this.y * this.y; }
    heading() { return Math.atan2(this.y, this.x); }
    normalize() {
      const m = this.mag();
      if (m !== 0) this.div(m);
      return this;
    }
    limit(max) {
      if (this.magSq() > max * max) {
        this.normalize();
        this.mult(max);
      }
      return this;
    }
    dist(v) {
      const dx = this.x - v.x;
      const dy = this.y - v.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    distSq(v) {
      const dx = this.x - v.x;
      const dy = this.y - v.y;
      return dx * dx + dy * dy;
    }
    copy() { return new Vector2D(this.x, this.y); }
    static sub(v1, v2) { return new Vector2D(v1.x - v2.x, v1.y - v2.y); }
  }

  // Bubble / Wake Particle Class
  class Bubble {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 8;
      this.y = y + (Math.random() - 0.5) * 8;
      this.glyph = ['·', '°', 'o', '.', '*'][Math.floor(Math.random() * 5)];
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -0.4 - Math.random() * 0.6; // gentle upward float
      this.life = 1.0;
      this.decay = 0.015 + Math.random() * 0.02;
      this.size = 9 + Math.random() * 4;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.life * 0.35;
      ctx.font = `${this.size}px ${CAS_CONFIG.fontFamily}`;
      ctx.fillText(this.glyph, this.x, this.y);
      ctx.restore();
    }
  }

  // Ripple Wave Class (from mouse click)
  class Ripple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = 140;
      this.growth = 4.5;
      this.life = 1.0;
      this.decay = 0.022;
    }
    update() {
      this.radius += this.growth;
      this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--ripple-color') || 'rgba(158, 26, 43, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = this.life * 0.6;
      ctx.stroke();
      ctx.restore();
    }
  }

  // Individual Fish Agent in Complex Adaptive System
  class AsciiFish {
    constructor(x, y, isLead = false) {
      this.pos = new Vector2D(x, y);
      const angle = Math.random() * Math.PI * 2;
      const speed = CAS_CONFIG.minSpeed + Math.random() * 1.5;
      this.vel = new Vector2D(Math.cos(angle) * speed, Math.sin(angle) * speed);
      this.acc = new Vector2D(0, 0);
      
      this.species = FISH_SPECIES[Math.floor(Math.random() * FISH_SPECIES.length)];
      this.isLead = isLead;
      this.tailPhase = Math.random() * Math.PI * 2;
      this.tailSpeed = 0.18;
      
      this.panicLevel = 0; // [0, 1]
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.zDepth = 0.75 + Math.random() * 0.5; // for parallax and scale variation
    }

    applyForce(force) {
      this.acc.add(force);
    }

    // --- Core Flocking Algorithms (Reynolds CAS) ---
    flock(fishes) {
      let sep = new Vector2D();
      let ali = new Vector2D();
      let coh = new Vector2D();
      let sepCount = 0;
      let neighborCount = 0;

      const sepSq = CAS_CONFIG.separationDist * CAS_CONFIG.separationDist;
      const neighSq = CAS_CONFIG.neighborDist * CAS_CONFIG.neighborDist;

      for (let other of fishes) {
        if (other === this) continue;
        const dSq = this.pos.distSq(other.pos);

        // Separation (Short range repulsion)
        if (dSq > 0 && dSq < sepSq) {
          const diff = Vector2D.sub(this.pos, other.pos);
          diff.normalize();
          diff.div(Math.sqrt(dSq)); // Weight by inverse distance
          sep.add(diff);
          sepCount++;
        }

        // Alignment & Cohesion (Medium range attraction & heading match)
        if (dSq > 0 && dSq < neighSq) {
          ali.add(other.vel);
          coh.add(other.pos);
          neighborCount++;

          // Collective panic propagation: if neighbor is panicked, get alert
          if (other.panicLevel > 0.6 && this.panicLevel < 0.4) {
            this.panicLevel = Math.max(this.panicLevel, other.panicLevel * 0.85);
          }
        }
      }

      // Finalize Separation Force
      if (sepCount > 0) {
        sep.div(sepCount);
        if (sep.mag() > 0) {
          sep.normalize();
          sep.mult(CAS_CONFIG.maxSpeed);
          sep.sub(this.vel);
          sep.limit(CAS_CONFIG.maxForce * 1.5);
        }
      }

      // Finalize Alignment Force
      if (neighborCount > 0) {
        ali.div(neighborCount);
        ali.normalize();
        ali.mult(CAS_CONFIG.maxSpeed);
        ali.sub(this.vel);
        ali.limit(CAS_CONFIG.maxForce);

        // Finalize Cohesion Force
        coh.div(neighborCount);
        const desired = Vector2D.sub(coh, this.pos);
        desired.normalize();
        desired.mult(CAS_CONFIG.maxSpeed);
        const steer = Vector2D.sub(desired, this.vel);
        steer.limit(CAS_CONFIG.maxForce);
        coh = steer;
      }

      // Gentle Natural Underwater Wandering
      this.wanderAngle += (Math.random() - 0.5) * 0.3;
      const wander = new Vector2D(Math.cos(this.wanderAngle), Math.sin(this.wanderAngle));
      wander.mult(CAS_CONFIG.maxForce * 0.5);

      // Apply weights
      sep.mult(CAS_CONFIG.separationWeight);
      ali.mult(CAS_CONFIG.alignmentWeight);
      coh.mult(CAS_CONFIG.cohesionWeight);
      wander.mult(CAS_CONFIG.wanderWeight);

      this.applyForce(sep);
      this.applyForce(ali);
      this.applyForce(coh);
      this.applyForce(wander);
    }

    // --- Boundary Repulsion (Soft Margins) ---
    boundaries(width, height) {
      const margin = CAS_CONFIG.margin;
      const turn = CAS_CONFIG.turnForce;
      let steer = new Vector2D();

      if (this.pos.x < margin) steer.x = turn * ((margin - this.pos.x) / margin);
      if (this.pos.x > width - margin) steer.x = -turn * ((this.pos.x - (width - margin)) / margin);
      if (this.pos.y < margin) steer.y = turn * ((margin - this.pos.y) / margin);
      if (this.pos.y > height - margin) steer.y = -turn * ((this.pos.y - (height - margin)) / margin);

      this.applyForce(steer);
    }

    // --- Cursor / Predator Evasion ---
    avoidCursor(mousePos, isHovering) {
      if (!isHovering) return;
      const d = this.pos.dist(mousePos);
      if (d < CAS_CONFIG.cursorFearRadius && d > 0) {
        // Compute repulsive force inversely proportional to distance
        const repel = Vector2D.sub(this.pos, mousePos);
        const factor = (CAS_CONFIG.cursorFearRadius - d) / CAS_CONFIG.cursorFearRadius;
        repel.normalize();
        repel.mult(CAS_CONFIG.cursorFearForce * factor * factor);
        this.applyForce(repel);

        // Enter panic burst state
        this.panicLevel = 1.0;
      }
    }

    // --- Ripple Interaction ---
    reactToRipples(ripples) {
      for (let r of ripples) {
        const d = this.pos.dist(new Vector2D(r.x, r.y));
        const waveDist = Math.abs(d - r.radius);
        if (waveDist < 25 && d > 0) {
          const push = Vector2D.sub(this.pos, new Vector2D(r.x, r.y));
          push.normalize();
          push.mult(1.8 * r.life);
          this.applyForce(push);
          this.panicLevel = Math.max(this.panicLevel, 0.7 * r.life);
        }
      }
    }

    // --- Physics Update ---
    update(bubbles) {
      this.vel.add(this.acc);
      
      // Dynamic max speed based on panic/alarm level
      const currentMaxSpeed = CAS_CONFIG.minSpeed + (CAS_CONFIG.maxSpeed - CAS_CONFIG.minSpeed) * (1 - this.panicLevel) + CAS_CONFIG.panicSpeed * this.panicLevel;
      this.vel.limit(currentMaxSpeed);

      // Ensure minimum swim speed
      if (this.vel.mag() < CAS_CONFIG.minSpeed) {
        this.vel.normalize();
        this.vel.mult(CAS_CONFIG.minSpeed);
      }

      this.pos.add(this.vel);
      this.acc.set(0, 0);

      // Undulate tail based on speed
      const speed = this.vel.mag();
      this.tailPhase += (0.12 + speed * 0.04);

      // Decay panic state
      if (this.panicLevel > 0) {
        this.panicLevel -= 0.012;
        if (this.panicLevel < 0) this.panicLevel = 0;

        // Emit wake bubble when startled
        if (Math.random() < 0.25 * this.panicLevel) {
          bubbles.push(new Bubble(this.pos.x, this.pos.y));
        }
      }
    }

    // --- Render ASCII Art Fish ---
    draw(ctx) {
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);

      const angle = this.vel.heading();
      ctx.rotate(angle);

      // Tail oscillation frame
      const frameIdx = Math.floor(((Math.sin(this.tailPhase) + 1) / 2) * this.species.tailFrames.length) % this.species.tailFrames.length;
      const tailChar = this.species.tailFrames[frameIdx];

      // Assemble full directional ASCII string
      // e.g. Minnow: tail + body + head => "~<(((°>"
      const asciiArt = `${tailChar}${this.species.body}${this.species.head}`;

      const computedScale = this.species.scale * this.zDepth;
      ctx.scale(computedScale, computedScale);

      // Styling and colors
      ctx.font = `bold ${CAS_CONFIG.fontSize}px ${CAS_CONFIG.fontFamily}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right'; // Head at origin (pos.x, pos.y), body trails behind

      // Color selection (Lead fish has accent tint; others have ambient glyph color)
      if (this.isLead) {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--fish-lead-color') || 'rgba(158, 26, 43, 0.75)';
      } else {
        const baseColor = getComputedStyle(document.documentElement).getPropertyValue('--fish-glyph-color') || 'rgba(26, 25, 23, 0.32)';
        ctx.fillStyle = baseColor;
      }

      if (this.panicLevel > 0.4) {
        // High alert glow
        ctx.shadowColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color') || '#9e1a2b';
        ctx.shadowBlur = 4 * this.panicLevel;
      }

      ctx.fillText(asciiArt, 0, 0);

      ctx.restore();
    }
  }

  // --- Main CAS Simulation Engine ---
  class FishSimulation {
    constructor() {
      this.canvas = document.getElementById('cas-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      
      this.fishes = [];
      this.bubbles = [];
      this.ripples = [];
      
      this.mouse = new Vector2D(-1000, -1000);
      this.isMouseHovering = false;
      this.isRunning = true;
      this.dpr = window.devicePixelRatio || 1;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Global Mouse / Touch Tracking for Predator Avoidance
      window.addEventListener('mousemove', (e) => {
        this.mouse.set(e.clientX, e.clientY);
        this.isMouseHovering = true;
      });

      window.addEventListener('mouseleave', () => {
        this.isMouseHovering = false;
        this.mouse.set(-1000, -1000);
      });

      // Interactive Click Ripples
      window.addEventListener('click', (e) => {
        this.ripples.push(new Ripple(e.clientX, e.clientY));
      });

      // Touch support
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          this.mouse.set(e.touches[0].clientX, e.touches[0].clientY);
          this.isMouseHovering = true;
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        this.isMouseHovering = false;
      });

      // Spawn Initial School of Fish
      this.spawnFishes(CAS_CONFIG.fishCount);

      // Start Animation Loop
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.dpr = window.devicePixelRatio || 1;

      this.canvas.width = width * this.dpr;
      this.canvas.height = height * this.dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;

      this.ctx.scale(this.dpr, this.dpr);
      this.width = width;
      this.height = height;
    }

    spawnFishes(count) {
      this.fishes = [];
      const centerX = this.width / 2 || window.innerWidth / 2;
      const centerY = this.height / 2 || window.innerHeight / 2;

      for (let i = 0; i < count; i++) {
        const x = centerX + (Math.random() - 0.5) * 400;
        const y = centerY + (Math.random() - 0.5) * 300;
        const isLead = (i === 0 || i === Math.floor(count / 2));
        this.fishes.push(new AsciiFish(x, y, isLead));
      }
    }

    scatterAll() {
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      this.ripples.push(new Ripple(centerX, centerY));
      for (let fish of this.fishes) {
        fish.panicLevel = 1.0;
        const angle = Math.random() * Math.PI * 2;
        fish.vel.set(Math.cos(angle) * CAS_CONFIG.panicSpeed, Math.sin(angle) * CAS_CONFIG.panicSpeed);
      }
    }

    animate() {
      if (!this.isRunning) return;

      this.ctx.clearRect(0, 0, this.width, this.height);

      // Update & draw ripples
      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const r = this.ripples[i];
        r.update();
        r.draw(this.ctx);
        if (r.life <= 0) this.ripples.splice(i, 1);
      }

      // Update & draw bubbles
      for (let i = this.bubbles.length - 1; i >= 0; i--) {
        const b = this.bubbles[i];
        b.update();
        b.draw(this.ctx);
        if (b.life <= 0) this.bubbles.splice(i, 1);
      }

      // Update & draw fish school (CAS Flocking)
      for (let fish of this.fishes) {
        fish.flock(this.fishes);
        fish.boundaries(this.width, this.height);
        fish.avoidCursor(this.mouse, this.isMouseHovering);
        fish.reactToRipples(this.ripples);
        fish.update(this.bubbles);
        fish.draw(this.ctx);
      }

      requestAnimationFrame(this.animate);
    }
  }

  // Initialize on DOM Ready
  let simInstance = null;
  document.addEventListener('DOMContentLoaded', () => {
    simInstance = new FishSimulation();
    window.AsciiFishCAS = {
      instance: simInstance,
      config: CAS_CONFIG,
      scatter: () => simInstance && simInstance.scatterAll(),
      setCount: (n) => simInstance && simInstance.spawnFishes(n),
      setFearRadius: (r) => { CAS_CONFIG.cursorFearRadius = r; },
      setCohesion: (w) => { CAS_CONFIG.cohesionWeight = w; },
      setSeparation: (w) => { CAS_CONFIG.separationWeight = w; },
      setAlignment: (w) => { CAS_CONFIG.alignmentWeight = w; }
    };
  });

})();
