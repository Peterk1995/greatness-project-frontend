/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        marble: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFE44D',
          dark: '#D4B400'
        },
        bronze: {
          DEFAULT: '#CD7F32',
          50: '#F4E4D8',
          100: '#E6C5A9',
          200: '#D9AC7A',
          300: '#CD934B',
          400: '#C07A1C',
          500: '#B36100',
          600: '#A64800',
          700: '#992F00',
          800: '#8B1600',
          900: '#7E0000'
        },
        night: {
          DEFAULT: '#1a1a1a',
          50: 'rgba(26, 26, 26, 0.05)',
          100: 'rgba(26, 26, 26, 0.1)',
          200: 'rgba(26, 26, 26, 0.2)',
          300: 'rgba(26, 26, 26, 0.3)',
          400: 'rgba(26, 26, 26, 0.4)',
          500: 'rgba(26, 26, 26, 0.5)',
          600: 'rgba(26, 26, 26, 0.6)',
          700: 'rgba(26, 26, 26, 0.7)',
          800: 'rgba(26, 26, 26, 0.8)',
          900: 'rgba(26, 26, 26, 0.9)'
        },
        olive: {
          light: '#A5A52A',
          DEFAULT: '#808000',
          dark: '#556B2F'
        }
      },
      fontFamily: {
        'crete-round': ['"Crete Round"', 'serif'],
        'alexandria': ['"Alexandria"', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'inner-gold': 'inset 0 2px 4px 0 rgba(255, 215, 0, 0.05)',
        'bronze': '0 4px 6px -1px rgba(205, 127, 50, 0.1), 0 2px 4px -1px rgba(205, 127, 50, 0.06)',
      },
      borderWidth: {
        '3': '3px',
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: []
}