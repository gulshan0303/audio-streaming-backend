import { AppError } from "../../common/errors/appError";
import { prisma } from "../../config/db";

export const createAlbum = async (data: {
  title: string;
  artist: string;
  coverUrl?: string;
  createdBy: string;
}) => {
  return prisma.album.create({
    data,
  });
};

export const getAlbumById = async (id: string) => {
  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      songs: true,
    },
  });

  if (!album) {
    throw new AppError("Album not found", 404);
  }

  return album;
};

export const getAllAlbums = async (query: any) => {
  const { page = 1, limit = 10, search } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { artist: { contains: search, mode: "insensitive" } },
    ];
  }

  const [albums, total] = await Promise.all([
    prisma.album.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        songs: true,
      },
    }),
    prisma.album.count({ where }),
  ]);

  return {
    albums,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const updateAlbum = async (
  id: string,
  data: {
    title?: string;
    artist?: string;
    coverUrl?: string;
  },
) => {
  const existing = await prisma.album.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError("Album not found", 404);
  }

  return prisma.album.update({
    where: { id },
    data,
  });
};

export const deleteAlbum = async (id: string) => {
  const existing = await prisma.album.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError("Album not found", 404);
  }

  // 🔥 Optional: detach songs instead of delete
  await prisma.song.updateMany({
    where: { albumId: id },
    data: { albumId: null },
  });

  await prisma.album.delete({
    where: { id },
  });

  return { message: "Album deleted successfully" };
};
