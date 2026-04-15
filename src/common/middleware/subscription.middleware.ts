import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";
import { prisma } from "../../config/db";

export const requireSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sub = await prisma.subscription.findFirst({
    where: {
      userId: req.user.id,
      status: "active",
    },
  });

  if (!sub) {
    throw new AppError("Subscription required", 403);
  }

  next();
};
