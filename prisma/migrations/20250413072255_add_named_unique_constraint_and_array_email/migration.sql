/*
  Warnings:

  - The `emailCompromised` column on the `UserBreach` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserBreach" DROP COLUMN "emailCompromised",
ADD COLUMN     "emailCompromised" TEXT[];
