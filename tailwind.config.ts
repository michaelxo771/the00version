import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#fdf8e7",
          100: "#f9edbd",
          200: "#f3d97a",
          300: "#ecc340",
          400: "#d4a832",
          500: "#C9A84C",
          600: "#a8872d",
          700: "#856820",
          800: "#634d18",
          900: "#42330f",
        },
        dark: {
          950: "#080808",
          900: "#0d0d0d",
          800: "#111111",
          700: "#1a1a1a",
          600: "#222222",
          500: "#2a2a2a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #f3d97a 50%, #C9A84C 100%)",
        "gold-shine": "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 50%, transparent 100%)",
        "dark-gradient": "linear-gradient(180deg, #080808 0%, #111111 100%)",
      },
      animation: {
        "shine": "shine 2s infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
