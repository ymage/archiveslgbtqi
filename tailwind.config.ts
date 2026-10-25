import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{ts,tsx}", "./sanity/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        tanker: ["var(--font-tanker)"],
        cityburn: ["var(--font-cityburn)"],
        jetbrains: ["var(--font-jetbrains)"],
      },
      animation: {
        marquee: "marquee 10s linear infinite",
        "slow-pulse": "slow-pulse 3s ease-in-out infinite",
        "translate-squeezed":
          "translate-squeezed 0.5s 5s infinite running slidein",
        scroll: "scroll 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        scroll: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      colors: {
        "white-primary": "#F7F7F7",
        "black-primary": "#121212",
        "pink-arch": "#FC5F8C",
      },
      fontSize: {
        "header-mobile": "1.5rem",
        "header-desktop": "1rem",
      },
      height: {
        "header-mobile": "1.5rem",
        "header-desktop": "1.1875rem",
        "header-size-desktop": "6rem",
      },
      lineHeight: {
        "header-mobile": "1.8rem",
        "header-desktop": "1rem",
      },
      margin: {
        arch: "17rem",
      },

      padding: {
        bottomPage: "7rem",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config;
