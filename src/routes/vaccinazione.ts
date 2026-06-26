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

// vaccinazioni filtrate /api/vaccinazioni/filtrate?nome=pfizer&dataMin=2024-01-01&dataMax=2024-12-31 o /api/vaccinazioni/filtrate?nome=moderna&before=2024-06-01
router.get("/filtrareuseradmin", authenticate, vaccinazioneController.getFilteredVaccinazioni);

// Vaccinazione con copertura, admin può vederle di tutti(può filtrare mettendo cf) mentre l'user solo le sue. http://localhost:3000/api/vaccinazioni/copertura?order=asc order per vederli in ordine ascendente o discendente
router.get("/copertura", authenticate, vaccinazioneController.getCoperturaReport);

// Rotta di prima ma con il pdf scaricato, differenza funziona per un dato utente, quindi cf deve essere inserito nella query
router.get("/copertura/pdf", authenticate, vaccinazioneController.getCoperturaPdf);

// Inserendo nella richiesta il code posso andare oltre il JWT /copertura/json?code=550e8400, se voglio farlo per un utente secifico basta creare con il post un token utilizzando il suo CF
router.get("/copertura/code", vaccinazioneController.getCoperturaByCode)


export default router;