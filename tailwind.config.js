/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cyber: {
          black: "#0a0a0f",
          dark: "#0f0f1a",
          panel: "#13131f",
          border: "#1a1a2e",
          cyan: "#00f0ff",
          magenta: "#ff00a0",
          purple: "#7000ff",
          green: "#00ff88",
          yellow: "#ffea00",
          red: "#ff0040",
          blue: "#0080ff",
          glow: "rgba(0, 240, 255, 0.15)",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "cyber-pulse": {
          "0%, 100%": { opacity: 1, filter: "brightness(1)" },
          "50%": { opacity: 0.8, filter: "brightness(1.3)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "energy-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "hologram-flicker": {
          "0%, 100%": { opacity: 1 },
          "5%": { opacity: 0.8 },
          "10%": { opacity: 1 },
          "15%": { opacity: 0.3 },
          "20%": { opacity: 1 },
          "50%": { opacity: 0.9 },
          "52%": { opacity: 0.5 },
          "55%": { opacity: 0.9 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "cyber-pulse": "cyber-pulse 2s ease-in-out infinite",
        "scan-line": "scan-line 3s linear infinite",
        "glitch": "glitch 0.3s ease-in-out",
        "float": "float 6s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "energy-flow": "energy-flow 3s ease infinite",
        "hologram-flicker": "hologram-flicker 4s infinite",
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)",
        "energy-gradient": "linear-gradient(90deg, #00f0ff, #7000ff, #ff00a0, #00f0ff)",
        "hologram": "linear-gradient(180deg, rgba(0,240,255,0.1) 0%, transparent 50%, rgba(0,240,255,0.1) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
