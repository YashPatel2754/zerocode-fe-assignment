/** @type {import('tailwindcss').Config} */
module.exports = {
  dark: 'class', // 👈 this enables manual dark/light mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 👈 tell Tailwind to scan all JSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};