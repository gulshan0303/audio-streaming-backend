import { AppError } from "../../common/errors/appError";
import { prisma } from "../../config/db";

export const likeSong = async (userId: string, songId: string) => {
  // check song exists
  const song = await prisma.song.findUnique({ where: { id: songId } });

  if (!song) {
    throw new AppError("Song not found", 404);
  }

  try {
    return await prisma.like.create({
      data: {
        userId,
        songId,
      },
    });
  } catch (error: any) {
    // duplicate like
    if (error.code === "P2002") {
      throw new AppError("Song already liked", 400);
    }
    throw error;
  }
};

export const unlikeSong = async (userId: string, songId: string) => {
  const like = await prisma.like.findUnique({
    where: {
      userId_songId: {
        userId,
        songId,
      },
    },
  });

  if (!like) {
    throw new AppError("Like not found", 404);
  }

  await prisma.like.delete({
    where: {
      userId_songId: {
        userId,
        songId,
      },
    },
  });

  return { message: "Song unliked" };
};

export const getLikedSongs = async (userId: string) => {
  const likes = await prisma.like.findMany({
    where: { userId },
    include: {
      song: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return likes.map((like) => like.song);
};