import { PORT } from '@/config/serverConfig';
import Server from '@/core/server/Server';

const server = new Server({ port: PORT });
server.start();
