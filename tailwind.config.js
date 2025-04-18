/** @type {import('tailwindcss').Config} */
export const content = ["./app/**/*.{js,jsx,ts,tsx}"];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {
    colors: {
      primary: '#1EAFB3',
      secondary: '#b6fdff'
    }
  },
};
export const plugins = [];