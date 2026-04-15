import { NextFunction, Response, Request } from "express";

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
        error,
      });
    }

    next();
  };
