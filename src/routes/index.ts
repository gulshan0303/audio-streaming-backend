import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import songRoutes from "../modules/song/song.routes";
import albumRoutes from "../modules/album/album.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/songs", songRoutes);
router.use("/albums", albumRoutes);

export default router;
