import ProxyController from '@/controllers/ProxyController';
import Proxy from '@/core/proxy/Proxy';
import { Router } from 'express';

export default function proxyRouteSetup(baseUrl: string) {
  const proxy = new Proxy(baseUrl);
  const proxyController = new ProxyController(proxy);

  const router = Router();

  router.get('/http{*url}', proxyController.handle.bind(proxyController));

  return router;
}
