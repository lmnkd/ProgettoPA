import { Router } from "express";
import { vaccinazioneController } from "../controller/VaccinazioneController";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { checkTokenAvailability } from "../middleware/token.middleware";
import { checkCoverageExpired, checkLottoValid, checkUserExists, checkVaccineNotExpired } from "../middleware/vaccinazione.middleware";

const router = Router();

// Creare vaccinazione con tutti i limiti richiesti dalla consegna del progetto
router.post(
    "/vaccinazioni",
    authenticate,
    requireRole("operator"),
    checkUserExists,
    checkLottoValid,
    checkVaccineNotExpired,
    checkCoverageExpired,
    checkTokenAvailability,
    vaccinazioneController.createVaccinazione
);


// Ottenere una singola vaccinazione
router.get('/vaccinazioni/:id', authenticate, requireRole("operator"), vaccinazioneController.getVaccinazioneById);

// Ottenere tutte le vaccinazioni
router.get('/vaccinazioni', authenticate, requireRole("operator"), vaccinazioneController.getAllVaccinazioni);

// Update vaccinazione
router.put('/vaccinazioni/:id', authenticate, requireRole("operator"), checkUserExists, checkLottoValid, checkTokenAvailability, vaccinazioneController.updateVaccinazione);

// cancellazione vaccinazione
router.delete('/vaccinazioni/:id', authenticate, requireRole("operator"), vaccinazioneController.deleteVaccinazione);

// creazione pdf admin richiederà con /pdf?cf=codicefiscaleuser
router.get("/pdf", authenticate, vaccinazioneController.pdfVaccinazione);

export default router;