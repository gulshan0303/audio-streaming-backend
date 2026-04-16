import { Request, Response } from "express";
import { sendResponse } from "../../common/utils/response";
import { AuthRequest } from "../../types/express";
import { getShareStats, shareSong } from "./share.service";

export const shareSongController = async (req: AuthRequest, res: Response) => {
  const { songId, platform } = req.body;
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const result = await shareSong(req.user.id, songId, platform);

  return sendResponse(res, result, "Share link generated");
};

export const getShareStatsController = async (req: Request, res: Response) => {
  const { songId } = req.params as { songId: string };

  const stats = await getShareStats(songId);

  return sendResponse(res, stats);
};
