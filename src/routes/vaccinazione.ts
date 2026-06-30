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

// PDF storico vaccinazioni [A,U] — admin/operator specifica cf in query, user usa il proprio dal JWT
router.get("/pdf", authenticate, vaccinazioneController.pdfVaccinazione);

// vaccinazioni filtrate [A,U] /api/vaccinazioni/filtrareuseradmin?nomeVaccino=pfizer&dataMin=2024-01-01&dataMax=2024-12-31
router.get("/filtrareuseradmin", authenticate, vaccinazioneController.getFilteredVaccinazioni);

// Report copertura JSON [A,U] — admin vede tutti (o filtra con cf), user solo le proprie
router.get("/copertura", authenticate, vaccinazioneController.getCoperturaReport);

// Report copertura PDF [A,U]
router.get("/copertura/pdf", authenticate, vaccinazioneController.getCoperturaPdf);

// Bypass JWT tramite codice OTP Redis [nessuna autenticazione, il codice sostituisce il JWT]
router.get("/copertura/code", vaccinazioneController.getCoperturaByCode);

export default router;