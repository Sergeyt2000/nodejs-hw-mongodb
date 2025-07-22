import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getEnvVariable } from './utils/getEnvVariable.js';
import ContactsRouter from './routers/contacts.js';
import AuthRouter from './routers/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';


dotenv.config();
const PORT = getEnvVariable('PORT') || 3000;

export function setupServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to contacts DataBase!' });
  });

  app.use('/auth', AuthRouter);

  app.use('/contacts', ContactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
  return app;
}
