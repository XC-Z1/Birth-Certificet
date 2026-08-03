import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { handleVerifyRequest } from './api/verify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  let searchCount = 12450;

  // Search counter API
  app.get('/api/search-counter', (req, res) => {
    res.json({ count: searchCount });
  });

  // API Proxy Handler
  const verifyHandler = async (req: express.Request, res: express.Response) => {
    const brn = (req.query.brn || req.body?.brn || '') as string;
    const dob = (req.query.dob || req.body?.dob || '') as string;

    const result = await handleVerifyRequest(brn, dob);
    if (result.success) {
      searchCount++;
    }
    res.status(result.status || 200).json(result);
  };

  app.get('/api/verify', verifyHandler);
  app.get('/api/verify-birth-record', verifyHandler);

  // Serve static assets or Vite dev middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

