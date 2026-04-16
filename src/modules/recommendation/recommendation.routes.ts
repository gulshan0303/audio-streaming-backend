import express from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { getRecommendationsController } from "./recommendation.controller";

const router = express.Router();

router.get("/", authenticate, getRecommendationsController);

export default router;
