import { Router } from "express";
import { problemController } from "../controllers/problemController.js";
import { requireAuth, authorize, validateBody } from "../middlewares/index.js";
import {
  createProblemSchema,
  updateProblemSchema,
  reviewProblemSchema,
  featureProblemSchema,
} from "../validators/schemas.js";

const router = Router();

router.get("/", problemController.getPublicProblems);

router.get("/featured", problemController.getFeaturedProblems);

router.get("/recent", problemController.getRecentProblems);

router.get("/stats/public", problemController.getPublicStats);

router.get("/:id", problemController.getPublicProblemById);

export default router;
