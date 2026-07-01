import { Router } from "express";
import { vaccinoController } from "../controller/VaccinoController";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { checkVaccinoExistsById, checkNomeVaccinoUnique } from "../middleware/vaccino.middleware";

const router = Router();

// Creazione vaccino (i nomi non si possono ripetere)
router.post("/vaccino", authenticate, requireRole("admin"), checkNomeVaccinoUnique, vaccinoController.createVaccino);

// Leggere tutti i vaccini
router.get("/vaccini", authenticate, requireRole("admin"), vaccinoController.getAllVaccini);

// Legge tutti i vaccini, uno o più vaccini specifici, filtrabile per disponibilità/scadenza, da mettere come query string, ad esempio: /vacciniFiltrati?nomeVaccino=pfizer&disponibile=true&scaduto=false
router.get("/vacciniFiltrati", authenticate, requireRole("admin"), vaccinoController.searchVaccini);

// Statistiche generali sui vaccini, ad esempio numero di vaccinazioni per vaccino, numero di lotti scaduti, ecc.
router.get("/statistiche", authenticate, requireRole("admin"), vaccinoController.getStatistiche);

// Statistiche sulla copertura vaccinale, ad esempio percentuale di popolazione vaccinata per ogni tipo di vaccino, numero di persone con copertura scaduta, ecc.
router.get("/statistiche/copertura", authenticate, requireRole("admin"), vaccinoController.getStatisticheCopertura);

// Leggere un singolo vaccino
router.get("/:id", authenticate, requireRole("operator", "admin"), checkVaccinoExistsById, vaccinoController.getVaccinoById);

// Update vaccino
router.patch("/:id", authenticate, requireRole("admin"), checkVaccinoExistsById, checkNomeVaccinoUnique, vaccinoController.updateVaccino);

// Cancellazione vaccino
router.delete("/:id", authenticate, requireRole("admin"), checkVaccinoExistsById, vaccinoController.deleteVaccino);

export default router;