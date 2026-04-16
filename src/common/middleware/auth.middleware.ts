import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../types/express";
import { AppError } from "../errors/appError";

export const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // { id, role }
    next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
};

// export const authorize = (...roles: string[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       throw new AppError("Unauthorized", 401);
//     }

//     if (!roles.includes(req.user.role)) {
//       throw new AppError("Forbidden", 403);
//     }

//     next();
//   };
// };
