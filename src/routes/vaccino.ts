import { Router } from "express";
import { vaccinoController } from "../controller/VaccinoController";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/creavaccino", authenticate, vaccinoController.createVaccino)
router.get(":id", authenticate, vaccinoController.getVaccinoById);
router.get("/", authenticate, vaccinoController.getAllVaccini);
router.delete(":id", authenticate, vaccinoController.deleteVaccino)
router.put(":id", authenticate, vaccinoController.updateVaccino)

export default router