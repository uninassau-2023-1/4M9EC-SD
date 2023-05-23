import { PrismaClient, TicketType } from '@prisma/client';
import { format } from 'date-fns';

const priority = {
  SE: 0,
  SP: 1,
  SG: 2,
};

export const getWindows = async (prisma: PrismaClient) => {
  const windows = await prisma.window.findMany({
    include: {
      Ticket: {
        select: {
          id: true,
          code: true,
          created_at: true,
          finished_at: true,
          role: true,
        },
      },
    },
  });

  const output = windows.map((window) => {
    return {
      ...window,
      total: window.Ticket.length,
    };
  });

  return output;
};

export const getPreviousTickets = async (prisma: PrismaClient) => {
  const tickets = await prisma.ticket.findMany({
    where: {
      NOT: {
        status: 'WAITING',
      },
    },
  });

  return tickets;
};

export const createTicket = async (prisma: PrismaClient, role: TicketType) => {
  const date = format(new Date(), 'yyMMdd');

  const ticket = await prisma.ticket.create({
    data: {
      code: `${date}-${role}${priority[role]}`,
      role,
    },
  });
  return ticket;
};

export const requestTicket = async (
  prisma: PrismaClient,
  window_id: string
) => {
  const window = await prisma.window.findUniqueOrThrow({
    where: {
      id: window_id,
    },
  });

  await prisma.ticket.updateMany({
    data: {
      status: 'FINISHED',
      finished_at: new Date(),
    },
    where: {
      id: window.id,
      status: 'WORKING',
    },
  });

  const tickets = await prisma.ticket.findMany({
    where: {
      status: 'WAITING',
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  const output = tickets.sort((a, b) => {
    if (a.role === 'SE') {
      return -1;
    } else if (b.role === 'SE') {
      return 1;
    } else if (a.role === 'SP') {
      return -1;
    } else if (b.role === 'SP') {
      return 1;
    } else {
      return 0;
    }
  });

  const ticket = await prisma.ticket.update({
    data: {
      status: 'WORKING',
      started_at: new Date(),
      window_id: window.id,
    },
    where: {
      id: output[0].id,
    },
  });

  return {
    ...ticket,
    window: window,
  };
};
