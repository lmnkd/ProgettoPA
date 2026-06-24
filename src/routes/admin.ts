import { Router } from "express";
import { adminController } from "../controller/AdminController";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();


router.get('/admin/addToken/:cf', authenticate, requireRole("admin"), adminController.increaseUserTokens)

export default router;
