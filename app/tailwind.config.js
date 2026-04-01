/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steam: {
          bg: "#0f1114",
          surface: "#181b20",
          "surface-light": "#22262d",
          border: "#2e333b",
          text: "#d1d5db",
          "text-dim": "#6b7280",
          blue: "#14b8a6",
          "blue-hover": "#0d9488",
        },
        cat: {
          completed: "#4ade80",
          "in-progress": "#fbbf24",
          endless: "#3b82f6",
          "not-a-game": "#6b7280",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
