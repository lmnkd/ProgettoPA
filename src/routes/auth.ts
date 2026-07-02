import { Router } from "express";
import { authController } from "../controller/AuthController";
import { userController } from "../controller/UserController";
import { checkCfNotExists, checkEmailNotExists } from "../middleware/user.middleware";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();


// Rotta per il login
router.post("/auth/login", authController.login);

// Rotta per creazione user o operator
// routes/auth.ts
router.post("/users", authenticate, requireRole("admin"), checkCfNotExists, checkEmailNotExists,  userController.createUser);
export default router;