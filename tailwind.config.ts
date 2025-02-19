import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        // for future use
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
      },
    },
    extend: {
      backgroundImage: {
        "main-gradient": "linear-gradient(180deg, #155A9E 0%, #007FAA 100%);",
        "overlay-alert": "linear-gradient(180deg, #155A9E 0%, #007FAA 100%);",
        "main-pattern": "url('/assets/bg.png')",
      },
      width: {
        '68': '16.5rem',
        '156': '39rem',
        '115': "28.75rem",
        '120': '30rem',
        '160': '40rem',
        '52': '13rem',
        '30': '7.5rem',
        '27': '6.75rem',
      },
      maxWidth: {
        'auth-form': '33rem',
      },
      colors: {
        border: "#E2E8F0",
        input: "#E2E8F0",
        backdrop: "#155E7566",
        foreground: "#A5F3FC",
        primary: {
          DEFAULT: "#F97316",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#0F172A",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#F8FAFC",
        },
        brand:  {
          gray: "#4F4F4F",
          orange: "#FF8855"
        },
        muted: {
          DEFAULT: "#E2E8F0",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#F1F5F9",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "hsl(var(--popover-foreground))",
        },
        cyan: {
          DEFAULT: "#0891B2",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neutrals: {
          DEFAULT: "#555E68",
          primary: "#FAFAFA",
          secondary: "#F5F5F5",
          muted: "#737373",
          border: "#D4D4D4"
        },
        'bi-gray': '#555E68',
        'sec-txt': '#32383E',
        "muted-foreground": "#64748B",
        'dark-gray': "#616671",
        "lightest-gray": "#ECEFF3",
        'bi-black': "#171A1C",
        'bi-just-gray': "#8A909B",
        'hover-primary': "#E3EFFB",
        'hover-error': "#FFD0CD",
        'error': "#B3261E",
        'dark-accent': "#0A3F73",
        "active-participant": "rgba(200, 244, 173)",
        "fixed-price": "rgba(255, 230, 128, 0.6)",
        "botEvent": "rgba(0, 127, 170, 1)"
      },
      borderOpacity: {
        '64': '0.64',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderColor: {
        "outline-button": 'rgba(21, 90, 158, 0.4)',
        "outline-button-error": 'rgba(240, 152, 152, 1)'
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        'auction-list': '0px 1px 4px 0px #0000001A',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config