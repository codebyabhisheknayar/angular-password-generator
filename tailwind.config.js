/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
    },
    darkMode: 'class',
  },
  plugins: [],
}

