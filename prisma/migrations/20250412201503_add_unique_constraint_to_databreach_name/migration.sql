/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `DataBreach` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataBreach_name_key" ON "DataBreach"("name");
