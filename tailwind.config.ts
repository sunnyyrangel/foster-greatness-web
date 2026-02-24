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
        // Legacy non-prefixed colors — prefer fg-* variants in new code
        navy: "#1a2949",
        blue: "#0067a2",
        teal: "#00c8b7",
        orange: "#fa8526",
        yellow: "#faca2c",
        "light-blue": "#ddf3ff",

        // FG-prefixed brand colors
        'fg-navy': '#1a2949',      // Primary brand color
        'fg-blue': '#0067a2',      // Secondary brand color
        'fg-teal': '#00c8b7',      // Accent teal (use sparingly)
        'fg-light-blue': '#ddf3ff',
        'fg-orange': '#fa8526',
        'fg-yellow': '#faca2c',
        'fg-coral': '#ff6f61',     // Accent coral

        // Neutrals
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Poppins", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
