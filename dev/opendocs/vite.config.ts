import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// Removed viteSingleFile to solve memory issues during build with large dependencies like Excalidraw

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Reduced from 2000 to catch large chunks earlier
    reportCompressedSize: false,
    minify: 'esbuild', // Optimized: Enable minification for smaller bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'zustand'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-slot', 'lucide-react', 'clsx', 'tailwind-merge'],
          charts: ['recharts'], // If used
          editor: ['@excalidraw/excalidraw'], // Separate heavy editor deps
        },
      },
    },
  },
});
