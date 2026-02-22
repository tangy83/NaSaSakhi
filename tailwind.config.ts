import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NaariSamata Brand - Coral/Terracotta Primary Palette
        primary: {
          50: '#FDF5F4',   // Lightest backgrounds
          100: '#FBEAE9',  // Hover states
          200: '#F7D4D2',  // Borders
          300: '#F0ACA8',  // Disabled states
          400: '#E6837D',  // Muted accents
          500: '#CD5753',  // Main brand color
          600: '#B54945',  // Hover states, text (AA compliant)
          700: '#953B38',  // Active/pressed states
          800: '#6E2C2A',  // Dark text
          900: '#4A1D1B',  // Darkest shade
        },
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        error: {
          50: '#FEF2F2',
          500: '#DC2626',
          600: '#B91C1C',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        // Teal info colors for warmth (instead of blue)
        info: {
          50: '#F0FDFA',
          500: '#14B8A6',
          600: '#0D9488',
          800: '#115E59',
        },
        // Warmer gray palette
        gray: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      fontFamily: {
        // ── Latin fonts (loaded globally via next/font/google CSS variables) ──
        // Elegant serif for headings and branded elements
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        // Clean sans-serif for body text, forms
        body: ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        // Modern sans-serif for UI elements
        ui: ['var(--font-ui)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        // Technical sans-serif for supporting elements
        technical: ['var(--font-technical)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],

        // ── Indian script fonts (loaded on demand in translation review UI) ──
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        bengali:    ['Noto Sans Bengali',    'sans-serif'],
        tamil:      ['Noto Sans Tamil',      'sans-serif'],
        telugu:     ['Noto Sans Telugu',     'sans-serif'],
        kannada:    ['Noto Sans Kannada',    'sans-serif'],
        malayalam:  ['Noto Sans Malayalam',  'sans-serif'],
        gujarati:   ['Noto Sans Gujarati',   'sans-serif'],
        gurmukhi:   ['Noto Sans Gurmukhi',   'sans-serif'],
        oriya:      ['Noto Sans Oriya',      'sans-serif'],
        nastaliq:   ['Noto Nastaliq Urdu',   'serif'],
        olchiki:    ['Noto Sans Ol Chiki',   'sans-serif'],
        meitei:     ['Noto Sans Meitei Mayek','sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
