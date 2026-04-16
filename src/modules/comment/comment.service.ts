import { AppError } from "../../common/errors/appError";
import { prisma } from "../../config/db";

export const createComment = async (
  userId: string,
  songId: string,
  content: string,
  parentId?: string,
) => {
  // check song exists
  const song = await prisma.song.findUnique({ where: { id: songId } });

  if (!song) throw new AppError("Song not found", 404);

  // if reply, check parent exists
  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      throw new AppError("Parent comment not found", 404);
    }
  }

  return prisma.comment.create({
    data: {
      userId,
      songId,
      content,
      parentId,
    },
  });
};

export const getCommentsBySong = async (songId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      songId,
      parentId: null, // only root comments
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};

export const deleteComment = async (
  commentId: string,
  userId: string,
  role: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new AppError("Comment not found", 404);

  // allow owner or admin
  if (comment.userId !== userId && role !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return { message: "Comment deleted" };
};
