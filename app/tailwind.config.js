/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steam: {
          bg: "#171a21",
          surface: "#1b2838",
          "surface-light": "#2a475e",
          border: "#2a475e",
          text: "#c7d5e0",
          "text-dim": "#8f98a0",
          blue: "#66c0f4",
          "blue-hover": "#4db2f0",
        },
        cat: {
          completed: "#4CAF50",
          "in-progress": "#FFC107",
          endless: "#2196F3",
          "not-a-game": "#9E9E9E",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
