import { Request, Response } from "express";
import { sendResponse } from "../../common/utils/response";
import { getLikedSongs, likeSong, unlikeSong } from "./like.service";
import { AuthRequest } from "../../types/express";

export const likeSongController = async (req: AuthRequest, res: Response) => {
  const { songId } = req.body;

  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const result = await likeSong(req.user.id, songId);

  return sendResponse(res, result, "Song liked");
};

export const unlikeSongController = async (req: any, res: Response) => {
  const { songId } = req.body;

  const result = await unlikeSong(req.user.id, songId);

  return sendResponse(res, result);
};

export const getLikedSongsController = async (req: any, res: Response) => {
  const songs = await getLikedSongs(req.user.id);

  return sendResponse(res, songs);
};
