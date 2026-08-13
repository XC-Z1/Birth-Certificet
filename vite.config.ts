import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleVerifyRequest } from './api/verify';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/verify') || req.url?.startsWith('/api/verify-birth-record')) {
          const url = new URL(req.url || '', 'http://localhost');
          const brn = url.searchParams.get('brn') || '';
          const dob = url.searchParams.get('dob') || '';

          const result = await handleVerifyRequest(brn, dob);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.statusCode = result.status || (result.success ? 200 : 400);
          res.end(JSON.stringify(result));
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/verify') || req.url?.startsWith('/api/verify-birth-record')) {
          const url = new URL(req.url || '', 'http://localhost');
          const brn = url.searchParams.get('brn') || '';
          const dob = url.searchParams.get('dob') || '';

          const result = await handleVerifyRequest(brn, dob);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.statusCode = result.status || (result.success ? 200 : 400);
          res.end(JSON.stringify(result));
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
