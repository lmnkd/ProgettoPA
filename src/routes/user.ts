import { Router } from "express";
import { userController } from "../controller/UserController";
import { authenticate, requireRole } from "../middleware/auth.middleware";


const router = Router();

router.get("/coperturascaduta", authenticate, requireRole("operator"), userController.getUsersWithExpiredCoverage);

// Ottenere un USER
router.get("/:cf", authenticate, requireRole("operator"), userController.getUserById);

// ottenere tutti gli user
router.get("/", authenticate, requireRole("operator"), userController.getAllUsers);

// Cancellare un uSER o Operator
router.delete("/:cf", authenticate, requireRole("operator"), userController.deleteUser);

// Aggiornare un operatore
router.put("/:cf", authenticate, requireRole("operator"), userController.updateUser);





export default router;