import react from '@vitejs/plugin-react'

import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  // optimizeDeps: {
  //   exclude: ['@react-pdf/renderer', 'pdf-lib'], // Exclude PDF-related dependencies
  //   include: ['base64-js'], // Include base64-js for proper bundling
  // },
  // build: {
  //   commonjsOptions: {
  //     include: [/base64-js/, /node_modules/],
  //   },
  // },
  resolve: {
    alias: {
      features: '/src/features',
      assets: '/src/assets',
      components: '/src/components',
      hooks: '/src/hooks',
      routes: '/src/routes',
      styles: '/src/styles',
      utils: '/src/utils',
      constants: '/src/constants',
      app: '/src/app',
      types: '/src/types',
      api: '/src/api',
      mocks: '/src/mocks',
      config: '/src/config',
      fonts: '/src/fonts',
    },
  },
})
