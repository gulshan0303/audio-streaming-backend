import { Request, Response } from "express";
import { sendResponse } from "../../common/utils/response";
import { AuthRequest } from "../../types/express";
import {
  createComment,
  deleteComment,
  getCommentsBySong,
} from "./comment.service";

export const createCommentController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { songId, content, parentId } = req.body;
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const comment = await createComment(req.user.id, songId, content, parentId);

  return sendResponse(res, comment, "Comment added");
};

export const getCommentsController = async (req: Request, res: Response) => {
  const { songId } = req.params;

  const comments = await getCommentsBySong(songId);

  return sendResponse(res, comments);
};

export const deleteCommentController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { id } = req.params as { id: string };
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const result = await deleteComment(id, req.user.id, req.user.role);

  return sendResponse(res, result);
};
