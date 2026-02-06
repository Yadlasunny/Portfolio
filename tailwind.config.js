/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        'xs': '375px', // Extra small devices (iPhone SE, etc.)
      },
    },
  },
  plugins: [],
};
