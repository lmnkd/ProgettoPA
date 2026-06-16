import { Router } from "express";
import { userController } from "../controller/UserController";
import { checkJwt } from "../middleware/auth.middleware";
import { checkPermission } from "../middleware/roles.middleware";

const router = Router();

// POST /api/users — crea utente (solo admin)
router.post("/", checkJwt, checkPermission("write:data"), userController.createUser.bind(userController));

// GET /api/users — tutti gli utenti (autenticati)
router.get("/", checkJwt, userController.getAllUsers.bind(userController));

// GET /api/users/:id — utente per id (autenticati)
router.get("/:id", checkJwt, userController.getUserById.bind(userController));

// PUT /api/users/:id — aggiorna utente (solo admin)
router.put("/:id", checkJwt, checkPermission("write:data"), userController.updateUser.bind(userController));

// DELETE /api/users/:id — elimina utente (solo admin)
router.delete("/:id", checkJwt, checkPermission("read:data"), userController.deleteUser.bind(userController));

export default router;