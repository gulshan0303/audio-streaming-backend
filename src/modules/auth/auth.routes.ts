import { Router } from "express";
import { register, login } from "./auth.controller";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { loginSchema, registerSchema } from "./auth.validation";
import { validate } from "../../common/middleware/validate.middleware";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));

export default router;
