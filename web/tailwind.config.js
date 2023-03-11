/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        "fr-auto": "1fr auto",
        "auto-fr": "auto 1fr",
      },
      gridTemplateRows: {
        "fr-auto": "1fr auto",
        "auto-fr": "auto 1fr",
      },
    },
  },
  plugins: [],
};
