import type { Config } from "tailwindcss";
import sharedConfig from "@gaqno-dev/config/tailwind";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../gaqno-ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@gaqno-dev/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [sharedConfig],
};

export default config;
