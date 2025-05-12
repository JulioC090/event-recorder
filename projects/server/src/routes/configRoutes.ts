import { IServerOptions } from '@/core/server/Server';
import { Request, Response, Router } from 'express';

export default function configRoutesSetup(config: IServerOptions) {
  const router = Router();

  router.get('/config', async (req: Request, res: Response): Promise<void> => {
    res.status(200).send(config);
  });

  return router;
}
