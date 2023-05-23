import express from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
import { log } from 'console';
import {
  createTicket,
  getPreviousTickets,
  getWindows,
  requestTicket,
} from './actions';

const app = express();
const PORT = process.env.PORT;
const prisma = new PrismaClient();

const main = async () => {
  app.use(cors(), express.json());

  app.get('/', (_req, res) => {
    res.status(444).send();
  });

  app.get('/windows', async (_req, res) => {
    await getWindows(prisma)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(401).json({
          err,
        });
      });
  });

  app.get('/tickets', async (_req, res) => {
    await getPreviousTickets(prisma)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(401).json({
          err,
        });
      });
  });

  app.post('/ticket/add', async (req, res) => {
    const role = req.body.role;

    if (role) {
      await createTicket(prisma, role)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.status(401).json({
            err,
          });
        });
    } else {
      res.status(401).json({
        err: 'role missing.',
      });
    }
  });

  app.post('/ticket/request', async (req, res) => {
    const window = req.body.window_id;

    if (window) {
      await requestTicket(prisma, window)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.status(401).json({
            err,
          });
        });
    } else {
      res.status(401).json({
        err: 'window_id missing.',
      });
    }
  });

  app.listen(PORT, () => {
    log(`Server is running at http://localhost:${PORT} ⚡️`);
  });
};

main();
