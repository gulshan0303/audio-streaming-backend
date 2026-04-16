import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import songRoutes from "../modules/song/song.routes";
import albumRoutes from "../modules/album/album.routes";
import likeRoutes from "../modules/like/like.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/songs", songRoutes);
router.use("/albums", albumRoutes);
router.use("/likes", likeRoutes);

export default router;
