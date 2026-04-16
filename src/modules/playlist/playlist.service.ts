import { AppError } from "../../common/errors/appError";
import { prisma } from "../../config/db";

export const createPlaylist = async (userId: string, name: string) => {
  return prisma.playlist.create({
    data: {
      name,
      userId,
    },
  });
};

export const addSongToPlaylist = async (
  playlistId: string,
  songId: string,
  userId: string,
) => {
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
  });

  if (!playlist) throw new AppError("Playlist not found", 404);

  if (playlist.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  try {
    return await prisma.playlistSong.create({
      data: {
        playlistId,
        songId,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new AppError("Song already in playlist", 400);
    }
    throw error;
  }
};

export const removeSongFromPlaylist = async (
  playlistId: string,
  songId: string,
  userId: string,
) => {
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
  });

  if (!playlist) throw new AppError("Playlist not found", 404);

  if (playlist.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  await prisma.playlistSong.delete({
    where: {
      playlistId_songId: {
        playlistId,
        songId,
      },
    },
  });

  return { message: "Removed from playlist" };
};

export const getPlaylistById = async (id: string) => {
  const playlist = await prisma.playlist.findUnique({
    where: { id },
    include: {
      songs: {
        include: {
          song: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }

  return {
    ...playlist,
    songs: playlist.songs.map((ps) => ps.song),
  };
};

export const getUserPlaylists = async (userId: string) => {
  return prisma.playlist.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};
