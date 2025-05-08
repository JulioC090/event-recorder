import proxyRoutes from '@/routes/proxyRoutes';
import { staticPath } from '@event-recorder/static';
import express from 'express';
import path from 'node:path';

type IServerOptions = {
  port: number;
};

export default class Server {
  private app = express();

  constructor(private options: IServerOptions) {
    this.app = express();
    this.setup();
  }

  private setup() {
    this.app.use(express.static(staticPath));

    this.app.use(proxyRoutes);

    this.app.get('/{*path}', (req, res) => {
      res.sendFile(path.join(staticPath, 'index.html'));
    });
  }

  public start() {
    this.app.listen(this.options.port, () => {
      console.log(
        `🟢 Servidor rodando em http://localhost:${this.options.port}`,
      );
    });
  }
}
