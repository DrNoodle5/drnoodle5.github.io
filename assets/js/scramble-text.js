/**
 * Scramble Typography Engine - Cyber-Editorial Decrypt & Continuous Mutation
 * Continuously scrambles alphanumeric characters until hovered, then cleanly decrypts.
 * Written for DrNoodle5 (Dominicus Johan Nararya)
 */

(function () {
  'use strict';

  const GLYPHS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  class ScrambleElement {
    constructor(el) {
      this.el = el;
      this.targetText = el.getAttribute('data-scramble') || el.textContent.trim();
      this.currentChars = [];
      this.isHovered = false;
      this.resolvedProgress = 0; // 0 = fully scrambled, targetText.length = locked
      this.timer = null;
      this.decryptTimer = null;
      
      // Accessibility: ensure screen readers read the target text
      this.el.setAttribute('aria-label', this.targetText);

      this.init();
    }

    init() {
      // Find hover triggers (the parent link or container)
      const trigger = this.el.closest('a') || this.el.closest('li') || this.el;

      trigger.addEventListener('mouseenter', () => this.onHover());
      trigger.addEventListener('mouseleave', () => this.onLeave());
      trigger.addEventListener('focus', () => this.onHover());
      trigger.addEventListener('blur', () => this.onLeave());

      // Start continuous background scramble
      this.startContinuousScramble();
    }

    getRandomGlyph(char) {
      if (char === ' ') return ' ';
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }

    startContinuousScramble() {
      if (this.timer) clearInterval(this.timer);
      this.el.classList.remove('is-locked');

      this.timer = setInterval(() => {
        if (this.isHovered) return;

        let scrambled = '';
        for (let i = 0; i < this.targetText.length; i++) {
          const originalChar = this.targetText[i];
          if (originalChar === ' ') {
            scrambled += ' ';
          } else {
            scrambled += this.getRandomGlyph(originalChar);
          }
        }
        this.el.textContent = scrambled;
      }, 55); // ~18 FPS pleasant scramble rate
    }

    onHover() {
      this.isHovered = true;
      if (this.timer) clearInterval(this.timer);

      // Decryption sequence: resolve characters from left to right
      let frame = 0;
      const totalChars = this.targetText.length;
      const speed = 2; // frames per resolved character

      if (this.decryptTimer) clearInterval(this.decryptTimer);

      this.decryptTimer = setInterval(() => {
        const resolvedCount = Math.floor(frame / speed);
        let output = '';

        for (let i = 0; i < totalChars; i++) {
          if (i < resolvedCount) {
            output += this.targetText[i];
          } else if (this.targetText[i] === ' ') {
            output += ' ';
          } else {
            output += this.getRandomGlyph(this.targetText[i]);
          }
        }

        this.el.textContent = output;
        frame++;

        if (resolvedCount >= totalChars) {
          clearInterval(this.decryptTimer);
          this.el.textContent = this.targetText;
          this.el.classList.add('is-locked');
        }
      }, 30);
    }

    onLeave() {
      this.isHovered = false;
      if (this.decryptTimer) clearInterval(this.decryptTimer);
      this.el.classList.remove('is-locked');

      // Brief pause before re-scrambling
      setTimeout(() => {
        if (!this.isHovered) {
          this.startContinuousScramble();
        }
      }, 180);
    }
  }

  // Initialize on all .scramble-label elements
  document.addEventListener('DOMContentLoaded', () => {
    const scrambleElements = document.querySelectorAll('.scramble-label');
    scrambleElements.forEach((el) => new ScrambleElement(el));
  });

})();
