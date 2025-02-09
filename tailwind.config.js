/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00F3E7",
        background: "#111214",
        color: "#CFCFCF",
        "soft-white": "#F2F4F7",
        green: "#16C682",
        red: "#F6475D",
        gray: "#82858F",
        "light-gray": "#2E3239",
        "mid-gray": "#16181C",
        "dark-gray": "#131518",
        outline: "#01f9e6",
        border: "#343153",
      },
      fontSize: {
        md: "1rem",
        smd: "0.93rem",
      },
      animation: {
        marquee: "marquee 120s linear infinite",
        marquee2: "marquee2 120s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      screens: {
        tablet: "640px",
        laptop: "1024px",
        desktop: "1280px",
      },
    },
  },
  plugins: [],
};
