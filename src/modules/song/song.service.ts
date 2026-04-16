import { prisma } from "../../config/db";
import { AppError } from "../../common/errors/appError";
import { generateFileHash } from "../../common/utils/fileHash";
import { redis } from "../../config/redis";
import { esClient } from "../../config/elasticsearch";

export const createSong = async (data: {
  title: string;
  artist: string;
  fileUrl: string;
  uploadedBy: string;
  albumId: string;
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
  try {
    await esClient.index({
      index: "songs",
      id: song.id,
      document: {
        title: song.title,
        artist: song.artist,
        albumId: song.albumId,
      },
    });
  } catch (error) {
    console.error("Elasticsearch indexing failed:", error.message);
  }

  return song;
};

export const getSongById = async (id: string) => {
  const cacheKey = `song:${id}`;

  // 1. Check cache
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  // 2. DB fallback
  const song = await prisma.song.findUnique({
    where: { id },
  });

  if (!song) return null;

  // 3. Store in cache (TTL 1 hour)
  await redis.set(cacheKey, JSON.stringify(song), "EX", 3600);

  return song;
};

export const searchSongs = async (query: string) => {
  const result = await esClient.search({
    index: "songs",
    query: {
      multi_match: {
        query,
        fields: ["title", "artist"],
        fuzziness: "AUTO",
      },
    },
  });

  return result.hits.hits.map((hit: any) => ({
    id: hit._id,
    ...hit._source,
  }));
};

export const getAllSongs = async (query: any) => {
  const { page = 1, limit = 10, search, artist, albumId } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { artist: { contains: search, mode: "insensitive" } },
    ];
  }

  if (artist) {
    where.artist = { contains: artist, mode: "insensitive" };
  }

  if (albumId) {
    where.albumId = albumId;
  }

  const [songs, total] = await Promise.all([
    prisma.song.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        album: true,
      },
    }),
    prisma.song.count({ where }),
  ]);

  return {
    songs,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};
