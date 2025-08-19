/*
  Warnings:

  - You are about to drop the column `parentId` on the `Process` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Process" DROP CONSTRAINT "Process_parentId_fkey";

-- AlterTable
ALTER TABLE "public"."Process" DROP COLUMN "parentId";

-- CreateTable
CREATE TABLE "public"."Subprocess" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "public"."ProcessStatus" NOT NULL,
    "processId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subprocess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Subprocess" ADD CONSTRAINT "Subprocess_processId_fkey" FOREIGN KEY ("processId") REFERENCES "public"."Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
