import { Router } from "express";
import { problemController } from "../controllers/problemController.js";
import { organizationController } from "../controllers/organizationController.js";
import { requireAuth, authorize, validateBody } from "../middlewares/index.js";
import {
  createProblemSchema,
  updateProblemSchema,
  updateOrganizationSchema,
} from "../validators/schemas.js";

const router = Router();

router.use(requireAuth, authorize("organization"));

router.get("/dashboard", organizationController.getDashboard);

router.get("/profile", organizationController.getMyOrganization);
router.put(
  "/profile",
  validateBody(updateOrganizationSchema),
  organizationController.updateMyOrganization,
);

router.get("/problems", problemController.getMyProblems);
router.post(
  "/problems",
  validateBody(createProblemSchema),
  problemController.createProblem,
);
router.put(
  "/problems/:id",
  validateBody(updateProblemSchema),
  problemController.updateProblem,
);
router.delete("/problems/:id", problemController.deleteProblem);

export default router;
