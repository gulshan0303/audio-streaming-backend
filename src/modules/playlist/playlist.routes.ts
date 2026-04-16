import express from "express";
import {
  createPlaylistController,
  addSongController,
  removeSongController,
  getPlaylistController,
  getUserPlaylistsController,
} from "./playlist.controller";

import { authenticate } from "../../common/middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createPlaylistController);

router.post("/add-song", authenticate, addSongController);

router.delete("/remove-song", authenticate, removeSongController);
router.get("/:id", getPlaylistController);

router.get("/user/me", authenticate, getUserPlaylistsController);

export default router;
