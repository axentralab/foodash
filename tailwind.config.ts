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
        primary: { DEFAULT: "#FF6B35", light: "#FF8C5A", dark: "#E55520" },
        secondary: { DEFAULT: "#2D2A3E", light: "#3D3A55" },
        accent: "#FFD166",
        surface: "#F7F5F2",
        dark: { 100: "#1A1825", 200: "#2D2A3E", 300: "#4A4760" },
        success: "#06D6A0",
        error: "#EF476F",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["system-ui", "sans-serif"],
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.14)",
        primary: "0 8px 32px rgba(255,107,53,0.35)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #2D2A3E 0%, #1A1825 100%)",
        "primary-gradient": "linear-gradient(135deg, #FF6B35 0%, #FFD166 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
