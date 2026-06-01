/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Target modern browsers for smaller output
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunk splitting to keep initial bundle ≤200KB gzipped
        // Separates heavy libraries into their own chunks loaded on demand
        manualChunks(id: string) {
          // Three.js ecosystem - largest dependency, only needed for 3D sections
          if (id.includes('node_modules/three') ||
              id.includes('node_modules/@react-three')) {
            return 'vendor-three';
          }
          // Animation libraries - used across sections but can be deferred
          if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/gsap')) {
            return 'vendor-animation';
          }
          // React core - shared across all chunks
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // State management and utilities
          if (id.includes('node_modules/zustand')) {
            return 'vendor-utils';
          }
          // Smooth scrolling library
          if (id.includes('node_modules/@studio-freight/lenis') ||
              id.includes('node_modules/lenis')) {
            return 'vendor-utils';
          }
        },
      },
    },
    // Increase chunk size warning limit (Three.js chunks are large but loaded on demand via lazy imports)
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
