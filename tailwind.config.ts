import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        walk: {
          "0%": { transform: "translateX(-24px)" },
          "100%": { transform: "translateX(calc(100vw - 48px))" },
        },
        legSwing: {
          "0%, 100%": { transform: "rotate(-15deg)" },
          "50%": { transform: "rotate(15deg)" },
        },
        stickSwing: {
          "0%, 100%": { transform: "rotate(8deg)" },
          "50%": { transform: "rotate(-8deg)" },
        },
        celestial: {
          "0%": { left: "5%", top: "70%", opacity: "0" },
          "10%": { opacity: "1" },
          "50%": { left: "48%", top: "2%", opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { left: "92%", top: "70%", opacity: "0" },
        },
        celestialMoon: {
          "0%": { left: "92%", top: "70%", opacity: "0" },
          "10%": { opacity: "0" },
          "50%": { left: "92%", top: "70%", opacity: "0" },
          "60%": { left: "5%", top: "70%", opacity: "0" },
          "70%": { opacity: "0.9" },
          "85%": { left: "48%", top: "2%", opacity: "0.9" },
          "95%": { opacity: "0.9" },
          "100%": { left: "92%", top: "70%", opacity: "0" },
        },
        dayNight: {
          "0%, 45%": { background: "transparent" },
          "60%, 90%": { background: "rgba(15, 23, 42, 0.15)" },
          "100%": { background: "transparent" },
        },
        starsAppear: {
          "0%, 50%": { opacity: "0" },
          "65%, 90%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        walk: "walk 10s linear infinite",
        legSwing: "legSwing 0.5s ease-in-out infinite",
        stickSwing: "stickSwing 0.5s ease-in-out infinite",
        celestial: "celestial 10s ease-in-out infinite",
        celestialMoon: "celestialMoon 10s ease-in-out infinite",
        dayNight: "dayNight 10s ease-in-out infinite",
        starsAppear: "starsAppear 10s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
