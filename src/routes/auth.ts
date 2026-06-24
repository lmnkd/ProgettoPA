import { Router } from "express";
import { authController } from "../controller/AuthController";
import { userController } from "../controller/UserController";

const router = Router();

router.post("/auth/login", authController.login);
router.post("/users", userController.createUser);

export default router;