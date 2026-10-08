ALTER TABLE "Ticket"
ADD COLUMN "channel" TEXT NOT NULL DEFAULT 'general';

UPDATE "Ticket"
SET "channel" = 'bk'
WHERE "title" ILIKE '%guru bk%';

UPDATE "Ticket"
SET "channel" = 'peer'
WHERE "title" ILIKE '%teman sebaya%';
