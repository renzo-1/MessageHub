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
        "bluish-white": "#EDF6F9",
        "button-color": "#13B58B",
        "lighter-grey": "#343a40",
        "bg-grey": "#212529",
        sender: "rgb(51 65 85)",
        receiver: "#D6D6D6",
      },
      spacing: {
        "100%": "100%",
        "90%": "90%",
        "80%": "80%",
        "40%": "40%",
        "30%": "30%",
        "20%": "20%",
        "10%": "10%",
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
