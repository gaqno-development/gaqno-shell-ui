import type { Config } from "tailwindcss";
import path from "path";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    path.resolve(__dirname, "../@gaqno-frontcore/src/**/*.{js,ts,jsx,tsx,mdx}"),
    path.resolve(__dirname, "./node_modules/@gaqno-development/frontcore/src/**/*.{js,ts,jsx,tsx,mdx}"),
    path.resolve(__dirname, "../@gaqno-frontcore/src/**/*.{js,ts,jsx,tsx}"),
    path.resolve(__dirname, "./node_modules/@gaqno-development/frontcore/**/*.{js,ts,jsx,tsx}"),
  ],
  plugins: [tailwindcssAnimate],
};

export default config;
