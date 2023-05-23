-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('SP', 'SG', 'SE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('WAITING', 'WORKING', 'FINISHED');

-- CreateTable
CREATE TABLE "Window" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Window_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "role" "TicketType" NOT NULL DEFAULT 'SG',
    "status" "Status" NOT NULL DEFAULT 'WAITING',
    "window_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_window_id_fkey" FOREIGN KEY ("window_id") REFERENCES "Window"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
