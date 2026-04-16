import { prisma } from "../../config/db";

export const getRecommendations = async (userId: string) => {
  // 1️⃣ get liked songs
  const likes = await prisma.like.findMany({
    where: { userId },
    include: { song: true },
  });

  const likedSongIds = likes.map((l) => l.songId);
  const likedArtists = likes.map((l) => l.song.artist);

  // 2️⃣ recommend similar artist songs
  const similarSongs = await prisma.song.findMany({
    where: {
      artist: { in: likedArtists },
      id: { notIn: likedSongIds },
    },
    take: 20,
  });

  // 3️⃣ popular songs (by shareCount)
  const popularSongs = await prisma.song.findMany({
    orderBy: {
      shareCount: "desc",
    },
    take: 20,
  });

  // 4️⃣ merge + dedupe
  const map = new Map();

  [...similarSongs, ...popularSongs].forEach((song) => {
    if (!map.has(song.id)) {
      map.set(song.id, song);
    }
  });

  return Array.from(map.values()).slice(0, 20);
};
