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
        primary: {
          50: '#EFF6FF',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
        info: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
          800: '#1E3A8A',
        },
      },
    },
  },
  plugins: [],
};
export default config;
