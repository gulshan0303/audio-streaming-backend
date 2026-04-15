import { Router } from "express";
import { upload } from "../../infrastructure/storage/local.storage";
import { streamSong, uploadSong } from "./song.controller";
import { authenticate } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/asyncHandler";

const router = Router();

router.post(
  "/upload",
  authenticate,
  upload.single("audio"),
  asyncHandler(uploadSong),
);
router.get("/:id/stream", asyncHandler(streamSong));
export default router;
