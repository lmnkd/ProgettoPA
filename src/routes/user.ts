import { Router } from "express";
import { userController } from "../controller/UserController";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { userExist } from "../middleware/redis.middleware";

const router = Router();

router.get("/coperturascaduta", authenticate, requireRole("operator", "admin"), userController.getUsersWithExpiredCoverage);

// Ottenere un USER
router.get("/:cf", authenticate, requireRole("operator", "admin"), userExist, userController.getUserById);

// ottenere tutti gli user
router.get("/", authenticate, requireRole("admin"), userController.getAllUsers);

// Cancellare un uSER o Operator
router.delete("/:cf", authenticate, requireRole("admin"), userExist, userController.deleteUser);

// Aggiornare un operatore
router.patch("/:cf", authenticate, requireRole("admin"), userExist, userController.updateUser);

export default router;