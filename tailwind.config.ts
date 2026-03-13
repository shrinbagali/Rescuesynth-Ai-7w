import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        card: "#1e293b",
        "card-hover": "#334155",
        border: "#334155",
        "neon-blue": "#3b82f6",
        "neon-teal": "#14b8a6",
        "neon-amber": "#f59e0b",
        "neon-red": "#ef4444",
      },
      boxShadow: {
        glow: "0 0 15px rgba(59, 130, 246, 0.5)",
        "glow-teal": "0 0 15px rgba(20, 184, 166, 0.5)",
        "glow-amber": "0 0 15px rgba(245, 158, 11, 0.5)",
        "glow-red": "0 0 15px rgba(239, 68, 68, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
