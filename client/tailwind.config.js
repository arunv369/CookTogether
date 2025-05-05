/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f9f5f2",
          100: "#f3e9e0",
          200: "#e9d4c1",
          300: "#ddb99c",
          400: "#d29c74",
          500: "#c67d4d",
          600: "#b76543",
          700: "#994e3a",
          800: "#7c4034",
          900: "#65362e",
          950: "#351c18",
        },
        secondary: {
          50: "#f5f8f6",
          100: "#dee9e3",
          200: "#bfd3c8",
          300: "#9bb8a9",
          400: "#77998a",
          500: "#5a7d70",
          600: "#456359",
          700: "#3a5049",
          800: "#30403c",
          900: "#293532",
          950: "#111917",
        },
        accent: {
          50: "#fef3f2",
          100: "#fee5e1",
          200: "#fececa",
          300: "#fcaca4",
          400: "#fb7a6d",
          500: "#f44336",
          600: "#e12d1f",
          700: "#bd1e14",
          800: "#9c1d15",
          900: "#821d15",
          950: "#470b08",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
      },
      animation: {
        "pulse-slow": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
