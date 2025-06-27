/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: "#1ABC9C",
        alert: "#D64541",
        surface: "#F3F3F3",
        dark: "#282B2F",
      },
      spacing: {
        1: "0.125rem", // 2px
        2: "0.25rem", // 4px
        3: "0.375rem", // 6px
        4: "0.5rem", // 8px
        5: "0.625rem", // 10px
        6: "0.75rem", // 12px
        8: "1rem", // 16px
        10: "1.25rem", // 20px
        12: "1.5rem", // 24px
        16: "2rem", // 32px
        20: "2.5rem", // 40px
        24: "3rem", // 48px
        32: "4rem", // 64px
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
