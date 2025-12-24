import type { Config } from "tailwindcss";
import path from "path";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    path.resolve(__dirname, "../@gaqno-frontcore/src/**/*.{js,ts,jsx,tsx,mdx}"),
    path.resolve(__dirname, "./node_modules/@gaqno-dev/frontcore/src/**/*.{js,ts,jsx,tsx,mdx}"),
    path.resolve(__dirname, "../@gaqno-frontcore/src/**/*.{js,ts,jsx,tsx}"),
    path.resolve(__dirname, "./node_modules/@gaqno-dev/frontcore/**/*.{js,ts,jsx,tsx}"),
  ],
  plugins: [],
};

export default config;
