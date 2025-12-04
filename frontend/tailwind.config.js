/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
        brand: "var(--color-brand)",
        "brand-contrast": "var(--color-brand-contrast)",
        error: "var(--color-error)",
        success: "var(--color-success)",
        typography: "var(--color-typography)",
        "typography-tone": "var(--color-typography-tone)",
        "typography-content": "var(--color-typography-content)",
        "typography-reverse": "var(--color-typography-reverse)",
        "background-tone": "var(--color-background-tone)",
        "background-opac": "var(--color-background-opac)",
        "background-reverse": "var(--color-background-reverse)",
        "border-reverse": "var(--color-border-reverse)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        DEFAULT: "var(--radius)",
        sm: "var(--radius-sm)",
        xs: "var(--radius-xs)",
        xxs: "var(--radius-xxs)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        system: "var(--font-system)",
      },
      boxShadow: {
        DEFAULT: "var(--shadow)",
      },
      maxWidth: {
        container: "var(--container-width)",
        content: "var(--content-width)",
        "content-wide": "var(--content-width-wide)",
        wide: "var(--wide-width)",
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
    },
  },
  plugins: [require("tailwindcss-animate")],
}

