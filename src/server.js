import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getEnvVariable } from './utils/getEnvVariable.js';
import ContactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
// import { getAllContacts, getContactById } from './services/contacts.js';

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

  // app.get('/contacts', async (req, res) => {
  //   const contacts = await getAllContacts();
  //   res.json({
  //     status: 200,
  //     message: 'Successfully found contacts!',
  //     data: contacts,
  //   });
  // });

  // app.get('/contacts/:contactId', async (req, res) => {
  //   const contactId = req.params.contactId;
  //   console.log(`Fetching contact with ID: ${contactId}`);
  //   const contact = await getContactById(contactId);

  //   if (!contact) {
  //     res.status(404).json({
  //       message: 'Contact not found',
  //     });
  //     return;
  //   }

  //   res.json({
  //     status: 200,
  //     message: `Successfully found contact with id ${contactId}!`,
  //     data: contact,
  //   });
  // });

  app.use(ContactsRouter);

  // app.use((req, res, next) => {
  //   res.status(404).json({
  //     message: 'Not found',
  //   });
  // });
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
