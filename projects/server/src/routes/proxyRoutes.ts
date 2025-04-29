import ProxyController from '@/controllers/ProxyController';
import Proxy from '@/core/proxy/Proxy';
import { Router } from 'express';

const proxy = new Proxy();
const proxyController = new ProxyController(proxy);

const router = Router();

router.get('/{*url}', proxyController.handle.bind(proxyController));

export default router;
