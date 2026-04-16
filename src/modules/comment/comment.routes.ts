import express from "express";
import {
  createCommentController,
  getCommentsController,
  deleteCommentController,
} from "./comment.controller";

import { authenticate } from "../../common/middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createCommentController);

router.get("/:songId", getCommentsController);

router.delete("/:id", authenticate, deleteCommentController);

export default router;
