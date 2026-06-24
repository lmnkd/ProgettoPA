import { Router } from "express";
import { userController } from "../controller/UserController";
import { authenticate, requireRole } from "../middleware/auth.middleware";


const router = Router();

router.get("/:cf", authenticate, userController.getUserById);
router.get("/", authenticate, requireRole("operator"), userController.getAllUsers);
router.delete("/:cf", authenticate, requireRole("operator"), userController.deleteUser);
router.put("/:cf", authenticate, requireRole("operator"), userController.updateUser);





export default router;