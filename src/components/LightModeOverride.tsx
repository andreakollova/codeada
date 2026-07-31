'use client';

import { useEffect } from 'react';

const DARK_BG_COLORS = new Set([
  '#000', '#000000', '#030303', '#050505', '#060606', '#0a0a0a', '#0A0A0A',
  '#0f0f0f', '#0F0F0F', '#111', '#111111', '#141414', '#161616',
  '#1a1a1a', '#1A1A1A', '#1c1c1c', '#1C1C1C', '#222', '#222222',
  '#333', '#333333', '#2a2a2a',
]);

const LIGHT_TEXT_COLORS: Record<string, string> = {
  '#fff': '#1A1A1A', '#ffffff': '#1A1A1A', '#FFF': '#1A1A1A', '#FFFFFF': '#1A1A1A',
  '#ededed': '#1A1A1A', '#EDEDED': '#1A1A1A',
  '#eee': '#222', '#eeeeee': '#222',
  '#ddd': '#333', '#dddddd': '#333',
  '#ccc': '#444', '#cccccc': '#444',
  '#bbb': '#555', '#bbbbbb': '#555',
  '#aaa': '#555', '#aaaaaa': '#555',
  '#999': '#666', '#999999': '#666',
  '#888': '#666', '#888888': '#666',
  '#777': '#777', '#777777': '#777',
};

const BG_REPLACEMENTS: Record<string, string> = {
  '#000': '#F5F5F7', '#000000': '#F5F5F7',
  '#030303': '#F5F5F7', '#050505': '#F5F5F7', '#060606': '#F5F5F7',
  '#0a0a0a': '#FFFFFF', '#0A0A0A': '#FFFFFF',
  '#0f0f0f': '#FFFFFF', '#0F0F0F': '#FFFFFF',
  '#111': '#FFFFFF', '#111111': '#FFFFFF',
  '#141414': '#F5F5F7', '#161616': '#F0F0F2',
  '#1a1a1a': '#F0F0F2', '#1A1A1A': '#F0F0F2',
  '#1c1c1c': '#E8E8EC', '#1C1C1C': '#E8E8EC',
  '#222': '#E8E8EC', '#222222': '#E8E8EC',
  '#333': '#E0E0E4', '#333333': '#E0E0E4',
  '#2a2a2a': '#E8E8EC',
};

function rgbToHex(rgb: string): string | null {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return null;
  const [, r, g, b] = match.map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function isVeryDark(hex: string): boolean {
  const c = hex.replace('#', '');
  const val = c.length === 3
    ? parseInt(c[0]+c[0]+c[1]+c[1]+c[2]+c[2], 16)
    : parseInt(c, 16);
  const r = (val >> 16) & 255;
  const g = (val >> 8) & 255;
  const b = val & 255;
  return (r + g + b) / 3 < 50;
}

function overrideElement(el: HTMLElement) {
  const style = el.style;
  const computed = window.getComputedStyle(el);

  // Skip code blocks and arena
  if (el.classList.contains('code-block') || el.classList.contains('code-input')) return;
  if (el.closest('[style*="position: fixed"][style*="background: #030303"]')) return;

  // Background
  const bg = style.background || style.backgroundColor;
  if (bg) {
    // Handle hex colors
    for (const [dark, light] of Object.entries(BG_REPLACEMENTS)) {
      if (bg.includes(dark)) {
        if (style.background) style.background = bg.replace(dark, light);
        if (style.backgroundColor) style.backgroundColor = (style.backgroundColor as string).replace(dark, light);
        break;
      }
    }
    // Handle rgba dark overlays
    if (bg.includes('rgba(0, 0, 0') || bg.includes('rgba(0,0,0')) {
      const opacity = parseFloat(bg.match(/rgba\(0,?\s*0,?\s*0,?\s*([\d.]+)\)/)?.[1] || '0');
      if (opacity > 0.7) {
        style.background = bg.replace(/rgba\(0,?\s*0,?\s*0,?\s*[\d.]+\)/, `rgba(245,245,247,${Math.min(0.98, opacity)})`);
      }
    }
  }

  // Computed background check (catches React-set styles)
  const computedBg = computed.backgroundColor;
  if (computedBg && computedBg !== 'rgba(0, 0, 0, 0)' && computedBg !== 'transparent') {
    const hex = rgbToHex(computedBg);
    if (hex && isVeryDark(hex)) {
      const replacement = BG_REPLACEMENTS[hex] || BG_REPLACEMENTS[hex.toLowerCase()];
      if (replacement) {
        el.style.backgroundColor = replacement;
      }
    }
  }

  // Text color
  const color = style.color;
  if (color) {
    const replacement = LIGHT_TEXT_COLORS[color] || LIGHT_TEXT_COLORS[color.toLowerCase()];
    if (replacement) {
      style.color = replacement;
    }
  }

  // Computed text color
  const computedColor = computed.color;
  if (computedColor) {
    const hex = rgbToHex(computedColor);
    if (hex) {
      const replacement = LIGHT_TEXT_COLORS[hex] || LIGHT_TEXT_COLORS[hex.toLowerCase()];
      if (replacement) el.style.color = replacement;
    }
  }

  // Border
  const border = style.border || style.borderColor;
  if (border) {
    for (const dark of ['#1a1a1a', '#111', '#222', '#333', '#0f0f0f']) {
      if (border.includes(dark)) {
        if (style.border) style.border = (style.border as string).replace(dark, '#D8D8DC');
        if (style.borderColor) style.borderColor = '#D8D8DC';
        if (style.borderBottom) style.borderBottom = (style.borderBottom as string).replace(dark, '#D8D8DC');
        if (style.borderTop) style.borderTop = (style.borderTop as string).replace(dark, '#D8D8DC');
        break;
      }
    }
    // rgba white borders
    if (border.includes('rgba(255')) {
      style.borderColor = '#D8D8DC';
    }
  }

  // SVG fill
  if (el.tagName === 'circle' || el.tagName === 'rect' || el.tagName === 'ellipse') {
    const fill = el.getAttribute('fill');
    if (fill && (fill === '#1a1a1a' || fill === '#0F0F0F' || fill === '#111' || fill === '#0a0a0a')) {
      el.setAttribute('fill', '#E0E0E4');
    }
  }
}

function runOverrides() {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme !== 'light') return;

  const all = document.querySelectorAll<HTMLElement>('*');
  all.forEach(overrideElement);
}

export default function LightModeOverride() {
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme !== 'light') return;

    // Run immediately + after renders
    runOverrides();
    const t1 = setTimeout(runOverrides, 100);
    const t2 = setTimeout(runOverrides, 500);
    const t3 = setTimeout(runOverrides, 1500);

    // Watch for DOM changes
    const observer = new MutationObserver(() => {
      requestAnimationFrame(runOverrides);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); observer.disconnect(); };
  }, []);

  return null;
}
