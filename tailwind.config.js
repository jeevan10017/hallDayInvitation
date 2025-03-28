/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 1s ease-in',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px rgba(255,255,255,0.5)' },
          '100%': { textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.7)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};