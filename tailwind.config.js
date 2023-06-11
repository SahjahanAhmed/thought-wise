/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      xs: "440px",
      sm: "640px",
      md: "1024px",
      lg: "1280px",
    },
    fontFamily: {
      ubuntu:'ubuntu,sans-serif,serif'
    }
  },
  plugins: [],
};
