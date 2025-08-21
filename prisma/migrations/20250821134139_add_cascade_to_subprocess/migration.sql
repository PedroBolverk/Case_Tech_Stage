/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Process` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Subprocess" DROP CONSTRAINT "Subprocess_processId_fkey";

-- AlterTable
ALTER TABLE "public"."Process" DROP COLUMN "createdAt";

-- AddForeignKey
ALTER TABLE "public"."Subprocess" ADD CONSTRAINT "Subprocess_processId_fkey" FOREIGN KEY ("processId") REFERENCES "public"."Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;
