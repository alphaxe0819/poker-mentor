/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          card: 'var(--surface-card)',
          elevated: 'var(--surface-elevated)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          muted: 'var(--primary-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        danger: 'var(--danger)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        felt: 'var(--felt)',
      },
    },
  },
  plugins: [],
}

