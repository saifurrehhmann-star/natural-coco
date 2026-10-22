/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        palm: {
          50: '#effaf2',
          100: '#d8f3df',
          200: '#b3e6c2',
          300: '#80d29c',
          400: '#49b673',
          500: '#279a57',
          600: '#177c46',
          700: '#13633a',
          800: '#114f30',
          900: '#0e4128',
          950: '#062415',
        },
        cream: {
          50: '#fdfdf7',
          100: '#fbf6e9',
          200: '#f6ebcc',
          300: '#efdaa3',
          400: '#e7c271',
          500: '#dfaa4a',
          600: '#cf9336',
          700: '#ac722c',
          800: '#8a5a2a',
          900: '#714b28',
        },
        coral: {
          50: '#fff5f1',
          100: '#ffe6dc',
          200: '#ffc9b6',
          300: '#ffa282',
          400: '#ff7a52',
          500: '#fb5a30',
          600: '#ec3f17',
          700: '#c4300f',
          800: '#9b2914',
          900: '#7c2513',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 24px -10px rgba(14, 65, 40, 0.18)',
        soft: '0 2px 12px -4px rgba(14, 65, 40, 0.12)',
        lift: '0 18px 40px -16px rgba(14, 65, 40, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(6deg)' },
        },
        floatySlow: {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-26px) translateX(10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sheetUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        floatySlow: 'floatySlow 9s ease-in-out infinite',
        sheetUp: 'sheetUp 0.32s cubic-bezier(0.22,1,0.36,1)',
        fadeIn: 'fadeIn 0.3s ease-out',
        popIn: 'popIn 0.28s cubic-bezier(0.22,1,0.36,1)',
        slideDown: 'slideDown 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
