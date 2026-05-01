/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light editorial palette.
        // Token names preserved so component classes don't change —
        // 'midnight' now refers to warm cream/ivory backgrounds,
        // 'platinum' now refers to dark text colours (inverted).
        midnight: {
          950: "#FDFAF2", // warmest cream — body background
          900: "#F8F2E4", // panels and cards
          800: "#F0E7D0", // raised panels
          700: "#E5DAC2", // hairline dividers (subtle on cream)
          600: "#C9BC9C", // stronger borders / visible dividers
        },
        champagne: {
          50: "#FAF5E8",
          100: "#F0E6C8",
          200: "#E2D29A",
          300: "#D4BC75",
          400: "#B89244",  // shifted darker — needs more contrast on cream
          500: "#967635",
          600: "#705828",
          700: "#4F3E1B",
        },
        platinum: {
          50: "#1A1F2E",   // deepest text (was lightest in dark theme)
          100: "#15192A",  // primary headings
          200: "#26293A",  // body text
          300: "#3F4253",  // secondary text
          400: "#5C5F72",  // muted text
          500: "#7C7F92",  // more muted
          600: "#9B9DAB",  // lightest readable
          700: "#B5B7C2",  // ghost
          800: "#D0D1D8",  // very ghost
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        "shimmer": "shimmer 2.4s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
