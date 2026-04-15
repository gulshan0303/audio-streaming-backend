import { Request, Response, NextFunction } from "express";
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  // Prisma duplicate error
  if (err.code === "P2002") {
    return res.status(400).json({
      success: false,
      message: "Duplicate entry",
      data: null,
      error: err,
    });
  }

  // File size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too large",
      data: null,
      error: err,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
    error: err,
  });
};
