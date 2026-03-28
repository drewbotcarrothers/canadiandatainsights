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
        background: "#f9f9fd",
        foreground: "#191c1e",
        primary: {
          DEFAULT: "#003461",
          container: "#004b87", // atmospherical depth variant
        },
        tertiary: {
          DEFAULT: "#6e000b",
        },
        surface: {
          container: {
            lowest: "#ffffff",
            low: "#f3f3f7",
            DEFAULT: "#edeef1",
            high: "#e7e8eb", // inferred
            highest: "#e2e2e6",
          },
          dim: "#d9dadd",
        },
        on_surface: {
          DEFAULT: "#191c1e",
          variant: "#424750",
        },
        outline: {
          variant: "#c2c6d1",
        },
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-sm": ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.5", fontWeight: "500" }],
      },
      spacing: {
        "16": "3.5rem",
        "20": "4.5rem",
      },
      borderRadius: {
        md: "0.375rem",
        sm: "0.125rem",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to bottom, #003461, #004b87)",
      },
      boxShadow: {
        ambient: "0 20px 40px rgba(25, 28, 30, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
