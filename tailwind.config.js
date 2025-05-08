/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8DC63F',   // Green from logo
        accent: '#E53935',    // Red from logo
        yellow: '#FFB300',    // Yellow/Orange from logo
        white: '#FFFFFF',
        secondary: {
          50: '#f5f0ff',
          100: '#ede0ff',
          200: '#d9c1ff',
          300: '#c192ff',
          400: '#a25aff',
          500: '#8a2be2',
          600: '#6A0DAD', // brand primary
          700: '#5b07a0',
          800: '#4a0984',
          900: '#3d0a6c',
        },
        green: {
          500: '#228B22', // accent green
          600: '#1d7a1d',
        },
        brown: {
          500: '#8B4513', // earthy brown
          600: '#7a3c10',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};