import { Router } from "express";
import { authController } from "../controller/AuthController";
import { userController } from "../controller/UserController";
import { checkEmailNotExists } from "../middleware/user.middleware";
import { requireRole } from "../middleware/auth.middleware";

const router = Router();


// Rotta per il login
router.post("/auth/login", authController.login);

// Rotta per creazione user o operator
// routes/auth.ts
router.post("/users", checkEmailNotExists, requireRole("admin"), userController.createUser);
export default router;