import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import songRoutes from "../modules/song/song.routes";
import albumRoutes from "../modules/album/album.routes";
import likeRoutes from "../modules/like/like.routes";
import playListRoutes from "../modules/playlist/playlist.routes";
import commentRoutes from "../modules/comment/comment.routes";
import shareRoutes from "../modules/share/share.routes";
import recommendationeRoutes from "../modules/recommendation/recommendation.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/songs", songRoutes);
router.use("/albums", albumRoutes);
router.use("/likes", likeRoutes);
router.use("/playlists", playListRoutes);
router.use("/comments", commentRoutes);
router.use("/share", shareRoutes);
router.use("/recommendation", recommendationeRoutes);

export default router;
