/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF6EA',
          100: '#F5EACB',
          200: '#EBD394',
          300: '#E0BB5E',
          400: '#D4A433',
          500: '#C8911B',
          600: '#A9760F',
          700: '#845B0C',
          800: '#5F410A',
          900: '#3E2B07',
        },
        ivory: {
          DEFAULT: '#F6F5F1',
          50: '#FCFCFA',
          100: '#F6F5F1',
          200: '#EFEDE7',
          300: '#E4E1D8',
        },
        ink: {
          DEFAULT: '#1C1A17',
          soft: '#2E2B27',
        },
        stone: {
          DEFAULT: '#6B665E',
          light: '#9A958C',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        brand: ['Cinzel', '"Cormorant Garamond"', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.18em',
        wide2: '0.12em',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(28, 26, 23, 0.18)',
        card: '0 2px 12px -4px rgba(28, 26, 23, 0.12)',
        gold: '0 12px 32px -10px rgba(200, 145, 27, 0.45)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp .6s cubic-bezier(.22,1,.36,1) both',
        fadeIn: 'fadeIn .4s ease both',
        slideInRight: 'slideInRight .35s cubic-bezier(.22,1,.36,1) both',
        shimmer: 'shimmer 1.6s linear infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
