import IProxy from '@/types/IProxy';
import { Request, Response } from 'express';

export default class ProxyController {
  constructor(private proxy: IProxy) {}

  async handle(req: Request, res: Response): Promise<void> {
    const targetURL = req.url.slice(1);

    try {
      const { headers, body, stream, status } =
        await this.proxy.execute(targetURL);

      res.set(headers);
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', '*');

      res.status(status);

      if (stream) {
        stream.pipe(res);
        return;
      }

      res.send(body);
    } catch (e) {
      console.log(e);
    }
  }
}
