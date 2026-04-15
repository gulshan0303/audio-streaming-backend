import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import songRoutes from "../modules/song/song.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/songs", songRoutes);

export default router;
