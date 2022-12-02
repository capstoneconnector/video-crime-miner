import express, { Express, Request, Response } from '@types/express'
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env['PORT'];

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[Node Server]: Server is running at https://localhost:${port}`);
});