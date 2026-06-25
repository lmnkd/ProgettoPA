import { Router } from "express";
import { vaccinoController } from "../controller/VaccinoController";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();


// Creazione vaccino (ci può essere solo una tipologia di vaccino, i nomi non si possono ripetere)
router.post("/creavaccino", authenticate, requireRole("operator"), vaccinoController.createVaccino);

// Leggere tutti i vaccini
router.get("/readAllVaccini", authenticate, requireRole("operator"), vaccinoController.getAllVaccini);

// Legge tutti i vaccini, uno o più vaccini specifici, i vaccini con tot disponibilità, con tot data di scadenza
router.get(
    "/vaccini",
    authenticate,
    vaccinoController.searchVaccini
);

// Leggere un singolo vaccino
router.get("/:id", authenticate, requireRole("operator"), vaccinoController.getVaccinoById);

// Leggere un vaccino dato il nome
router.get("/:nome", authenticate, requireRole("operator"), vaccinoController.getVaccinoByNome);

// Update vaccino
router.put("/:id", authenticate, requireRole("operator"), vaccinoController.updateVaccino);

// Cancellazione vaccino
router.delete("/:id", authenticate, requireRole("operator"), vaccinoController.deleteVaccino);

export default router