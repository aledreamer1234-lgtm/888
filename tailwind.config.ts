import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["IBM Plex Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      colors: {
        ink: "#05070d",
        panel: "#0d1220",
        panelAlt: "#0f1728",
        line: "rgba(133, 151, 186, 0.18)",
        coin: "#f5f7ff",
        muted: "#93a0bf",
        accent: "#4f7cff",
        accentSoft: "#8a5cff",
        success: "#5ee2a0",
        warning: "#ffca71",
        danger: "#ff7d85",
      },
      boxShadow: {
        card: "0 16px 40px rgba(1, 5, 16, 0.36)",
        focus: "0 0 0 1px rgba(79, 124, 255, 0.65), 0 0 0 4px rgba(79, 124, 255, 0.14)",
      },
      backgroundImage: {
        "site-grid":
          "linear-gradient(to right, rgba(120,138,182,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,138,182,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
