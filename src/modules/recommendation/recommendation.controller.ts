res: Response;
import { Request, Response } from "express";
import { sendResponse } from "../../common/utils/response";
import { getRecommendations } from "./recommendation.service";
import { AuthRequest } from "../../types/express";

export const getRecommendationsController = async (
  req: AuthRequest,
  res: Response,
) => {
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const songs = await getRecommendations(req.user.id);

  return sendResponse(res, songs);
};
