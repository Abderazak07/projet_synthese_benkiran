/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        accent: '#ec4899',
        dark: '#0a0a0a',
        darker: '#050505',
        'card-bg': 'rgba(255,255,255,0.05)',
        'border-glow': 'rgba(124,58,237,0.3)',
      }
    },
  },
  plugins: [],
}
