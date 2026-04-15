import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { sendResponse } from "../../common/utils/response";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await registerUser(email, password);

  return sendResponse(res, user, "User registered successfully");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await loginUser(email, password);

  return sendResponse(res, result, "Login successful");
};
