import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
          DEFAULT: "hsl(var(--primary))", // This will be the accent color for general primary use
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
          DEFAULT: "hsl(var(--accent))", // #00BFA6
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
        // Custom colors for the new palette
        'primary-button-start': '#00BFA6', // Turquoise technologique
        'primary-button-end': '#0098DA',   // Blue for gradient end
        'main-text': '#1E293B',            // Gris doux, lisible
        'secondary-text': '#64748B',       // Sobriété
        'sidebar-bg-dark': '#111827',      // Dark for sidebar
        'table-header-bg': 'hsl(var(--muted))', // Added: Table header background color
        
        // Existing KPI colors (keep them as they are for now)
        "kpi-blue-start": "#3B82F6",
        "kpi-blue-end": "#2563EB",
        "kpi-green-start": "#10B981",
        "kpi-green-end": "#059669",
        "kpi-orange-start": "#F59E0B",
        "kpi-orange-end": "#EA580C",
        "kpi-red-start": "#EF4444",
        "kpi-red-end": "#DC2626",
        "kpi-purple-start": "#8B5CF6",
        "kpi-purple-end": "#7C3AED",
      },
      borderRadius: {
        lg: "12px", // Adjusted for more rounded corners
        md: "8px",
        sm: "4px",
        xl: "1rem", // Added for professional-shadow cards
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Default text
        heading: ["Inter", "sans-serif"], // Titles (using Inter for consistency as per brief)
        mono: ["Montserrat", "monospace"], // Numbers/Stats (keeping Montserrat)
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        pulse: { // Added pulse animation for alerts
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-light": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: { // Custom shadow for professional look
        'professional': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'card-float': '0 4px 12px rgba(0,0,0,0.04)', // New shadow for cards
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;