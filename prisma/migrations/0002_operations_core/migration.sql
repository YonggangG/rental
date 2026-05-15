ALTER TYPE "ChargeStatus" ADD VALUE IF NOT EXISTS 'OVERDUE';

ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "marketValue" DECIMAL(12,2);

UPDATE "Property"
SET "marketValue" = substring(notes from 'Market value: \$([0-9]+(?:\.[0-9]+)?)')::numeric
WHERE "marketValue" IS NULL
  AND notes ~ 'Market value: \$[0-9]+';
