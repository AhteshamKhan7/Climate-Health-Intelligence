/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ct: {
          bg: '#EAF3ED',          // Main background
          bgSub: '#E4F1F3',       // Secondary background
          sidebar: '#245B4B',     // Sidebar deep green
          sidebarHover: '#1d4b3e',
          sidebarActive: '#183f34',
          primary: '#368F83',     // Primary teal/green
          primaryHover: '#2b756b',
          blue: '#4B91C5',        // Blue accent
          blueHover: '#3b7cae',
          ai: '#E8E4F5',          // AI section purple/lavender
          aiText: '#4c3b7a',
          card: '#FFFFFF',        // Cards
          text: '#203C37',        // Primary text
          textMuted: '#66847D',   // Secondary text (#66847D)
          secondary: '#66847D',
          border: '#D2E4DA',      // Soft green-grey border
          borderLight: '#E8F1EC',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#368F83',
          600: '#2b756b',
          700: '#245B4B',
          800: '#1d4b3e',
          900: '#183f34',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
