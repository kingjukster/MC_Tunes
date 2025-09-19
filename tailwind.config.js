/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        jet: "#0d0d0d",
        ash: "#2e2e2e",
        blood: "#b10f2e",
        violet: "#6b4f82",
        pale: "#7da0c8",
      },
      fontFamily: {
        emo: ["'Cormorant Garamond'", "serif"],
        hand: ["'Permanent Marker'", "cursive"],
        sans: ["Inter", "sans-serif"],
      },
      container: { center: true, padding: "1rem" },
      backgroundImage: {
        'emo-texture': "url('/src/assets/emo_texture.png')",
      },
    },
  },
  plugins: [],
};
