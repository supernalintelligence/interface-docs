/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'], // Use data-theme attribute for dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    '../open-source/interface-nextjs/src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Chat bubble positioning classes (used in DOCK_POSITIONS object in ChatBubble.tsx)
    'bottom-4', 'bottom-6', 'top-4', 'top-6', 'left-4', 'left-6', 'right-4', 'right-6',
    'bottom-0', 'top-0', 'left-0', 'right-0',
    'left-1/2', 'top-1/2', '-translate-x-1/2', '-translate-y-1/2',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

