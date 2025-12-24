import type { Config } from "tailwindcss";

// Tailwind v4 configuration
// With @tailwindcss/vite plugin, most config is in CSS via @theme
// But we still need content paths for class detection
const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../@gaqno-frontcore/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@gaqno-dev/frontcore/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
