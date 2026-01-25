/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'], // Use data-theme attribute for dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    '../open-source/interface-nextjs/src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@supernal/interface-nextjs/**/*.{js,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

