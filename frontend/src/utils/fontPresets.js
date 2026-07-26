// === src/utils/fontPresets.js ===
// Each preset pairs a display font (headings) with a body font (paragraphs,
// UI text). All are loaded up front in global.css so switching is instant.

export const FONT_PRESETS = [
  {
    id: 'modern',
    label: 'Modern',
    sample: 'Sora + Inter',
    display: "'Sora', 'Segoe UI', sans-serif",
    body: "'Inter', 'Segoe UI', sans-serif"
  },
  {
    id: 'classic',
    label: 'Classic',
    sample: 'Poppins + Roboto',
    display: "'Poppins', 'Segoe UI', sans-serif",
    body: "'Roboto', 'Segoe UI', sans-serif"
  },
  {
    id: 'elegant',
    label: 'Elegant',
    sample: 'Playfair Display + Source Sans 3',
    display: "'Playfair Display', Georgia, serif",
    body: "'Source Sans 3', 'Segoe UI', sans-serif"
  },
  {
    id: 'technical',
    label: 'Technical',
    sample: 'Space Grotesk + IBM Plex Sans',
    display: "'Space Grotesk', 'Segoe UI', sans-serif",
    body: "'IBM Plex Sans', 'Segoe UI', sans-serif"
  }
];

export const FONT_SIZE_OPTIONS = [
  { id: 15, label: 'Small' },
  { id: 16, label: 'Medium' },
  { id: 18, label: 'Large' }
];

export function getFontPreset(id) {
  return FONT_PRESETS.find((p) => p.id === id) || FONT_PRESETS[0];
}

// Applies a preset + base size to the document by setting CSS variables on
// <html>. Called on the public site after content loads, and live in the
// admin preview.
export function applyAppearance({ fontPreset, baseFontSize } = {}) {
  const preset = getFontPreset(fontPreset);
  const root = document.documentElement;
  root.style.setProperty('--font-display', preset.display);
  root.style.setProperty('--font-body', preset.body);
  root.style.fontSize = `${baseFontSize || 16}px`;
}
