import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          light: "#005e97",
          dark: "#004a79",
        },
        seaweed: {
          dark: "#006d3d",
          light: "#7ed99e",
        },
        primary: "#005e97",
        "primary-container": "#0077be",
        secondary: "#006d3d",
        "secondary-container": "#97f3b5",
        surface: "#f4faff",
        "on-surface": "#0e1d25",
        "on-surface-variant": "#404751",
        outline: "#707882",
        "outline-variant": "#c0c7d2",
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(to right, #005e97, #006d3d)',
      },
    },
  },
  plugins: [],
}
export default config
