/*
  Warnings:

  - Added the required column `createdBy` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Song_createdAt_idx";

-- DropIndex
DROP INDEX "Song_title_artist_uploadedBy_key";

-- DropIndex
DROP INDEX "Song_uploadedBy_idx";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
