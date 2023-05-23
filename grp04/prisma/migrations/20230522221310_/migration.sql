-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_window_id_fkey";

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "window_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_window_id_fkey" FOREIGN KEY ("window_id") REFERENCES "Window"("id") ON DELETE SET NULL ON UPDATE CASCADE;
