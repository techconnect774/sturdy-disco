/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          bg: '#ffffff',
          'bg-secondary': '#f9fafb',
          text: '#1a1a1a',
          'text-secondary': '#6b7280',
          primary: '#3b82f6',
          'primary-hover': '#2563eb',
          secondary: '#64748b',
          accent: '#8b5cf6',
          border: '#e5e7eb',
          error: '#ef4444',
          success: '#10b981',
        },
        // Dark theme colors
        dark: {
          bg: '#0f172a',
          'bg-secondary': '#1e293b',
          text: '#f1f5f9',
          'text-secondary': '#94a3b8',
          primary: '#60a5fa',
          'primary-hover': '#3b82f6',
          secondary: '#94a3b8',
          accent: '#a78bfa',
          border: '#334155',
          error: '#f87171',
          success: '#34d399',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1a1a1a',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#2563eb',
              },
            },
          },
        },
        invert: {
          css: {
            color: '#f1f5f9',
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#3b82f6',
              },
            },
            h1: {
              color: '#f1f5f9',
            },
            h2: {
              color: '#f1f5f9',
            },
            h3: {
              color: '#f1f5f9',
            },
            h4: {
              color: '#f1f5f9',
            },
            strong: {
              color: '#f1f5f9',
            },
            code: {
              color: '#f1f5f9',
            },
            blockquote: {
              color: '#94a3b8',
              borderLeftColor: '#334155',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
