import { Router } from "express";
import { problemController } from "../controllers/problemController.js";
import { organizationController } from "../controllers/organizationController.js";
import { adminController } from "../controllers/adminController.js";
import { requireAuth, authorize, validateBody } from "../middlewares/index.js";
import {
  reviewProblemSchema,
  featureProblemSchema,
  verifyOrganizationSchema,
} from "../validators/schemas.js";

const router = Router();

router.use(requireAuth, authorize("admin"));

router.get("/dashboard", adminController.getDashboard);

router.get("/problems", problemController.getAllProblems);
router.get("/problems/pending", problemController.getPendingProblems);
router.get("/problems/stats", problemController.getStats);
router.get("/problems/:id", problemController.getProblemById);
router.post(
  "/problems/:id/review",
  validateBody(reviewProblemSchema),
  problemController.reviewProblem,
);
router.post(
  "/problems/:id/feature",
  validateBody(featureProblemSchema),
  problemController.setFeatured,
);

router.get("/organizations", organizationController.getOrganizations);
router.get("/organizations/stats", organizationController.getStats);
router.get("/organizations/:id", organizationController.getOrganizationById);
router.post(
  "/organizations/:id/verify",
  validateBody(verifyOrganizationSchema),
  organizationController.verifyOrganization,
);

router.get("/audit", adminController.getAuditLogs);
router.get("/activity", adminController.getRecentActivity);

export default router;
