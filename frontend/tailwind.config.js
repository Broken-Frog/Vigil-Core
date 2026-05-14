/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0c10",
        surface: "#11141b",
        primary: "#00d2ff",
        accent: "#00ff9d",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-cyan': 'pulse-cyan 3s infinite',
      },
      keyframes: {
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 210, 255, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(0, 210, 255, 0)' },
        },
      },
    },
  },
  plugins: [],
}
