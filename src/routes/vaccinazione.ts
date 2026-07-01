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
    requireRole("operator", "admin"),
    checkUserExists,
    checkLottoValid,
    checkVaccineNotExpired,
    checkCoverageExpired,
    checkTokenAvailability,
    vaccinazioneController.createVaccinazione
);

// Ottenere una singola vaccinazione
router.get('/vaccinazioni/:id', authenticate, requireRole("operator", "admin"), vaccinazioneController.getVaccinazioneById);

// Ottenere tutte le vaccinazioni
router.get('/vaccinazioni', authenticate, requireRole("admin"), vaccinazioneController.getAllVaccinazioni);

// Update vaccinazione
router.patch('/vaccinazioni/:id', authenticate, requireRole("operator", "admin"), checkUserExists, checkLottoValid, checkTokenAvailability, vaccinazioneController.updateVaccinazione);

// cancellazione vaccinazione
router.delete('/vaccinazioni/:id', authenticate, requireRole("admin", "operator"), vaccinazioneController.deleteVaccinazione);

// PDF storico vaccinazioni [A,U] — admin/operator specifica cf in query, user usa il proprio dal JWT
router.get("/pdf", authenticate, requireRole("admin", "user"), vaccinazioneController.pdfVaccinazione);

// vaccinazioni filtrate [A,U] /api/vaccinazioni/filtrareuseradmin?nomeVaccino=pfizer&dataMin=2024-01-01&dataMax=2024-12-31
router.get("/filtrareuseradmin", authenticate, requireRole("admin", "user"), vaccinazioneController.getFilteredVaccinazioni);

// Report copertura JSON [A,U] — admin vede tutti (o filtra con cf), user solo le proprie ?cf=RSSMRA80A01H501U&order=desc
router.get("/copertura", authenticate, requireRole("admin", "user"), vaccinazioneController.getCoperturaReport);

// Report copertura PDF [A,U]
router.get("/copertura/pdf", authenticate, requireRole("admin", "user"), vaccinazioneController.getCoperturaPdf);

// Bypass JWT tramite codice OTP Redis [nessuna autenticazione, il codice sostituisce il JWT]
router.get("/copertura/code", authenticate, requireRole("admin"), vaccinazioneController.getCoperturaByCode);

export default router;