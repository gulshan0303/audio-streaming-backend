import { AppError } from "../errors/appError";

export const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    console.log("req.user :>> ", req.user);
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }

    next();
  };
};
