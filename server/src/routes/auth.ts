import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { requireAuth, validateBody } from "../middlewares/index.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);

router.post(
  "/login/organization",
  validateBody(loginSchema),
  authController.loginOrganization,
);

router.post(
  "/login/admin",
  validateBody(loginSchema),
  authController.loginAdmin,
);

router.post("/refresh", authController.refresh);

router.get("/me", requireAuth, authController.me);

router.post("/logout", requireAuth, authController.logout);

export default router;
