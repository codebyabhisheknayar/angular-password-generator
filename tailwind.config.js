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
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#87c042"
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#0A090E"
        },
      },
    ]
  },
}

