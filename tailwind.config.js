/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Paleta Sporthausen 2026 ── */
        'sporthausen-primary':       '#16243C',
        'sporthausen-secondary':     '#2BB0A3',
        'sporthausen-accent':        '#E25C3E',
        'sporthausen-neutral-light': '#F8FAFC',
        'sporthausen-neutral-dark':  '#1E293B',
        /* ── Tokens legacy remapeados a paleta 2026 ── */
        'sportshausen-red':    '#E25C3E',
        'sportshausen-dark':   '#16243C',
        'sportshausen-gold':   '#2BB0A3',
        'sportshausen-yellow': '#2BB0A3',
        'sportshausen-text':   '#1E293B',
        'sportshausen-light':  '#F8FAFC',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'Montserrat', 'sans-serif'],
        'body':    ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
