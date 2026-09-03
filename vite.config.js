/* Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4174,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        // For local development (no Docker), proxy to localhost backend
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});