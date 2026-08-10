/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#810B38",
          bright: "#9c244b",
          hover: "#A62045",
          accent: "#CB2957",
          container: "#bc3e62",
          light: "#ffe9ec",
        },
        dark: {
          sidebar: "#0B0F17",
          surface: "#0B0F17",
          card: "#121824",
          border: "rgba(255, 255, 255, 0.1)",
        },
        canvas: {
          DEFAULT: "#EEEEEE",
          light: "#f9f9f9",
          card: "#ffffff",
          subtle: "#f4f3f3",
        },
        cyan: {
          500: "#06B6D4",
          400: "#22d3ee",
          300: "#67e8f9",
        },
        emerald: {
          500: "#10B981",
          400: "#34d399",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      boxShadow: {
        'level-1': '0 4px 20px rgba(0,0,0,0.05)',
        'level-2': '0 12px 32px rgba(0,0,0,0.12)',
        'glow-primary': '0 0 25px rgba(203, 41, 87, 0.4)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.4)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
