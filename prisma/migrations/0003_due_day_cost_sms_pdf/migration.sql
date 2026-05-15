ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "rentDueDay" INTEGER;
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "rentDueDay" INTEGER;
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "smsOptIn" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Lease" ADD COLUMN IF NOT EXISTS "rentDueDay" INTEGER;
ALTER TABLE "MaintenanceRequest" ADD COLUMN IF NOT EXISTS "cost" DECIMAL(10,2);

UPDATE "Property"
SET "rentDueDay" = LEAST(GREATEST(substring(notes from 'Rent due day: ([0-9]+)')::integer, 1), 31)
WHERE "rentDueDay" IS NULL
  AND notes ~ 'Rent due day: [0-9]+';

UPDATE "Lease" l
SET "rentDueDay" = p."rentDueDay",
    "templateId" = COALESCE(l."templateId", 'florida-long-term-v1')
FROM "Property" p
WHERE l."propertyId" = p.id
  AND (l."rentDueDay" IS NULL OR l."templateId" IS NULL);

UPDATE "Tenant" t
SET "rentDueDay" = x."rentDueDay"
FROM (
  SELECT DISTINCT ON (lt."tenantId") lt."tenantId", l."rentDueDay"
  FROM "LeaseTenant" lt
  JOIN "Lease" l ON l.id = lt."leaseId"
  WHERE l."rentDueDay" IS NOT NULL
  ORDER BY lt."tenantId", lt."primary" DESC
) x
WHERE t.id = x."tenantId"
  AND t."rentDueDay" IS NULL;
