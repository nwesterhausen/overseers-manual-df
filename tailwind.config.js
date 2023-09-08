/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        dark: {
          ...require('daisyui/src/theming/themes')["[data-theme='dark']"],
          'base-100': '#002b36',
          'neutral': '#1c1c1c',
        }
      },
      'light',
    ],
  }
}

