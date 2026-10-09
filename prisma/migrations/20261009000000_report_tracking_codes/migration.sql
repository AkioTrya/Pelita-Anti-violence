ALTER TABLE "Report" ADD COLUMN "trackingCode" TEXT;

UPDATE "Report"
SET "trackingCode" = 'PLT-' || EXTRACT(YEAR FROM "createdAt")::INTEGER::TEXT || '-' || UPPER("id");

ALTER TABLE "Report" ALTER COLUMN "trackingCode" SET NOT NULL;

CREATE UNIQUE INDEX "Report_trackingCode_key" ON "Report"("trackingCode");
