-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Comment_songId_idx" ON "Comment"("songId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");
