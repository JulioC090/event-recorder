import { dirname, join } from 'path';

const __dirname = dirname(__filename);

export const staticPath = join(__dirname, '..', 'dist', 'public');
