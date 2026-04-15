import { prisma } from "../../config/db";
import { AppError } from "../../common/errors/appError";
import { generateFileHash } from "../../common/utils/fileHash";

export const createSong = async (data: {
  title: string;
  artist: string;
  fileUrl: string;
  uploadedBy: string;
}) => {
  // 🔥 Generate file hash
  const fileHash = await generateFileHash(data.fileUrl);

  // 🔥 Check duplicate by hash
  const existing = await prisma.song.findFirst({
    where: {
      fileHash: fileHash,
    },
  });
  if (existing) {
    throw new AppError("This audio file already exists", 400);
  }

  const song = await prisma.song.create({
    data: {
      ...data,
      duration: 0,
      fileHash,
    },
  });

  return song;
};
