import express from "express";
import {
  shareSongController,
  getShareStatsController,
} from "./share.controller";

import { authenticate } from "../../common/middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, shareSongController);

router.get("/:songId", getShareStatsController);

export default router;
