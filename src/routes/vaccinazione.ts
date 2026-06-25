import { Router } from "express";
import { vaccinazioneController } from "../controller/VaccinazioneController";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { checkTokenAvailability } from "../middleware/token.middleware";
import { checkCoverageExpired, checkLottoValid, checkUserExists, checkVaccineNotExpired } from "../middleware/vaccinazione.middleware";

const router = Router();


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

router.get('/vaccinazioni/:id', authenticate, requireRole("operator"), vaccinazioneController.getVaccinazioneById);


router.get('/vaccinazioni', authenticate, requireRole("operator"), vaccinazioneController.getAllVaccinazioni);


router.put('/vaccinazioni/:id', authenticate, requireRole("operator"), checkUserExists, checkLottoValid, checkTokenAvailability, vaccinazioneController.updateVaccinazione);


router.delete('/vaccinazioni/:id', authenticate, requireRole("operator"), vaccinazioneController.deleteVaccinazione);


export default router;