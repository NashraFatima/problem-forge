import { Router } from "express";
import authRoutes from "./auth.js";
import problemRoutes from "./problems.js";
import organizationRoutes from "./organization.js";
import adminRoutes from "./admin.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "DevThon API by DevUp Society is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/problems", problemRoutes);
router.use("/org", organizationRoutes);
router.use("/admin", adminRoutes);

export default router;
