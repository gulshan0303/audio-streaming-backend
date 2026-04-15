-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "fileHash" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Song_fileHash_key" ON "Song"("fileHash");

-- CreateIndex
CREATE UNIQUE INDEX "Song_title_artist_uploadedBy_key" ON "Song"("title", "artist", "uploadedBy");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
