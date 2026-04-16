/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backward-compatible legacy tokens
        primary: '#7c3aed',
        accent: '#ec4899',

        // Luxury theme tokens (preferred moving forward)
        ink: '#070709',
        coal: '#0b0b0f',
        graphite: '#12121a',
        surface: 'rgba(255,255,255,0.04)',
        surface2: 'rgba(255,255,255,0.06)',
        stroke: 'rgba(255,255,255,0.10)',
        stroke2: 'rgba(255,255,255,0.16)',
        gold: '#d6b26e',
        copper: '#c46b35',
        pearl: '#f1f1f3',

        // Existing usages in codebase
        dark: '#0a0a0a',
        darker: '#050505',
        'card-bg': 'rgba(255,255,255,0.05)',
        'border-glow': 'rgba(124,58,237,0.3)',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        display: ['ui-sans-serif', 'system-ui', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      backgroundImage: {
        'lux-hero': "radial-gradient(1200px 600px at 65% 40%, rgba(214,178,110,0.12), transparent 55%), radial-gradient(900px 500px at 25% 20%, rgba(124,58,237,0.20), transparent 55%), linear-gradient(180deg, rgba(7,7,9,0.0) 0%, rgba(7,7,9,0.70) 55%, rgba(7,7,9,1.0) 100%)",
        'lux-grid': "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        'soft': '0 18px 60px rgba(0,0,0,0.55)',
        'glow-gold': '0 0 0 1px rgba(214,178,110,0.22), 0 18px 60px rgba(0,0,0,0.60)',
        'glow-primary': '0 0 0 1px rgba(124,58,237,0.22), 0 18px 60px rgba(0,0,0,0.60)',
      },
      borderRadius: {
        'xl2': '1.25rem',
      }
    },
  },
  plugins: [],
}
