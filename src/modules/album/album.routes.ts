import { authenticate } from "../../common/middleware/auth.middleware";
import { authorize } from "../../common/middleware/rbac.middleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { Router } from "express";
import { imageUpload } from "../../infrastructure/storage/local.storage";
import {
  createAlbumController,
  deleteAlbumController,
  getAlbumController,
  getAllAlbumsController,
  updateAlbumController,
} from "./album.controller";
const router = Router();

router.post(
  "/create",
  authenticate,
  // authorize("admin"),
  imageUpload.single("cover"), // optional image
  asyncHandler(createAlbumController),
);

router.get("/:id", getAlbumController);

router.get("/", getAllAlbumsController);

router.put(
  "/:id",
  authenticate,
  // authorize("admin"),
  imageUpload.single("cover"),
  updateAlbumController,
);

router.delete("/:id", authenticate, authorize("admin"), deleteAlbumController);

export default router;
