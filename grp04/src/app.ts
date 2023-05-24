import express from 'express';
import cors from 'cors';
import WebSocket from 'ws';

import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';
import { log } from 'console';
import {
  createTicket,
  getStatus,
  getTickets,
  getWindows,
  requestTicket,
} from './actions';

const app = express();
const server = new WebSocket.Server({ port: 3000 });

const PORT = process.env.PORT;
const prisma = new PrismaClient();
const updateEmitter = new EventEmitter();

const main = async () => {
  app.use(cors(), express.json());

  app.get('/', (_req, res) => {
    res.status(444).send();
  });

  app.get('/status', async (_req, res) => {
    await getStatus(prisma)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(401).json({
          err,
        });
      });
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
    await getTickets(prisma)
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
          updateEmitter.emit('requestTicket', JSON.stringify(data));
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

const startWs = () => {
  server.on('connection', (socket) => {
    log('Novo cliente WebSocket conectado!');

    updateEmitter.on('requestTicket', (ticket) => {
      log(`Senha solicitada para atendimento`);
      socket.send(ticket);
    });

    socket.on('close', () => {
      log('Cliente WebSocket desconectado!');
    });
  });
};

main();
startWs();
