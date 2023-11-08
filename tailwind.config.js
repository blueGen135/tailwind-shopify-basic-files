module.exports = {
  content: [
    "./config/*.json",
    "./layout/*.liquid",
    "./assets/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./templates/*.liquid",
    "./templates/*.json",
    "./templates/customer/*.liquid",
  ],
  theme: {
    extend: {
      colors: {
        siteColor: "#00888C",
      },
      zIndex: {
        '100': '100',
      }
    },
  },
  plugins: [],
};
