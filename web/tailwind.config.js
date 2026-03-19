/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e6f1fb',
          100: '#b5d4f4',
          500: '#378ADD',
          600: '#185FA5',
          700: '#0C447C',
          900: '#042C53',
        },
        agro: {
          green:  '#1D9E75',
          teal:   '#0F6E56',
          purple: '#534AB7',
          dark:   '#1B2A6B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow':   'bounce 3s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'pulse-slow':    'pulse 4s ease-in-out infinite',
        'fade-in-up':    'fadeInUp 0.6s ease-out forwards',
        'fade-in':       'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-agro': 'linear-gradient(135deg, #1B2A6B 0%, #0C447C 50%, #534AB7 100%)',
        'gradient-green': 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)',
      },
      boxShadow: {
        'agro':   '0 10px 40px rgba(29, 158, 117, 0.3)',
        'card':   '0 4px 24px rgba(0, 0, 0, 0.08)',
        'glow':   '0 0 40px rgba(55, 138, 221, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}