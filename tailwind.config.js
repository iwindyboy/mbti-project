/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rose-gold': '#C9956C',
        'cream': '#FAF7F2',
        'lavender-light': '#F3F0FF',
        'lavender-dark': '#E8E0FF',
        'mint-light': '#F0FFF9',
        'mint-dark': '#D4F5E8',
        'cream-light': '#FFFBF0',
        'cream-dark': '#FFF5E0',
      },
      fontFamily: {
        'serif-kr': ['Noto Serif KR', 'serif'],
      },
    },
  },
  plugins: [],
}
