/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#1846be",
      },
      width: {
        'custom': 'calc(80% + 50px)',
        'customm': 'calc(85% + 50px)',
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
