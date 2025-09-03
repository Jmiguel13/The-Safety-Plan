// tailwind.config.js
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  // Keeping content is fine with v4:
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Antonio", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        bg: { DEFAULT: "#0F1214", soft: "#14181B", hard: "#0A0D0F" },
        fg: { DEFAULT: "#E6EAEA", dim: "#A7B0B3", mute: "#6C777C" },
        line: "#20262A",
        accent: { DEFAULT: "#79FF6B", soft: "#c8ffbf", ring: "#9AFF8E" },
        warn: "#FFD166",
        err: "#FF6B6B",
        info: "#4CC9F0",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.35)",
        bold: "0 12px 36px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        xl2: "1.25rem",
        pill: "9999px",
      },
      letterSpacing: {
        wide2: ".08em",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 400ms ease-out both",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".glass": {
          backdropFilter: "blur(6px)",
          // keep it simple & compatible
          backgroundColor: "rgba(20, 24, 27, 0.85)",
        },
      });
    }),
  ],
};

export default config;
