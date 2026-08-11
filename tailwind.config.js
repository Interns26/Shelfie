/* Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        soft: 'rgb(var(--color-soft) / <alpha-value>)',
        lavender: 'rgb(var(--color-lavender) / <alpha-value>)',
        brand: '#8B5CF6',
        success: '#34D399',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      boxShadow: {
        glow: '0 20px 80px rgba(139,92,246,0.14)',
        panel: '0 20px 60px rgba(0,0,0,0.25)',
        soft: '0 20px 45px rgba(139,92,246,0.14), 0 6px 16px rgba(17,17,26,0.06)',
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