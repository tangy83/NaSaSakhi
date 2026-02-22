// Dynamic font loader for Indian script fonts
// Used by the translation review UI to load the correct font for each language

// Track which fonts have already been injected to avoid duplicates
const loadedFonts = new Set<string>();

/**
 * Dynamically injects a Google Font <link> into the document <head>
 * for the given googleFontName (e.g. "Noto+Sans+Devanagari").
 *
 * Safe to call multiple times for the same font — deduplicates automatically.
 * No-op on the server (window is not defined).
 */
export function loadGoogleFont(googleFontName: string): void {
  if (typeof window === 'undefined') return;
  if (loadedFonts.has(googleFontName)) return;

  const href = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;500;700&display=swap`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);

  loadedFonts.add(googleFontName);
}

/**
 * Returns the CSS font-family string to use for inline styles
 * when rendering translated text in the review UI.
 *
 * Triggers dynamic font loading as a side effect.
 */
export function getTranslationFont(fontFamily: string, googleFontName: string): string {
  loadGoogleFont(googleFontName);
  return `${fontFamily}, sans-serif`;
}
