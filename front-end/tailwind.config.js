/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        tertiary: "#EDF6F9",
        secondary: "#13B58B",
        "lighter-grey": "#343a40",
        primary: "#212529",
        sender: "rgb(51 65 85)",
        receiver: "#D6D6D6",
      },
      keyframes: {
        load: {
          "0%": { opacity: "0%" },
          "100%": { opacity: "0%" },
        },
      },
      animation: {
        load: "load 1.5s backwards",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    // nocompatible: true - scroll bar thumb will not be compatible with firefox
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
