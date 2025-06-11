-- AlterTable
ALTER TABLE "App" ADD COLUMN     "breachCount" INTEGER,
ADD COLUMN     "hasKnownBreaches" BOOLEAN,
ADD COLUMN     "lastBreachCheck" TIMESTAMP(3);
