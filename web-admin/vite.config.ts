import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';

  return {
    plugins: [react()],
    server: {
      port: 3001,
      // Proxy only active in local dev — production hits Render directly via VITE_API_BASE_URL
      proxy: isDev
        ? { '/api': { target: env.VITE_API_BASE_URL ?? 'http://localhost:3000', changeOrigin: true } }
        : undefined,
    },
    build: { outDir: 'dist' },
  };
});
