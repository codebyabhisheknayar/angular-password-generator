/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    darkMode: 'class',
    extend: {

      fontFamily: {
        'mono': ['"JetBrains Mono"'],
      },
      colors: {
        primary: '#A3FFAA'
      }
    },

  },
  plugins: [],
}

