import { BASE_URL, PORT } from '@/config/serverConfig';
import proxyRoutes from '@/routes/proxyRoutes';
import { staticPath } from '@event-recorder/client';
import express from 'express';
import path from 'node:path';

const app = express();

app.use(express.static(staticPath));

app.use(proxyRoutes);

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando em ${BASE_URL}`);
});
