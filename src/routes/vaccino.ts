import { Router } from "express";
import { vaccinoController } from "../controller/VaccinoController";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/creavaccino", authenticate, requireRole("operator"), vaccinoController.createVaccino);
router.get("/readAllVaccini", authenticate, requireRole("operator"), vaccinoController.getAllVaccini);
router.get("/:id", authenticate, requireRole("operator"), vaccinoController.getVaccinoById);
router.get("/:nome", authenticate, requireRole("operator"), vaccinoController.getVaccinoByNome);
router.put("/:id", authenticate, requireRole("operator"), vaccinoController.updateVaccino);
router.delete("/:id", authenticate, requireRole("operator"), vaccinoController.deleteVaccino);

export default router