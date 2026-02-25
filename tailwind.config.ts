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
          "0%": { left: "8%", top: "40%", opacity: "0", transform: "scale(0.5)" },
          "8%": { top: "35%", opacity: "0.7", transform: "scale(0.8)" },
          "20%": { top: "18%", opacity: "1", transform: "scale(1)" },
          "35%": { left: "45%", top: "4%", opacity: "1", transform: "scale(1)" },
          "50%": { top: "18%", opacity: "1", transform: "scale(1)" },
          "58%": { top: "30%", opacity: "0.8", transform: "scale(0.85)" },
          "65%": { left: "85%", top: "38%", opacity: "0", transform: "scale(0.4)" },
          "100%": { left: "85%", top: "38%", opacity: "0", transform: "scale(0.4)" },
        },
        celestialMoon: {
          "0%, 62%": { left: "10%", top: "40%", opacity: "0", transform: "scale(0.4)" },
          "70%": { top: "32%", opacity: "0.5", transform: "scale(0.75)" },
          "80%": { top: "15%", opacity: "0.9", transform: "scale(1)" },
          "88%": { left: "50%", top: "4%", opacity: "0.9", transform: "scale(1)" },
          "94%": { top: "28%", opacity: "0.6", transform: "scale(0.7)" },
          "100%": { left: "85%", top: "38%", opacity: "0", transform: "scale(0.3)" },
        },
        dayNight: {
          "0%, 55%": { background: "transparent" },
          "70%, 92%": { background: "rgba(15, 23, 42, 0.18)" },
          "100%": { background: "transparent" },
        },
        starsAppear: {
          "0%, 60%": { opacity: "0" },
          "72%, 92%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        cloudDrift1: {
          "0%": { transform: "translateX(100cqw)" },
          "100%": { transform: "translateX(-40px)" },
        },
        cloudDrift2: {
          "0%": { transform: "translateX(110cqw)" },
          "100%": { transform: "translateX(-30px)" },
        },
        cloudDrift3: {
          "0%": { transform: "translateX(105cqw)" },
          "100%": { transform: "translateX(-25px)" },
        },
        cloudsHide: {
          "0%, 55%": { opacity: "1" },
          "65%, 95%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        rainDrop: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "20%": { opacity: "0.6" },
          "100%": { transform: "translateY(56px)", opacity: "0" },
        },
        rainAppear: {
          "0%, 30%": { opacity: "0" },
          "35%, 48%": { opacity: "1" },
          "52%, 100%": { opacity: "0" },
        },
        fireFlicker: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)", opacity: "0.85" },
          "25%": { transform: "scaleY(1.1) scaleX(0.9)", opacity: "0.9" },
          "50%": { transform: "scaleY(0.9) scaleX(1.05)", opacity: "0.75" },
          "75%": { transform: "scaleY(1.05) scaleX(0.95)", opacity: "0.9" },
        },
        smokeRise: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.15" },
          "50%": { transform: "translateY(-6px) scale(1.5)", opacity: "0.08" },
          "100%": { transform: "translateY(-14px) scale(2)", opacity: "0" },
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
        cloudDrift1: "cloudDrift1 15s linear infinite",
        cloudDrift2: "cloudDrift2 20s linear infinite",
        cloudDrift3: "cloudDrift3 25s linear infinite",
        cloudsHide: "cloudsHide 10s ease-in-out infinite",
        rainDrop: "rainDrop 0.6s linear infinite",
        rainAppear: "rainAppear 10s ease-in-out infinite",
        fireFlicker: "fireFlicker 0.4s ease-in-out infinite",
        smokeRise: "smokeRise 2s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
