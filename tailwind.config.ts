import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        talenta: {
          black: '#1F1B17',
          'brown-dark': '#5B4631',
          'brown-mid': '#A67C52',
          tan: '#DBC6B2',
          cream: '#F2ECE6',
          white: '#FDFAF7',
          gold: '#C4943A',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        decorative: ['Caveat', 'cursive'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config
