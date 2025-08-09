export default {
 content: [
  "./src/**/*.{js,jsx,ts,tsx}", // asegúrate de incluir todas tus rutas
],
  theme: {
    extend: {
  animation: {
    'fade-in': 'fadeIn 0.5s ease-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
  },
    },
  },
  plugins: [],
}
