-- CreateEnum
CREATE TYPE "public"."ToolType" AS ENUM ('SYSTEMIC', 'MANUAL');

-- CreateEnum
CREATE TYPE "public"."ProcessStatus" AS ENUM ('PLANNED', 'ACTIVE', 'BLOCKED', 'DONE');

-- CreateTable
CREATE TABLE "public"."Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ToolType" NOT NULL,
    "url" TEXT,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Process" (
    "id" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "parentId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."ProcessStatus" NOT NULL DEFAULT 'PLANNED',
    "importance" INTEGER NOT NULL DEFAULT 0,
    "responsibleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToolOnProcess" (
    "processId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ToolOnProcess_pkey" PRIMARY KEY ("processId","toolId")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "public"."Person"("email");

-- AddForeignKey
ALTER TABLE "public"."Process" ADD CONSTRAINT "Process_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Process" ADD CONSTRAINT "Process_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Process"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Process" ADD CONSTRAINT "Process_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "public"."Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolOnProcess" ADD CONSTRAINT "ToolOnProcess_processId_fkey" FOREIGN KEY ("processId") REFERENCES "public"."Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolOnProcess" ADD CONSTRAINT "ToolOnProcess_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "public"."Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_processId_fkey" FOREIGN KEY ("processId") REFERENCES "public"."Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
