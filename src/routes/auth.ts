import { Router } from "express";
import { authController } from "../controller/AuthController";
import { userController } from "../controller/UserController";

const router = Router();


// Rotta per il login
router.post("/auth/login", authController.login);

// Rotta per creazione user o operator
router.post("/users", userController.createUser);

export default router;