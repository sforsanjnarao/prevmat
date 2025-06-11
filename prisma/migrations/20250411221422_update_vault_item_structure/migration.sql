/*
  Warnings:

  - You are about to drop the column `encryptedPassword` on the `VaultItem` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `VaultItem` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `VaultItem` table. All the data in the column will be lost.
  - Added the required column `encryptedData` to the `VaultItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VaultItem" DROP COLUMN "encryptedPassword",
DROP COLUMN "notes",
DROP COLUMN "username",
ADD COLUMN     "encryptedData" TEXT NOT NULL;
