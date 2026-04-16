import { AppError } from "../../common/errors/appError";
import { prisma } from "../../config/db";

export const shareSong = async (
  userId: string,
  songId: string,
  platform?: string,
) => {
  // check song
  const song = await prisma.song.findUnique({
    where: { id: songId },
  });

  if (!song) throw new AppError("Song not found", 404);

  // store share event
  await prisma.share.create({
    data: {
      userId,
      songId,
      platform,
    },
  });

  // increment share count
  await prisma.song.update({
    where: { id: songId },
    data: {
      shareCount: {
        increment: 1,
      },
    },
  });

  // 🔗 generate link
  const shareUrl = `${process.env.APP_URL}/songs/${songId}`;

  return {
    shareUrl,
  };
};

export const getShareStats = async (songId: string) => {
  const count = await prisma.share.count({
    where: { songId },
  });

  return { count };
};
