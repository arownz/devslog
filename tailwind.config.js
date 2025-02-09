/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./index.html"
];
export const theme = {
  extend: {
    colors: {
      emerald: {
        100: '#d1fae5',
        200: '#a7f3d0',
      },
      green: {
        600: '#059669',
        700: '#047857',
      },
    },
  },
};
export const plugins = [];