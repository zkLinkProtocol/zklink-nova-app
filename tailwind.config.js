const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navBackground: "rgba(0, 0, 0, 0.08)",
        primary: {
          100: "#48ECAE",
          400: "#3E52FC",
          700: "#49CED7",
        },
        inputColor: "#313841",
      },
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif']
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
