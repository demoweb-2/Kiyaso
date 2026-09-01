/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF1F2',
          100: '#FFE0E3',
          200: '#FFC2C8',
          300: '#FF99A3',
          400: '#FF5E6C',
          500: '#E63946',
          600: '#C8102E',
          700: '#A50D24',
          800: '#820A1B',
          900: '#5E0712',
          950: '#3D050B',
        },
        charcoal: {
          50: '#F6F6F7',
          100: '#E2E2E4',
          200: '#C5C5C8',
          300: '#9E9EA3',
          400: '#74747A',
          500: '#525258',
          600: '#3D3D42',
          700: '#2A2A2E',
          800: '#1C1C1F',
          900: '#121214',
          950: '#0A0A0B',
        },
        accent: {
          green: '#16A34A',
          orange: '#EA580C',
          gold: '#D4A017',
          lime: '#84CC16',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Anton', 'system-ui', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      fontSize: {
        '10xl': ['8rem', { lineHeight: '1' }],
        '11xl': ['10rem', { lineHeight: '1' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        'card': '0 8px 32px -8px rgba(0, 0, 0, 0.12)',
        'premium': '0 20px 60px -12px rgba(200, 16, 46, 0.25)',
        'dark': '0 20px 60px -12px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(180deg, rgba(10,10,11,0.3) 0%, rgba(10,10,11,0.7) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #C8102E 0%, #E63946 100%)',
      },
    },
  },
  plugins: [],
};
