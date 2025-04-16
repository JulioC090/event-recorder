import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.get('/', async (req: Request, res: Response): Promise<void> => {
  res.status(200).send('hello');
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando em http://localhost:${PORT}`);
});
