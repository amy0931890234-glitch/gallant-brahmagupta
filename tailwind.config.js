/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          bg: '#0F172A',
          sheet: '#FFFFFF',
          text: '#1E293B',
          muted: '#64748B',
          border: '#E2E8F0',
        },
        procure: {
          primary: '#2563EB',
          accent: '#0D9488',
          warn: '#D97706',
          danger: '#DC2626',
          success: '#16A34A',
        }
      },
      boxShadow: {
        'paper-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'paper-deep': '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
