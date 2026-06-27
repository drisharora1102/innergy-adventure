/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        innergy: {
          mint: '#D8FFF7',
          teal: '#008C96',
          navy: '#073946',
          gold: '#D99A2B',
          green: '#71D99E',
          pink: '#F472B6',
          blue: '#38BDF8'
        }
      }
    }
  },
  plugins: []
};
