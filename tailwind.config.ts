// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lexend: "var(--font-lexend)",
        mono: "var(--font-geist-mono)",
      },
    },
  },
  plugins: [],
};
export default config;
