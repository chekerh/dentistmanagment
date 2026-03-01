/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2b7cee',
        'primary-hover': '#1a6bd3',
        'primary-light': '#eef6ff',
        'background-light': '#f6f7f8',
        'background-dark': '#101822',
        'surface-dark': '#192433',
        'border-dark': '#233348',
        'text-secondary': '#92a9c9',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
