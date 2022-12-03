/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './views/**/*.handlebars',
    './src/js/*.js'
  ],
  theme: {
    extend: {
        minHeight: {
            '12': '3rem'
        }
    },
  },
  plugins: []
};