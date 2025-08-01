import 'dotenv/config';
// import dotenv from 'dotenv';
// dotenv.config();
// import path from 'node:path';

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVariable } from './utils/getEnvVariable.js';
import ContactsRouter from './routers/contacts.js';
import AuthRouter from './routers/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

const PORT = getEnvVariable('PORT') || 3000;

export function setupServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  // app.use("/photo", express.static(path.resolve('src/temp')));

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
