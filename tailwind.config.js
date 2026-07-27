export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#171723',
        panel: '#11111A',
        bg: '#0B0B12',
        brand: '#8B5CF6',
        lavender: '#C4B5FD',
        soft: '#F8FAFC',
        success: '#34D399',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      boxShadow: {
        glow: '0 20px 80px rgba(139,92,246,0.14)',
        panel: '0 20px 60px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        '4xl': '24px',
      },
      backgroundImage: {
        'radial-soft': 'radial-gradient(circle at top left, rgba(139,92,246,0.18), transparent 32%), radial-gradient(circle at 80% 18%, rgba(196,181,253,0.16), transparent 28%), radial-gradient(circle at 50% 100%, rgba(124,58,237,0.12), transparent 30%)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
