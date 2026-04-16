import { Router } from "express";
import { upload } from "../../infrastructure/storage/local.storage";
import {
  searchSongsController,
  streamSong,
  uploadSong,
} from "./song.controller";
import { authenticate } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import rateLimit from "express-rate-limit";
import { authorize } from "../../common/middleware/rbac.middleware";

const router = Router();

//per-route limits
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // only 10 uploads
});

export const streamLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100, // streaming allowed
});

router.post(
  "/upload",
  uploadLimiter,
  authenticate,
  // authorize("admin"),
  upload.single("audio"),
  asyncHandler(uploadSong),
);
router.get("/:id/stream", streamLimiter, asyncHandler(streamSong));
router.get("/search", asyncHandler(searchSongsController));
//router.get('/premium-stream', authenticate, requireSubscription, streamSong);

export default router;
