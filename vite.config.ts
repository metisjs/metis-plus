import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
    plugins: [react(), tailwindcss(), svgr()],
    server: {
      proxy:
        env.VITE_ENABLE_MOCK !== 'true'
          ? {
              '/api': {
                target: env.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
              },
            }
          : undefined,
    },
  };
});
