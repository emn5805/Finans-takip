/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#6C5DD3',
          secondary: '#8C7CF0',
          accent: '#F1595C',
        },
      },
    },
  },
  plugins: [],
};
