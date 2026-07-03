import { Router } from "express";
import { vaccinazioneController } from "../controller/VaccinazioneController";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { checkTokenAvailability } from "../middleware/token.middleware";
import { checkCoverageExpired, checkFiltriVaccinazione, checkLottoValid, checkUserExists, checkVaccineNotExpired } from "../middleware/vaccinazione.middleware";
import { checkNomeVaccinoExists } from "../middleware/vaccino.middleware";
import { userExist } from "../middleware/redis.middleware";

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

// Update vaccinazione da inserire nel body cf e lotto id altrimenti non si può aggiornare la vaccinazione
router.patch('/vaccinazioni/:id', authenticate, requireRole("operator", "admin"), userExist, checkLottoValid, checkTokenAvailability, vaccinazioneController.updateVaccinazione);

// cancellazione vaccinazione
router.delete('/vaccinazioni/:id', authenticate, requireRole("admin", "operator"), vaccinazioneController.deleteVaccinazione);

// PDF storico vaccinazioni [A,U] — admin/operator specifica cf in query, user usa il proprio dal JWT
router.get("/pdf", authenticate, requireRole("admin", "user"), vaccinazioneController.pdfVaccinazione);

// vaccinazioni filtrate [A,U] /api/vaccinazioni/filtrareuseradmin?nomeVaccino=pfizer&dataMin=2024-01-01&dataMax=2024-12-31
router.get("/filtrareuseradmin", authenticate, requireRole("admin", "user"), checkNomeVaccinoExists, checkFiltriVaccinazione, vaccinazioneController.getFilteredVaccinazioni);

// Report copertura JSON [A,U] — admin vede tutti (filtra con cf), user solo le proprie ?cf=RSSMRA80A01H501U&order=desc
router.get("/copertura", authenticate, requireRole("admin", "user"),userExist, vaccinazioneController.getCoperturaReport);

// Report copertura PDF [A,U]
router.get("/copertura/pdf", authenticate, requireRole("admin", "user"),userExist, vaccinazioneController.getCoperturaPdf);

// Bypass JWT tramite codice OTP Redis [nessuna autenticazione, il codice sostituisce il JWT]
router.get("/copertura/code", authenticate, requireRole("admin"), vaccinazioneController.getCoperturaByCode);

export default router;