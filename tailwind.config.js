/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.html",
    "./public/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#460101',
        card: '#0a0a0a',
        border: 'rgba(255, 255, 255, 0.06)',
      }
    },
  },
  plugins: [],
}
