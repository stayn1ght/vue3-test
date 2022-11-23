const colors = require('windicss/colors')
const typography = require('windicss/plugin/typography')

module.exports = {
  extract: {
    include: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  },
  theme: {
    minHeight: {
      '100vh': '100vh',
    },
    fontFamily: {},
    extend: {
      fontFamily: {
        blimone: ['Blimone', 'Impact', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        teal: colors.teal,
      },
    },
  },
  darkMode: 'class',
  plugins: [typography],
}
