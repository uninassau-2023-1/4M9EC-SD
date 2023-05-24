import { PrismaClient, Ticket, TicketType } from '@prisma/client';
import { format } from 'date-fns';

const priority = {
  SE: 0,
  SP: 1,
  SG: 2,
};

function sortTickets(tickets: Ticket[], priority: Ticket['role'][]) {
  return tickets.sort((a, b) => {
    if (a.role === priority[0]) {
      return -1;
    } else if (b.role === priority[0]) {
      return 1;
    } else if (a.role === priority[1]) {
      return -1;
    } else if (b.role === priority[1]) {
      return 1;
    } else {
      return 0;
    }
  });
}

export const getWindows = async (prisma: PrismaClient) => {
  const windows = await prisma.window.findMany({
    include: {
      Ticket: {
        select: {
          id: true,
          code: true,
          status: true,
          role: true,
          created_at: true,
          started_at: true,
          finished_at: true,
        },
      },
    },
  });

  const output = [];

  for await (const window of windows) {
    output.push({
      sg: await prisma.ticket.count({
        where: { window_id: window.id, role: 'SG' },
      }),
      sp: await prisma.ticket.count({
        where: { window_id: window.id, role: 'SP' },
      }),
      se: await prisma.ticket.count({
        where: { window_id: window.id, role: 'SE' },
      }),
      total: window.Ticket.length,
      ...window,
    });
  }

  return output;
};

export const getStatus = async (prisma: PrismaClient) => {
  const windows = await getWindows(prisma);

  const ticketsRole = await prisma.ticket.groupBy({
    by: ['role'],
    _count: {
      role: true,
    },
  });

  const ticketsStatus = await prisma.ticket.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  });

  const ticketCount = await prisma.ticket.count();

  return {
    windows,
    metrics: {
      byRole: ticketsRole.map((ticket) => {
        return {
          title: ticket.role,
          count: ticket._count.role,
        };
      }),
      byStatus: ticketsStatus.map((ticket) => {
        return {
          title: ticket.status,
          count: ticket._count.status,
        };
      }),
      total: ticketCount,
    },
  };
};

export const getTickets = async (prisma: PrismaClient) => {
  const tickets = await prisma.ticket.findMany({
    include: {
      window: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      NOT: {
        status: 'WAITING',
      },
    },
    orderBy: {
      started_at: 'desc',
    },
    skip: 0,
    take: 5,
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
      window_id: window.id,
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

  if (tickets.length === 0) throw 'no tickets';

  let output: Ticket[] = [];

  const previousTicket = await prisma.ticket.findFirst({
    where: {
      window_id: window.id,
      status: 'FINISHED',
    },
    orderBy: {
      finished_at: 'desc',
    },
  });

  if (previousTicket) {
    if (previousTicket.role === 'SP') {
      output = sortTickets(tickets, ['SE', 'SG']);
    } else {
      output = sortTickets(tickets, ['SP', 'SP']);
    }
  } else {
    output = sortTickets(tickets, ['SP', 'SE']);
  }

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
