import express from "express";
import {
  likeSongController,
  unlikeSongController,
  getLikedSongsController,
} from "./like.controller";

import { authenticate } from "../../common/middleware/auth.middleware";

const router = express.Router();

router.post("/like", authenticate, likeSongController);
router.delete("/unlike", authenticate, unlikeSongController);
router.get("/", authenticate, getLikedSongsController);

export default router;
