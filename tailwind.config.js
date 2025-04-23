/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8F53F0',
          dark: '#7B3FDC'
        },
        sand: '#F5F3ED',
        day: '#FFFFFF',
        night: '#373737'
      },
      fontFamily: {
        'display': ['"Avolta Display"', 'sans-serif'],
        'sans': ['"Saans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h1': ['2.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h2': ['2rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }]
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600'
      }
    },
  },
  plugins: [],
}