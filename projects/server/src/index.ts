import { BASE_URL, PORT } from '@/config/serverConfig';
import proxyRoutes from '@/routes/proxyRoutes';
import express from 'express';

const app = express();

app.use(proxyRoutes);

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando em ${BASE_URL}`);
});
