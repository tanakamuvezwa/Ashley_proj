/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6fdf5',
          100: '#c0f9e3',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          gold: '#F59E0B',
          'gold-light': '#FBBF24',
          'gold-dark': '#B45309',
          dark: '#0B0F17',
          surface: '#131B2E',
          border: '#1F2D4A'
        },
        slate: {
          950: 'var(--bg-main)',
          900: 'var(--bg-surface)',
          800: 'var(--bg-card)',
          500: 'var(--text-subtle)',
          400: 'var(--text-muted)',
          300: 'var(--text-muted)',
        },
        emerald: {
          400: 'var(--accent)',
          500: 'var(--accent)',
          600: 'var(--accent-hover)',
        },
        white: 'var(--text-primary)'
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.4))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.6))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
