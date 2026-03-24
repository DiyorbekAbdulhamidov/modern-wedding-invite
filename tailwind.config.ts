import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF9F6', // Asosiy fon uchun oq-sut rangi
          100: '#FDFCFB',
        },
        champagne: {
          DEFAULT: '#F7E7CE',
          100: '#FBF3E6',
          400: '#E4C59A', // Matnlar va chiziqlar uchun
          600: '#C5A059', // Tugmalar va urg'u berish uchun
          800: '#8A6D3B', // To'q shampan (matn o'qilishi uchun)
        },
        dark: '#2C2C2C', // Asosiy matnlar uchun o'ta to'q kulrang
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;