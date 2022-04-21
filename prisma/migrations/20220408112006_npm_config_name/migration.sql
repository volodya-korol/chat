/*
  Warnings:

  - The `isWrite` column on the `Member` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "isWrite",
ADD COLUMN     "isWrite" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isOnline" SET DEFAULT false;
