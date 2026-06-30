import { Router } from "express";
import { vaccinoController } from "../controller/VaccinoController";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { checkVaccinoExistsById, checkNomeVaccinoUnique } from "../middleware/vaccino.middleware";

const router = Router();

// Creazione vaccino (i nomi non si possono ripetere)
router.post("/creavaccino", authenticate, requireRole("operator"), checkNomeVaccinoUnique, vaccinoController.createVaccino);

// Leggere tutti i vaccini
router.get("/readAllVaccini", authenticate, requireRole("operator"), vaccinoController.getAllVaccini);

// Legge tutti i vaccini, uno o più vaccini specifici, filtrabile per disponibilità/scadenza
router.get("/vaccini", authenticate, requireRole("operator"), vaccinoController.searchVaccini);

router.get("/statistiche", authenticate, requireRole("operator"), vaccinoController.getStatistiche);

router.get("/statistiche/copertura", authenticate, requireRole("operator"), vaccinoController.getStatisticheCopertura);

// Leggere un singolo vaccino
router.get("/:id", authenticate, requireRole("operator"), checkVaccinoExistsById, vaccinoController.getVaccinoById);

// Update vaccino
router.put("/:id", authenticate, requireRole("operator"), checkVaccinoExistsById, checkNomeVaccinoUnique, vaccinoController.updateVaccino);

// Cancellazione vaccino
router.delete("/:id", authenticate, requireRole("operator"), checkVaccinoExistsById, vaccinoController.deleteVaccino);

export default router;