import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [
    react(),
    commonjs(),
  ],

  server: {
    port: 3000,          // Change the port to any available port (default is 5173)
    host: '0.0.0.0',     // Use 'localhost', '0.0.0.0', or a custom hostname
    strictPort: true,    // If true, Vite will throw an error if the port is already in use
    proxy: {
      '/api': {
        target: 'https://hr-management-1-baxp.onrender.com', // Proxy API requests to your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove /api from the request URL
      }
    }
  }
});
