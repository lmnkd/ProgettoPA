import { Router } from "express";
import { authController } from "../controller/AuthController";
import { userController } from "../controller/UserController";
import { checkEmailNotExists } from "../middleware/user.middleware";

const router = Router();


// Rotta per il login
router.post("/auth/login", authController.login);

// Rotta per creazione user o operator
// routes/auth.ts
router.post("/users", checkEmailNotExists, userController.createUser);
export default router;