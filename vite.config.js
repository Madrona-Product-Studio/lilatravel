import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load ALL env vars (empty prefix = no filter) so NPS_API_KEY is available
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/nps-proxy': {
          target: 'https://developer.nps.gov',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost');
            const endpoint = url.searchParams.get('endpoint') || 'thingstodo';
            const parkCode = url.searchParams.get('parkCode') || '';
            const limit = endpoint === 'thingstodo' ? 50 : 20;
            return `/api/v1/${endpoint}?parkCode=${parkCode}&limit=${limit}`;
          },
          headers: {
            'X-Api-Key': env.NPS_API_KEY || '',
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@data': '/src/data',
        '@utils': '/src/utils',
        '@services': '/src/services',
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
  };
});
